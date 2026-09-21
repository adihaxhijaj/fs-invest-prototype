export interface Rect { x: number; y: number; w: number; h: number }

/* ---- squarified treemap (Bruls, Huizing, van Wijk) ---------------- */
interface Item<T> { value: number; data: T }

export function squarify<T>(items: Item<T>[], rect: Rect): (Rect & { data: T })[] {
  const out: (Rect & { data: T })[] = [];
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total <= 0) return out;
  const area = rect.w * rect.h;
  const scaled = items.map((i) => ({ ...i, value: (i.value / total) * area }));
  layout(scaled, { ...rect }, out);
  return out;
}

function worst(row: number[], len: number, sum: number): number {
  const max = Math.max(...row), min = Math.min(...row);
  const s2 = sum * sum, l2 = len * len;
  return Math.max((l2 * max) / s2, s2 / (l2 * min));
}

function layout<T>(items: Item<T>[], rect: Rect, out: (Rect & { data: T })[]): void {
  let rest = items.slice();
  while (rest.length) {
    const horizontal = rect.w >= rect.h;
    const len = horizontal ? rect.h : rect.w;
    const row: Item<T>[] = [];
    let sum = 0;
    while (rest.length) {
      const next = rest[0];
      const cur = row.map((r) => r.value);
      const withNext = [...cur, next.value];
      if (row.length === 0 || worst(withNext, len, sum + next.value) <= worst(cur, len, sum)) {
        row.push(next); sum += next.value; rest.shift();
      } else break;
    }
    const thickness = sum / len;
    let offset = 0;
    for (const item of row) {
      const side = item.value / thickness;
      if (horizontal) {
        out.push({ x: rect.x, y: rect.y + offset, w: thickness, h: side, data: item.data });
      } else {
        out.push({ x: rect.x + offset, y: rect.y, w: side, h: thickness, data: item.data });
      }
      offset += side;
    }
    if (horizontal) { rect.x += thickness; rect.w -= thickness; }
    else { rect.y += thickness; rect.h -= thickness; }
    if (rect.w <= 1e-6 || rect.h <= 1e-6) break;
  }
}

/* ---- shared-edge detection, used to place doors ------------------- */
export type Side = 'n' | 's' | 'e' | 'w';

export interface Edge { side: Side; x: number; y: number; len: number }

const near = (a: number, b: number, e = 0.02) => Math.abs(a - b) < e;

export function sharedEdge(a: Rect, b: Rect): Edge | null {
  // vertical contact
  if (near(a.x + a.w, b.x) || near(b.x + b.w, a.x)) {
    const y0 = Math.max(a.y, b.y), y1 = Math.min(a.y + a.h, b.y + b.h);
    if (y1 - y0 > 0.9) {
      const east = near(a.x + a.w, b.x);
      return { side: east ? 'e' : 'w', x: east ? a.x + a.w : a.x, y: (y0 + y1) / 2, len: y1 - y0 };
    }
  }
  // horizontal contact
  if (near(a.y + a.h, b.y) || near(b.y + b.h, a.y)) {
    const x0 = Math.max(a.x, b.x), x1 = Math.min(a.x + a.w, b.x + b.w);
    if (x1 - x0 > 0.9) {
      const south = near(a.y + a.h, b.y);
      return { side: south ? 's' : 'n', x: (x0 + x1) / 2, y: south ? a.y + a.h : a.y, len: x1 - x0 };
    }
  }
  return null;
}

export const polygonPoints = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ');
