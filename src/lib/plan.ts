/* ------------------------------------------------------------------
   Architectural plan generator.

   Floor plates and apartment layouts are derived from the structured
   unit data — no plan is drawn by hand and no plan is duplicated across
   floors. Areas are exact; room subdivision is indicative and is
   replaced wholesale when FS supplies the architectural drawings.
-------------------------------------------------------------------*/
import type { Block, Typology } from '../data/types.ts';
import { floorSlots, type FloorSlot } from '../data/units.ts';
import { type Rect, squarify } from './geometry.ts';

export const M = 10;                       // svg units per metre
export const px = (m: number) => +(m * M).toFixed(2);

export interface Room { name: string; short: string; area: number; wet: boolean; rect: Rect }

/* ---- room programme ---------------------------------------------- */

interface Seed { name: string; short: string; base: number; wet: boolean }

function programSeeds(t: Typology): Seed[] {
  const r = t.rooms;
  const s: Seed[] = [];
  const big = t.area >= 110, mid = t.area >= 85;
  if (r.living) s.push({ name: 'Qëndrim ditor', short: 'QD', base: big ? 32 : mid ? 26 : 21, wet: false });
  if (r.kitchen) s.push({ name: 'Kuzhina', short: 'KU', base: big ? 12 : 9.5, wet: true });
  for (let i = 0; i < r.bedrooms; i++) {
    s.push({
      name: r.bedrooms > 1 && i === 0 ? 'Dhoma e gjumit I' : r.bedrooms > 1 ? `Dhoma e gjumit ${['I', 'II', 'III', 'IV'][i]}` : 'Dhoma e gjumit',
      short: `D${i + 1}`, base: i === 0 ? (big ? 17 : 14.5) : 11.8, wet: false,
    });
  }
  for (let i = 0; i < r.bathrooms; i++) s.push({ name: r.bathrooms > 1 ? `Banjo ${i + 1}` : 'Banjo', short: 'BA', base: 5.0, wet: true });
  if (r.wc) s.push({ name: 'WC', short: 'WC', base: 2.3, wet: true });
  if (r.utility) s.push({ name: 'Hapësirë ndihmëse', short: 'HN', base: 4.2, wet: true });
  if (r.storage) s.push({ name: 'Depo', short: 'DP', base: 3.2, wet: false });
  if (r.hall) s.push({ name: 'Holli', short: 'HO', base: mid ? 9 : 6.5, wet: false });
  return s;
}

/** Exact-sum room programme. Interior rooms always total the published area. */
export function roomProgram(t: Typology): { name: string; short: string; area: number; wet: boolean }[] {
  const seeds = programSeeds(t);
  const sum = seeds.reduce((a, b) => a + b.base, 0);
  const k = t.area / sum;
  const out = seeds.map((s) => ({ name: s.name, short: s.short, area: +(s.base * k).toFixed(1), wet: s.wet }));
  const diff = +(t.area - out.reduce((a, b) => a + b.area, 0)).toFixed(1);
  if (out.length) out[0].area = +(out[0].area + diff).toFixed(1);
  return out;
}

/** Outdoor area shown alongside the interior programme. */
export function outdoorArea(t: Typology): { name: string; area: number } | null {
  if (t.kind === 'penthouse' && t.terraceArea) return { name: 'Terrasa', area: t.terraceArea };
  if (t.rooms.balcony) return { name: 'Ballkoni', area: +(Math.min(9, Math.max(4.5, t.area * 0.075))).toFixed(1) };
  return null;
}

/* ---- unit layout -------------------------------------------------- */

/** Hall first against the entrance wall, wet rooms next to it, then living space. */
export function unitLayout(t: Typology, rect: Rect, entrance: 'n' | 's'): Room[] {
  const prog = roomProgram(t);
  const hall = prog.find((p) => p.short === 'HO');
  const rest = prog.filter((p) => p !== hall);

  const rooms: Room[] = [];
  let body = { ...rect };

  if (hall) {
    const depth = Math.min(2.6, Math.max(1.4, hall.area / rect.w));
    const hallRect: Rect = entrance === 'n'
      ? { x: rect.x, y: rect.y, w: hall.area / depth, h: depth }
      : { x: rect.x, y: rect.y + rect.h - depth, w: hall.area / depth, h: depth };
    hallRect.w = Math.min(hallRect.w, rect.w);
    rooms.push({ ...hall, rect: hallRect });
    // remaining L-shape approximated by two zones: strip beside the hall + main body
    const stripW = rect.w - hallRect.w;
    if (stripW > 1.6) {
      const strip: Rect = entrance === 'n'
        ? { x: hallRect.x + hallRect.w, y: rect.y, w: stripW, h: depth }
        : { x: hallRect.x + hallRect.w, y: rect.y + rect.h - depth, w: stripW, h: depth };
      const wet = rest.filter((p) => p.wet);
      const stripArea = strip.w * strip.h;
      const take: typeof rest = [];
      let acc = 0;
      for (const w of wet) { if (acc + w.area <= stripArea + 0.6) { take.push(w); acc += w.area; } }
      if (take.length) {
        const placed = squarify(take.map((d) => ({ value: d.area, data: d })), strip);
        placed.forEach((p) => rooms.push({ ...p.data, rect: { x: p.x, y: p.y, w: p.w, h: p.h } }));
        for (const p of take) rest.splice(rest.indexOf(p), 1);
      }
    }
    body = entrance === 'n'
      ? { x: rect.x, y: rect.y + depth, w: rect.w, h: rect.h - depth }
      : { x: rect.x, y: rect.y, w: rect.w, h: rect.h - depth };
  }

  const order = rest.slice().sort((a, b) => b.area - a.area);
  const placed = squarify(order.map((d) => ({ value: d.area, data: d })), body);
  placed.forEach((p) => rooms.push({ ...p.data, rect: { x: p.x, y: p.y, w: p.w, h: p.h } }));
  return rooms;
}

/* ---- floor plate --------------------------------------------------- */

export const CORRIDOR = 1.6;
export const CORE_BAND = 3.4;
export const BAND = CORRIDOR * 2 + CORE_BAND;
export const BALCONY = 1.5;

export interface PlacedUnit { slot: FloorSlot; rect: Rect; entrance: 'n' | 's'; balcony: Rect | null }

export interface Plate {
  width: number; frontDepth: number; backDepth: number; depth: number;
  units: PlacedUnit[]; core: Rect; corridorFront: Rect; corridorBack: Rect;
}

export function floorPlate(block: Block, floor: number): Plate {
  const slots = floorSlots(block.id, floor);
  const front = slots.filter((s) => s.row === 'front');
  const back = slots.filter((s) => s.row === 'back');
  const W = block.plate.width;
  const areaOf = (list: FloorSlot[]) => list.reduce((a, s) => a + s.typology.area, 0);
  const frontDepth = front.length ? areaOf(front) / W : 0;
  const backDepth = back.length ? areaOf(back) / W : 0;
  const depth = frontDepth + BAND + backDepth;

  const units: PlacedUnit[] = [];
  /* North is up. The north-facing row sits at the top of the plate, the
     south-facing row at the bottom, so plan and orientation agree. */
  let x = 0;
  const frontY = backDepth + BAND;
  for (const s of back) {
    const w = s.typology.area / backDepth;
    const rect: Rect = { x, y: 0, w, h: backDepth };
    const hasOutdoor = s.typology.rooms.balcony || s.typology.rooms.terrace;
    units.push({
      slot: s, rect, entrance: 's',
      balcony: hasOutdoor ? { x: x + w * 0.14, y: -BALCONY, w: w * 0.68, h: BALCONY } : null,
    });
    x += w;
  }
  x = 0;
  for (const s of front) {
    const w = s.typology.area / frontDepth;
    const rect: Rect = { x, y: frontY, w, h: frontDepth };
    const hasOutdoor = s.typology.rooms.balcony || s.typology.rooms.terrace;
    units.push({
      slot: s, rect, entrance: 'n',
      balcony: hasOutdoor ? { x: x + w * 0.14, y: frontY + frontDepth, w: w * 0.68, h: BALCONY } : null,
    });
    x += w;
  }
  units.sort((a, b) => a.slot.slot - b.slot.slot);

  const coreW = Math.min(9.4, W * 0.34);
  return {
    width: W, frontDepth, backDepth, depth, units,
    core: { x: (W - coreW) / 2, y: backDepth + CORRIDOR, w: coreW, h: CORE_BAND },
    corridorFront: { x: 0, y: backDepth, w: W, h: CORRIDOR },
    corridorBack: { x: 0, y: backDepth + CORRIDOR + CORE_BAND, w: W, h: CORRIDOR },
  };
}
