import type { Availability, Typology, Unit } from './types.ts';
import { project } from './project.ts';
import { typologies, typologyOrder, typologyRow } from './typologies.ts';

/* Deterministic PRNG so availability never shifts between builds. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rand(seed: string): number {
  let t = hash(seed) + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export interface FloorSlot {
  typology: Typology;
  row: 'front' | 'back';
  /** 0-based index within its row, left → right */
  index: number;
  /** 1-based unit number on the floor */
  slot: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Which layouts occur on a given floor, and in which order across the plate. */
export function floorSlots(blockId: string, floor: number): FloorSlot[] {
  const present = typologies
    .filter((t) => t.blockId === blockId && floor >= t.floorFrom && floor <= t.floorTo);

  const front = present.filter((t) => typologyRow(t.id) === 'front')
    .sort((a, b) => typologyOrder(a.id) - typologyOrder(b.id));
  const back = present.filter((t) => typologyRow(t.id) === 'back')
    .sort((a, b) => typologyOrder(a.id) - typologyOrder(b.id));

  const out: FloorSlot[] = [];
  front.forEach((t, i) => out.push({ typology: t, row: 'front', index: i, slot: out.length + 1 }));
  back.forEach((t, i) => out.push({ typology: t, row: 'back', index: i, slot: out.length + 1 }));
  return out;
}

export const unitId = (blockCode: string, floor: number, slot: number) =>
  `${blockCode}${pad(floor)}-${pad(slot)}`;

/* A handful of units are pinned so the presentation path is predictable. */
const pinned: Record<string, Availability> = {
  'B07-03': 'available',
  'B07-02': 'sold',
  'B07-05': 'reserved',
  'B04-03': 'available',
  'B05-03': 'sold',
  'B06-03': 'available',
  'B08-03': 'reserved',
  'B09-03': 'available',
  'B10-03': 'available',
  'B11-03': 'sold',
  'A07-01': 'available',
  'B12-01': 'available',
};

function availabilityFor(id: string, floor: number, kind: string): Availability {
  if (pinned[id]) return pinned[id];
  const r = rand(id);
  if (kind === 'penthouse') return r < 0.34 ? 'sold' : r < 0.55 ? 'reserved' : 'available';
  const sold = 0.55 - floor * 0.025;
  if (r < sold) return 'sold';
  if (r < sold + 0.15) return 'reserved';
  return 'available';
}

export const units: Unit[] = [];

for (const block of project.blocks) {
  for (let floor = 1; floor <= block.floors; floor++) {
    for (const fs of floorSlots(block.id, floor)) {
      const id = unitId(block.code, floor, fs.slot);
      units.push({
        id,
        projectId: project.id,
        blockId: block.id,
        floor,
        slot: fs.slot,
        typologyId: fs.typology.id,
        kind: fs.typology.kind,
        availability: availabilityFor(id, floor, fs.typology.kind),
        /* Prices are not published by FS. The field and the UI support exact
           values; until FS supplies them every unit is "Kërko ofertë". */
        price: null,
      });
    }
  }
}

const unitIndex = new Map(units.map((u) => [u.id, u]));
export const unitById = (id: string): Unit | undefined => unitIndex.get(id);

export const unitsOfBlock = (blockId: string) => units.filter((u) => u.blockId === blockId);
export const unitsOfFloor = (blockId: string, floor: number) =>
  units.filter((u) => u.blockId === blockId && u.floor === floor).sort((a, b) => a.slot - b.slot);

/** Every physical unit that repeats the same layout, ordered by floor. */
export const unitsOfTypology = (typologyId: string) =>
  units.filter((u) => u.typologyId === typologyId).sort((a, b) => a.floor - b.floor);

export interface Tally { total: number; available: number; reserved: number; sold: number }
export function tally(list: Unit[]): Tally {
  return {
    total: list.length,
    available: list.filter((u) => u.availability === 'available').length,
    reserved: list.filter((u) => u.availability === 'reserved').length,
    sold: list.filter((u) => u.availability === 'sold').length,
  };
}

export const blockTally = (blockId: string) => tally(unitsOfBlock(blockId));
export const floorTally = (blockId: string, floor: number) => tally(unitsOfFloor(blockId, floor));
export const projectTally = () => tally(units);
