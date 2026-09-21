/* Renders the generated geometry as clean architectural line drawings. */
import type { Block, Typology, Unit } from '../data/types.ts';
import { byId } from '../data/typologies.ts';
import { unitsOfFloor } from '../data/units.ts';
import { type Rect, sharedEdge } from './geometry.ts';
import { BALCONY, floorPlate, outdoorArea, px, type Room, unitLayout } from './plan.ts';

const r2 = (r: Rect) => `x="${px(r.x)}" y="${px(r.y)}" width="${px(r.w)}" height="${px(r.h)}"`;

/* ---- wall / opening primitives ------------------------------------ */

type WSide = 'n' | 's' | 'e' | 'w';
function windowsOn(rect: Rect, bounds: Rect, exclude: boolean, sides: WSide[]): string {
  if (exclude) return '';
  const out: string[] = [];
  const e = 0.02;
  const seg = (x1: number, y1: number, x2: number, y2: number) =>
    `<line class="pl-win-cut" x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}"/>` +
    `<line class="pl-win" x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}"/>`;
  const span = (len: number) => Math.min(len - 0.9, Math.max(1.1, len * 0.62));
  if (sides.includes('n') && Math.abs(rect.y - bounds.y) < e) {
    const w = span(rect.w), cx = rect.x + rect.w / 2;
    out.push(seg(cx - w / 2, rect.y, cx + w / 2, rect.y));
  }
  if (sides.includes('s') && Math.abs(rect.y + rect.h - (bounds.y + bounds.h)) < e) {
    const w = span(rect.w), cx = rect.x + rect.w / 2;
    out.push(seg(cx - w / 2, rect.y + rect.h, cx + w / 2, rect.y + rect.h));
  }
  if (sides.includes('w') && Math.abs(rect.x - bounds.x) < e) {
    const h = span(rect.h), cy = rect.y + rect.h / 2;
    out.push(seg(rect.x, cy - h / 2, rect.x, cy + h / 2));
  }
  if (sides.includes('e') && Math.abs(rect.x + rect.w - (bounds.x + bounds.w)) < e) {
    const h = span(rect.h), cy = rect.y + rect.h / 2;
    out.push(seg(rect.x + rect.w, cy - h / 2, rect.x + rect.w, cy + h / 2));
  }
  return out.join('');
}

function doorArc(x: number, y: number, side: 'n' | 's' | 'e' | 'w', w = 0.85): string {
  const leaf = w;
  let d = '';
  if (side === 'n' || side === 's') {
    const sgn = side === 's' ? 1 : -1;
    d = `M ${px(x - leaf / 2)} ${px(y)} L ${px(x - leaf / 2)} ${px(y + sgn * leaf)} A ${px(leaf)} ${px(leaf)} 0 0 ${sgn > 0 ? 0 : 1} ${px(x + leaf / 2)} ${px(y)}`;
  } else {
    const sgn = side === 'e' ? 1 : -1;
    d = `M ${px(x)} ${px(y - leaf / 2)} L ${px(x + sgn * leaf)} ${px(y - leaf / 2)} A ${px(leaf)} ${px(leaf)} 0 0 ${sgn > 0 ? 1 : 0} ${px(x)} ${px(y + leaf / 2)}`;
  }
  const gap = side === 'n' || side === 's'
    ? `<line class="pl-gap" x1="${px(x - leaf / 2)}" y1="${px(y)}" x2="${px(x + leaf / 2)}" y2="${px(y)}"/>`
    : `<line class="pl-gap" x1="${px(x)}" y1="${px(y - leaf / 2)}" x2="${px(x)}" y2="${px(y + leaf / 2)}"/>`;
  return `${gap}<path class="pl-door" d="${d}"/>`;
}

type Door = { x: number; y: number; side: WSide; leaf: number };

/* the square a door leaf sweeps, in metres — labels keep out of it */
function doorBox(d: Door): Rect {
  if (d.side === 'n' || d.side === 's') {
    const sgn = d.side === 's' ? 1 : -1;
    return { x: d.x - d.leaf / 2, y: Math.min(d.y, d.y + sgn * d.leaf), w: d.leaf, h: d.leaf };
  }
  const sgn = d.side === 'e' ? 1 : -1;
  return { x: Math.min(d.x, d.x + sgn * d.leaf), y: d.y - d.leaf / 2, w: d.leaf, h: d.leaf };
}

function doorsFor(rooms: Room[]): Door[] {
  const hall = rooms.find((r) => r.short === 'HO');
  const out: Door[] = [];
  const door = (x: number, y: number, side: WSide): Door => ({ x, y, side, leaf: 0.85 });
  for (const room of rooms) {
    if (room === hall) continue;
    const target = hall ?? rooms[0];
    if (room === target) continue;
    const edge = sharedEdge(room.rect, target.rect);
    if (edge) { out.push(door(edge.x, edge.y, edge.side)); continue; }
    // fall back to the largest neighbour that shares an edge
    let best: { e: ReturnType<typeof sharedEdge>; a: number } | null = null;
    for (const other of rooms) {
      if (other === room) continue;
      const se = sharedEdge(room.rect, other.rect);
      if (se && (!best || other.area > best.a)) best = { e: se, a: other.area };
    }
    if (best && best.e) out.push(door(best.e.x, best.e.y, best.e.side));
  }
  return out;
}


/* Fits a room label inside its rectangle: shrinks, wraps, then abbreviates.
   `avoid` are door sweeps (metres); the label moves to the nearest spot in
   the room clear of them, dropping the area line if that's what it takes. */
function roomLabel(name: string, short: string, area: number, rect: Rect, base = 3.4, avoid: Rect[] = []): string {
  const cyU = px(rect.y + rect.h / 2);
  const avail = px(rect.w) - 6;
  const availH = px(rect.h) - 4;
  const upper = name.toUpperCase();
  const widthAt = (txt: string, size: number) => txt.length * size * 0.70;

  let size = base;
  let lines: string[] = [upper];
  const min = base * 0.66;
  while (size > min && widthAt(upper, size) > avail) size -= base * 0.05;
  if (widthAt(upper, size) > avail) {
    const parts = upper.split(' ');
    if (parts.length > 1) {
      const mid = Math.ceil(parts.length / 2);
      lines = [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')];
      size = base * 0.92;
      while (size > min && Math.max(...lines.map((l) => widthAt(l, size))) > avail) size -= base * 0.04;
    }
  }
  if (Math.max(...lines.map((l) => widthAt(l, size))) > avail) { lines = [short]; size = base * 0.88; }
  if (widthAt(lines[0], size) > avail || availH < base * 2.2) return '';

  const areaTxt = `${area.toFixed(1)} m²`;
  let aSize = size * 0.86;
  let showArea = availH >= lines.length * size + base * 2.4 && widthAt(areaTxt, aSize) <= avail;
  let gap = size * 0.42;
  const blockOf = (s: number, withArea: boolean) => lines.length * (s + s * 0.42) + (withArea ? s * 0.86 * 1.9 : 0);
  let cxU = px(rect.x + rect.w / 2);
  let top = cyU - blockOf(size, showArea) / 2;

  if (avoid.length) {
    /* ink box of the block for a given top edge (ascent ≈ 1.05em, descent ≈ .3em) */
    const inkOf = (s: number, withArea: boolean, t: number) => {
      const g = s * 0.42, a = s * 0.86;
      const lastBase = t + s + (lines.length - 1) * (s + g);
      const bottom = withArea ? lastBase + s + g + a * 0.75 + a * 0.3 : lastBase + s * 0.3;
      const w = Math.max(...lines.map((l) => widthAt(l, s)), withArea ? widthAt(areaTxt, a) : 0);
      return { top: t - s * 0.08, bottom, w };
    };
    const blocks = avoid.map((r) => ({ l: px(r.x) - 0.6, r: px(r.x + r.w) + 0.6, t: px(r.y) - 0.6, b: px(r.y + r.h) + 0.6 }));
    const L = px(rect.x) + 1.5, R = px(rect.x + rect.w) - 1.5, T = px(rect.y) + 1, B = px(rect.y + rect.h) - 1;
    const place = (s: number, withArea: boolean) => {
      const t0 = cyU - blockOf(s, withArea) / 2;
      const ink0 = inkOf(s, withArea, t0);
      const h = ink0.bottom - ink0.top;
      let best: { cx: number; t: number; d: number } | null = null;
      for (let cx = L + ink0.w / 2; cx <= R - ink0.w / 2 + 0.01; cx += 0.5) {
        for (let it = T; it + h <= B + 0.01; it += 0.5) {
          const t = t0 + (it - ink0.top);
          const hit = blocks.some((o) => cx - ink0.w / 2 < o.r && cx + ink0.w / 2 > o.l && it < o.b && it + h > o.t);
          if (hit) continue;
          const d = Math.hypot(cx - cxU, t - t0);
          if (!best || d < best.d) best = { cx, t, d };
        }
      }
      return best;
    };
    /* keep the fitted size if possible; otherwise drop the area line, then
       step the type down to the same floor the fitting above uses */
    const tries: [number, boolean][] = [];
    if (showArea) tries.push([size, true]);
    for (let s = size; s >= min - 1e-6; s -= base * 0.05) tries.push([s, false]);
    for (const [s, withArea] of tries) {
      const spot = place(s, withArea);
      if (!spot) continue;
      size = s; aSize = s * 0.86; gap = s * 0.42; showArea = withArea;
      cxU = spot.cx; top = spot.t;
      break;
    }
  }

  let y = top + size;
  let out = '';
  for (const l of lines) {
    out += `<text class="pl-lbl" style="font-size:${size.toFixed(2)}px" x="${cxU.toFixed(1)}" y="${y.toFixed(1)}">${l}</text>`;
    y += size + gap;
  }
  if (showArea) out += `<text class="pl-area" style="font-size:${aSize.toFixed(2)}px" x="${cxU.toFixed(1)}" y="${(y + aSize * 0.75).toFixed(1)}">${areaTxt}</text>`;
  return out;
}

/* ---- single apartment plan ----------------------------------------- */

export function unitPlanSvg(t: Typology, opts: { labels?: boolean; id?: string } = {}): string {
  const labels = opts.labels !== false;
  const ratio = t.kind === 'penthouse' ? 1.45 : 1.28;
  const h = Math.sqrt(t.area / ratio);
  const w = t.area / h;
  const rect: Rect = { x: 0, y: 0, w, h };
  const rooms = unitLayout(t, rect, 's');
  const out = outdoorArea(t);
  const balconyDepth = t.kind === 'penthouse' ? 3.2 : BALCONY;
  const hasOutdoor = !!out;
  const pad = 1.6;
  const top = hasOutdoor ? balconyDepth : 0;
  const vb = `${px(-pad)} ${px(-top - pad)} ${px(w + pad * 2)} ${px(h + top + pad * 2)}`;

  const bal = hasOutdoor
    ? `<rect class="pl-balcony" x="${px(w * 0.1)}" y="${px(-balconyDepth)}" width="${px(w * 0.7)}" height="${px(balconyDepth)}"/>` +
      (labels ? `<text class="pl-lbl pl-lbl-out" style="font-size:3px" x="${px(w * 0.45)}" y="${px(-balconyDepth / 2) + 1}">${out!.name.toUpperCase()} · ${out!.area.toFixed(1)} m²</text>` : '')
    : '';

  let wins = '';
  /* interior doors plus the entrance, which swings up into the hall */
  const ho = rooms.find((r) => r.short === 'HO')?.rect;
  const doors: Door[] = [...doorsFor(rooms), { x: ho ? ho.x + ho.w / 2 : w / 2, y: h, side: 'n', leaf: 1.0 }];
  const sweeps = doors.map(doorBox);
  const body = rooms.map((room) => {
    wins += windowsOn(room.rect, rect, room.wet && room.area < 6, ['n', 'e', 'w']);
    const label = labels ? roomLabel(room.name, room.short, room.area, room.rect, undefined, sweeps) : '';
    return `<g class="pl-room"><rect class="pl-room-fill" ${r2(room.rect)}/><rect class="pl-wall-in" ${r2(room.rect)}/>${label}</g>`;
  }).join('');

  return `<svg class="plan plan--unit" viewBox="${vb}" role="img" aria-label="Plani i banesës ${t.code}"${opts.id ? ` id="${opts.id}"` : ''} preserveAspectRatio="xMidYMid meet">
  <g class="pl-root">
    ${bal}
    <rect class="pl-slab" ${r2(rect)}/>
    ${body}
    ${doors.slice(0, -1).map((d) => doorArc(d.x, d.y, d.side, d.leaf)).join('')}
    <rect class="pl-wall-out" ${r2(rect)}/>
    <g class="pl-windows">${wins}</g>
    ${doorArc(doors[doors.length - 1].x, h, 'n', doors[doors.length - 1].leaf)}
  </g>
</svg>`;
}

/* ---- floor plate plan ----------------------------------------------- */

export function floorPlanSvg(block: Block, floor: number): string {
  const plate = floorPlate(block, floor);
  const units: Unit[] = unitsOfFloor(block.id, floor);
  const pad = 2.2;
  const vb = `${px(-pad)} ${px(-BALCONY - pad)} ${px(plate.width + pad * 2)} ${px(plate.depth + BALCONY * 2 + pad * 2)}`;

  const core = plate.core;
  const liftW = 2.1, stairW = core.w - liftW * 2 - 0.6;
  const coreSvg = `
    <g class="pl-core">
      <rect class="pl-core-box" ${r2(core)}/>
      <rect class="pl-lift" x="${px(core.x + 0.15)}" y="${px(core.y + 0.4)}" width="${px(liftW)}" height="${px(core.h - 0.8)}"/>
      <rect class="pl-lift" x="${px(core.x + 0.3 + liftW)}" y="${px(core.y + 0.4)}" width="${px(liftW)}" height="${px(core.h - 0.8)}"/>
      <rect class="pl-stair" x="${px(core.x + core.w - stairW - 0.15)}" y="${px(core.y + 0.35)}" width="${px(stairW)}" height="${px(core.h - 0.7)}"/>
      ${Array.from({ length: 11 }, (_, i) => {
        const sx = core.x + core.w - stairW - 0.15 + ((i + 1) * stairW) / 12;
        return `<line class="pl-tread" x1="${px(sx)}" y1="${px(core.y + 0.35)}" x2="${px(sx)}" y2="${px(core.y + core.h - 0.35)}"/>`;
      }).join('')}
      <text class="pl-core-lbl" x="${px(core.x + core.w / 2)}" y="${px(core.y + core.h + 1.15)}">BËRTHAMA · ASHENSORËT</text>
    </g>`;

  const bandY = plate.corridorFront.y;
  const bandH = plate.corridorBack.y + plate.corridorBack.h - bandY;
  const corridors = `<rect class="pl-corridor" x="0" y="${px(bandY)}" width="${px(plate.width)}" height="${px(bandH)}"/>`;

  const allWins: string[] = [];
  const unitSvgs = plate.units.map((pu) => {
    const u = units.find((x) => x.slot === pu.slot.slot)!;
    const t = byId(pu.slot.typology.id);
    const rooms = unitLayout(t, pu.rect, pu.entrance);
    const isFirst = pu.rect.x < 0.01;
    const isLast = Math.abs(pu.rect.x + pu.rect.w - plate.width) < 0.01;
    const uSides: WSide[] = [pu.entrance === 'n' ? 's' : 'n', ...(isFirst ? ['w' as WSide] : []), ...(isLast ? ['e' as WSide] : [])];
    let uwins = '';
    // collected and drawn once, after the plate wall
    const inner = rooms.map((room) => {
      uwins += windowsOn(room.rect, pu.rect, room.wet && room.area < 6, uSides);
      return `<rect class="pl-room-fill" ${r2(room.rect)}/><rect class="pl-wall-in" ${r2(room.rect)}/>`;
    }).join('');
    allWins.push(uwins);
    const bal = pu.balcony ? `<rect class="pl-balcony" ${r2(pu.balcony)}/>` : '';
    const cx = pu.rect.x + pu.rect.w / 2;
    const cy = pu.rect.y + pu.rect.h / 2;
    return `<g class="pl-unit" data-unit="${u.id}" data-status="${u.availability}" data-typology="${t.code}" data-area="${t.area.toFixed(2)}" data-bedrooms="${t.rooms.bedrooms}" tabindex="0" role="button" aria-label="Banesa ${u.id}, ${t.area.toFixed(2)} metra katrorë">
      ${bal}
      <rect class="pl-unit-fill" ${r2(pu.rect)}/>
      <g class="pl-unit-rooms">${inner}</g>
      <rect class="pl-unit-wall" ${r2(pu.rect)}/>
      <g class="pl-unit-tag" transform="translate(${px(cx)} ${px(cy)})">
        <text class="pl-unit-id" y="-2">${u.id}</text>
        <text class="pl-unit-area" y="13">${t.area.toFixed(2)} m²</text>
      </g>
      <rect class="pl-unit-hit" ${r2(pu.rect)}/>
    </g>`;
  }).join('');
  allWins.push('');

  return `<svg class="plan plan--floor" viewBox="${vb}" role="group" aria-label="Plani i katit ${floor}, ${block.name}" preserveAspectRatio="xMidYMid meet">
  <g class="pl-root">
    <rect class="pl-slab" x="0" y="0" width="${px(plate.width)}" height="${px(plate.depth)}"/>
    ${corridors}
    ${coreSvg}
    ${unitSvgs}
    <rect class="pl-wall-out" x="0" y="0" width="${px(plate.width)}" height="${px(plate.depth)}"/>
    <g class="pl-windows">${allWins.join('')}</g>
    <g class="pl-compass" transform="translate(${px(plate.width + 1.1)} ${px(-BALCONY + 0.4)})">
      <line x1="0" y1="0" x2="0" y2="-11"/>
      <path d="M -3 -10 L 0 -16 L 3 -10 Z"/>
      <text y="10">V</text>
    </g>
  </g>
</svg>`;
}

/* ---- commercial unit plan --------------------------------------------- */
import type { CommercialUnit } from '../data/types.ts';
import { squarify } from './geometry.ts';

export function commercialPlanSvg(c: CommercialUnit, id?: string): string {
  const depth = Math.max(6, c.area / c.frontage);
  const rect: Rect = { x: 0, y: 0, w: c.frontage, h: depth };
  const parts = [
    { name: 'Hapësira e shitjes', area: +(c.area * 0.78).toFixed(1) },
    { name: 'Depo', area: +(c.area * 0.12).toFixed(1) },
    { name: 'WC', area: +(c.area * 0.05).toFixed(1) },
    { name: 'Teknike', area: +(c.area * 0.05).toFixed(1) },
  ];
  const placed = squarify(parts.map((p) => ({ value: p.area, data: p })), { ...rect });
  let cwins = '';
  const body = placed.map((p) => {
    const rr: Rect = { x: p.x, y: p.y, w: p.w, h: p.h };
    cwins += windowsOn(rr, rect, p.data.name === 'WC', ['s', 'e', 'w']);
    return `<g><rect class="pl-room-fill" ${r2(rr)}/><rect class="pl-wall-in" ${r2(rr)}/>` +
      roomLabel(p.data.name, p.data.name.slice(0, 4).toUpperCase(), p.data.area, rr) + `</g>`;
  }).join('');
  const pad = 1.8;
  return `<svg class="plan plan--unit" ${id ? `id="${id}" ` : ''}viewBox="${px(-pad)} ${px(-pad)} ${px(c.frontage + pad * 2)} ${px(depth + pad * 2)}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plani i ${c.label}">
  <g class="pl-root">
    <rect class="pl-slab" ${r2(rect)}/>
    ${body}
    <rect class="pl-wall-out" ${r2(rect)}/>
    <g class="pl-windows">${cwins}</g>
    <g class="pl-front"><line x1="0" y1="${px(depth + 0.7)}" x2="${px(c.frontage)}" y2="${px(depth + 0.7)}"/></g>
    <text class="pl-core-lbl" style="font-size:3px" x="${px(c.frontage / 2)}" y="${px(depth + 1.45)}">FRONTI I RRUGËS · ${c.frontage.toFixed(1)} m</text>
  </g>
</svg>`;
}

/* ---- ground-floor commercial strip over the render -------------------- */
export function commercialStripSvg(list: CommercialUnit[]): string {
  const zones = list.map((c) => `
    <g class="mp__zone cm__zone" data-unit="${c.id}" data-label="${c.label}" data-area="${c.area.toFixed(1)}"
       data-status="${c.availability}" data-href="/dardania/hapesira-afariste/${c.id.toLowerCase()}/"
       tabindex="0" role="link" aria-label="${c.label}, ${c.area.toFixed(1)} metra katrorë">
      <rect class="mp__shape cm__shape" x="${c.x}" y="450" width="${c.w}" height="52"></rect>
      <text class="cm__code" x="${c.x + c.w / 2}" y="443">${c.id.replace('L-', '')}</text>
    </g>`).join('');
  return `<svg class="mp__svg" viewBox="0 414 1080 180" preserveAspectRatio="xMidYMid meet" aria-label="Zgjedhja e hapësirës afariste">${zones}</svg>`;
}
