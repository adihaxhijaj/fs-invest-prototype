import type { Rooms, Typology } from './types.ts';

const R = (p: Partial<Rooms>): Rooms => ({
  living: 0, kitchen: 0, bedrooms: 0, bathrooms: 0, wc: 0,
  storage: 0, utility: 0, hall: 0, balcony: 0, terrace: 0, ...p,
});

/* ------------------------------------------------------------------
   BLOCK A — VERIFIED
   Source: https://fs-invest.international/product/apartament-a3_1..12/
   Areas, room tables and floor availability are taken verbatim from the
   current FS product pages. `row`/`order` are prototype layout metadata.
-------------------------------------------------------------------*/

type Row = 'front' | 'back';
interface Seed extends Omit<Typology, 'slot'> { row: Row; order: number }

const A: Seed[] = [
  { id: 'a3_1', code: 'A3_1', blockId: 'a', kind: 'residential', area: 84.00,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Jugperëndim', floorFrom: 3, floorTo: 12, row: 'front', order: 3,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet III – XII.',
    source: 'fs-website' },

  { id: 'a3_2', code: 'A3_2', blockId: 'a', kind: 'residential', area: 118.70,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Jugperëndim', floorFrom: 2, floorTo: 12, row: 'front', order: 4,
    description: 'Banesë e gjerë këndore, e disponueshme në katet II – XII.',
    source: 'fs-website',
    note: 'CONFLICT: FS product description says "tri dhoma gjumi"; the FS attribute table lists 2. Table used. Needs FS confirmation.' },

  { id: 'a3_3', code: 'A3_3', blockId: 'a', kind: 'residential', area: 63.30,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 1, bathrooms: 1, hall: 1, balcony: 1 }),
    orientation: 'Jug', floorFrom: 1, floorTo: 12, row: 'front', order: 1,
    description: 'Banesë me një dhomë gjumi, e disponueshme në katet I – XII.',
    source: 'fs-website' },

  { id: 'a3_4', code: 'A3_4', blockId: 'a', kind: 'residential', area: 84.00,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Verilindje', floorFrom: 1, floorTo: 2, row: 'back', order: 2,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet I – II.',
    source: 'fs-website' },

  { id: 'a3_5', code: 'A3_5', blockId: 'a', kind: 'residential', area: 96.50,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, utility: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Jugperëndim', floorFrom: 1, floorTo: 1, row: 'front', order: 5,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katin I.',
    source: 'fs-website' },

  { id: 'a3_6', code: 'A3_6', blockId: 'a', kind: 'residential', area: 91.80,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, wc: 1, hall: 1, balcony: 1 }),
    orientation: 'Verilindje', floorFrom: 2, floorTo: 12, row: 'back', order: 3,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet II – XII.',
    source: 'fs-website' },

  { id: 'a3_7', code: 'A3_7', blockId: 'a', kind: 'residential', area: 76.80,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, hall: 1, balcony: 1 }),
    orientation: 'Veri', floorFrom: 1, floorTo: 12, row: 'back', order: 4,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet I – XII.',
    source: 'fs-website' },

  { id: 'a3_8', code: 'A3_8', blockId: 'a', kind: 'residential', area: 95.20,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Verilindje', floorFrom: 3, floorTo: 12, row: 'back', order: 5,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet III – XII.',
    source: 'fs-website' },

  { id: 'a3_9', code: 'A3_9', blockId: 'a', kind: 'residential', area: 114.20,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 3, bathrooms: 2, wc: 1, hall: 1, balcony: 1 }),
    orientation: 'Verilindje', floorFrom: 1, floorTo: 1, row: 'back', order: 6,
    description: 'Banesë me tri dhoma gjumi, e disponueshme në katin I.',
    source: 'fs-website' },

  { id: 'a3_10', code: 'A3_10', blockId: 'a', kind: 'residential', area: 102.70,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, utility: 1, hall: 1, balcony: 1 }),
    orientation: 'Jugperëndim', floorFrom: 1, floorTo: 2, row: 'front', order: 6,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet I – II.',
    source: 'fs-website' },

  { id: 'a3_11', code: 'A3_11', blockId: 'a', kind: 'residential', area: 94.40,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, wc: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Jug', floorFrom: 1, floorTo: 12, row: 'front', order: 2,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet I – XII.',
    source: 'fs-website' },

  { id: 'a3_12', code: 'A3_12', blockId: 'a', kind: 'residential', area: 91.60,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }),
    orientation: 'Veri', floorFrom: 1, floorTo: 12, row: 'back', order: 1,
    description: 'Banesë me dy dhoma gjumi, e disponueshme në katet I – XII.',
    source: 'fs-website' },
];

/* ------------------------------------------------------------------
   BLOCKS B–E — DEMO
   Structure mirrors the verified Block A schema so real FS layouts can
   replace these records one-for-one. Only PH_01 carries verified figures.
-------------------------------------------------------------------*/

const mk = (
  id: string, blockId: string, area: number, rooms: Partial<Rooms>,
  row: Row, order: number, floorFrom: number, floorTo: number,
  orientation: string, extra: Partial<Seed> = {},
): Seed => ({
  id, code: id.toUpperCase(), blockId, kind: 'residential', area,
  rooms: R(rooms), orientation, floorFrom, floorTo, row, order,
  source: 'demo', ...extra,
});

const B: Seed[] = [
  mk('b_t01', 'b', 68.40, { living: 1, kitchen: 1, bedrooms: 1, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 1, 1, 11, 'Jug'),
  mk('b_t02', 'b', 79.10, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 2, 1, 11, 'Jug'),
  mk('b_t03', 'b', 92.40, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, wc: 1, storage: 1, hall: 1, balcony: 1 }, 'front', 3, 1, 11, 'Jugperëndim'),
  mk('b_t04', 'b', 106.80, { living: 1, kitchen: 1, bedrooms: 3, bathrooms: 1, wc: 1, storage: 1, hall: 1, balcony: 1 }, 'front', 4, 1, 11, 'Jugperëndim'),
  mk('b_t05', 'b', 88.20, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }, 'back', 1, 1, 11, 'Verilindje'),
  mk('b_t06', 'b', 74.60, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, hall: 1, balcony: 1 }, 'back', 2, 1, 11, 'Veri'),
  mk('b_t07', 'b', 118.30, { living: 1, kitchen: 1, bedrooms: 3, bathrooms: 2, wc: 1, storage: 1, hall: 1, balcony: 1 }, 'back', 3, 1, 11, 'Verilindje'),

  /* Penthouse level. PH_01 figures are published by FS. */
  { id: 'ph_01', code: 'PH_01', blockId: 'b', kind: 'penthouse', area: 150.40, terraceArea: 159.40,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 4, bathrooms: 2, storage: 1, utility: 1, hall: 1, terrace: 1 }),
    orientation: 'Jug / Perëndim', floorFrom: 12, floorTo: 12, row: 'front', order: 1,
    description: 'Penthouse me 150.40 m² hapësirë banimi dhe 159.40 m² terrasë.',
    source: 'fs-website' },
  { id: 'ph_02', code: 'PH_02', blockId: 'b', kind: 'penthouse', area: 132.60, terraceArea: 96.00,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 3, bathrooms: 2, storage: 1, hall: 1, terrace: 1 }),
    orientation: 'Jug', floorFrom: 12, floorTo: 12, row: 'front', order: 2, source: 'demo' },
  { id: 'ph_03', code: 'PH_03', blockId: 'b', kind: 'penthouse', area: 118.90, terraceArea: 72.40,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 3, bathrooms: 2, hall: 1, terrace: 1 }),
    orientation: 'Veri', floorFrom: 12, floorTo: 12, row: 'back', order: 1, source: 'demo' },
  { id: 'ph_04', code: 'PH_04', blockId: 'b', kind: 'penthouse', area: 145.20, terraceArea: 128.00,
    rooms: R({ living: 1, kitchen: 1, bedrooms: 4, bathrooms: 2, wc: 1, storage: 1, hall: 1, terrace: 1 }),
    orientation: 'Verilindje', floorFrom: 12, floorTo: 12, row: 'back', order: 2, source: 'demo' },
];

const C: Seed[] = [
  mk('c_t01', 'c', 58.60, { living: 1, kitchen: 1, bedrooms: 1, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 1, 1, 11, 'Jug'),
  mk('c_t02', 'c', 81.30, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }, 'front', 2, 1, 11, 'Jugperëndim'),
  mk('c_t03', 'c', 97.40, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, wc: 1, hall: 1, balcony: 1 }, 'back', 1, 1, 11, 'Verilindje'),
];

const D: Seed[] = [
  mk('d_t01', 'd', 62.10, { living: 1, kitchen: 1, bedrooms: 1, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 1, 1, 9, 'Jug'),
  mk('d_t02', 'd', 78.90, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 2, 1, 9, 'Jug'),
  mk('d_t03', 'd', 88.50, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }, 'front', 3, 1, 9, 'Jugperëndim'),
  mk('d_t04', 'd', 101.20, { living: 1, kitchen: 1, bedrooms: 3, bathrooms: 1, wc: 1, hall: 1, balcony: 1 }, 'back', 1, 1, 9, 'Verilindje'),
  mk('d_t05', 'd', 72.30, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, hall: 1, balcony: 1 }, 'back', 2, 1, 9, 'Veri'),
];

const E: Seed[] = [
  mk('e_t01', 'e', 55.80, { living: 1, kitchen: 1, bedrooms: 1, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 1, 1, 7, 'Jug'),
  mk('e_t02', 'e', 69.40, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, hall: 1, balcony: 1 }, 'front', 2, 1, 7, 'Jug'),
  mk('e_t03', 'e', 84.70, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }, 'front', 3, 1, 7, 'Jugperëndim'),
  mk('e_t04', 'e', 93.10, { living: 1, kitchen: 1, bedrooms: 2, bathrooms: 1, wc: 1, hall: 1, balcony: 1 }, 'back', 1, 1, 7, 'Verilindje'),
  mk('e_t05', 'e', 108.60, { living: 1, kitchen: 1, bedrooms: 3, bathrooms: 2, hall: 1, balcony: 1 }, 'back', 2, 1, 7, 'Veri'),
  mk('e_t06', 'e', 66.20, { living: 1, kitchen: 1, bedrooms: 1, bathrooms: 1, storage: 1, hall: 1, balcony: 1 }, 'back', 3, 1, 7, 'Veri'),
];

export const typologySeeds: Seed[] = [...A, ...B, ...C, ...D, ...E];

export const typologies: Typology[] = typologySeeds.map((s) => {
  const { row, order, ...rest } = s;
  void row; void order;
  return { ...rest, slot: 0 };
});

export const typologyRow = (id: string): Row =>
  typologySeeds.find((t) => t.id === id)!.row;
export const typologyOrder = (id: string): number =>
  typologySeeds.find((t) => t.id === id)!.order;

export const byId = (id: string): Typology =>
  typologies.find((t) => t.id === id)!;
