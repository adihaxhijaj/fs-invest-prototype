import type { CommercialUnit } from './types.ts';

/* ------------------------------------------------------------------
   Ground-floor commercial units ("Hapësira afariste").
   FS publishes a project total of 7,111 m² of commercial space; the
   individual unit split below is DEMO and mirrors the frontage of the
   masterplan render so the selector lines up with the architecture.
-------------------------------------------------------------------*/

interface Seed { block: string; n: number; area: number; frontage: number; x: number; w: number; pos: string }

const seeds: Seed[] = [
  { block: 'A', n: 1, area: 96.4, frontage: 7.2, x: 70, w: 58, pos: 'Qoshe veriperëndimore' },
  { block: 'A', n: 2, area: 124.0, frontage: 9.4, x: 128, w: 62, pos: 'Fronti kryesor' },
  { block: 'A', n: 3, area: 148.6, frontage: 11.0, x: 190, w: 68, pos: 'Fronti kryesor' },
  { block: 'A', n: 4, area: 112.3, frontage: 8.4, x: 258, w: 58, pos: 'Fronti kryesor' },
  { block: 'A', n: 5, area: 132.8, frontage: 9.8, x: 316, w: 62, pos: 'Pranë hyrjes së bllokut A' },
  { block: 'B', n: 1, area: 168.2, frontage: 12.6, x: 378, w: 66, pos: 'Pranë hyrjes së bllokut B' },
  { block: 'B', n: 2, area: 210.5, frontage: 15.2, x: 444, w: 74, pos: 'Fronti kryesor' },
  { block: 'B', n: 3, area: 186.0, frontage: 13.4, x: 518, w: 70, pos: 'Fronti kryesor' },
  { block: 'B', n: 4, area: 142.7, frontage: 10.2, x: 588, w: 44, pos: 'Fronti kryesor' },
  { block: 'B', n: 5, area: 88.9, frontage: 6.8, x: 632, w: 30, pos: 'Qoshe' },
  { block: 'C', n: 1, area: 74.5, frontage: 6.0, x: 662, w: 56, pos: 'Fronti lindor' },
  { block: 'D', n: 1, area: 158.4, frontage: 11.8, x: 718, w: 64, pos: 'Fronti lindor' },
  { block: 'D', n: 2, area: 126.9, frontage: 9.6, x: 782, w: 58, pos: 'Pranë hyrjes së bllokut D' },
  { block: 'E', n: 1, area: 204.6, frontage: 14.8, x: 840, w: 62, pos: 'Fronti lindor' },
  { block: 'E', n: 2, area: 172.3, frontage: 12.4, x: 902, w: 58, pos: 'Fronti lindor' },
  { block: 'E', n: 3, area: 118.7, frontage: 9.0, x: 960, w: 52, pos: 'Qoshe verilindore' },
];

const status = (i: number): CommercialUnit['availability'] =>
  i % 5 === 1 ? 'sold' : i % 7 === 3 ? 'reserved' : 'available';

export const commercialUnits: CommercialUnit[] = seeds.map((s, i) => {
  const label = `${s.block}${String(s.n).padStart(2, '0')}`;
  return {
    id: `L-${label}`,
    projectId: 'dardania',
    label: `Lokali ${label}`,
    area: s.area,
    frontage: s.frontage,
    floor: 'Përdhesë',
    position: s.pos,
    entrance: 'Hyrje e drejtpërdrejtë nga fronti i rrugës',
    availability: status(i),
    price: null,
    x: s.x,
    w: s.w,
    source: 'demo',
  };
});

export const commercialById = (id: string): CommercialUnit | undefined =>
  commercialUnits.find((c) => c.id.toLowerCase() === id.toLowerCase());

export const commercialTotal = commercialUnits.reduce((a, c) => a + c.area, 0);
