import type { Block, Fact, Project } from './types.ts';

/* ------------------------------------------------------------------
   Masterplan geometry is expressed in the render's own pixel space
   (1080 × 608). Swapping in a higher-resolution render only requires
   re-scaling these numbers, not touching any component.
-------------------------------------------------------------------*/

const blocks: Block[] = [
  {
    id: 'a', code: 'A', name: 'Blloku A',
    floors: 12, unitsPerFloor: 8,
    structure: '3B + P + 11K',
    accent: '#C8CDD2',
    polygon: [[70, 196], [140, 196], [140, 176], [378, 176], [378, 500], [70, 500]],
    facade: { x: 70, y: 176, w: 308, h: 279 },
    crop: { left: 40, top: 138, width: 372, height: 420 },
    plate: { width: 34.5, depth: 0, corridor: 2.0 },
    source: 'fs-website',
  },
  {
    id: 'b', code: 'B', name: 'Blloku B',
    floors: 12, unitsPerFloor: 7,
    structure: '3B + P + 11K + NK',
    accent: '#8E4B45',
    polygon: [[378, 168], [662, 168], [662, 500], [378, 500]],
    facade: { x: 378, y: 168, w: 284, h: 287 },
    crop: { left: 352, top: 130, width: 336, height: 430 },
    plate: { width: 30.0, depth: 0, corridor: 2.0 },
    source: 'demo',
  },
  {
    id: 'c', code: 'C', name: 'Blloku C',
    floors: 11, unitsPerFloor: 3,
    structure: '3B + P + 10K',
    accent: '#D5D2CB',
    polygon: [[662, 205], [718, 205], [718, 500], [662, 500]],
    facade: { x: 662, y: 205, w: 56, h: 250 },
    crop: { left: 622, top: 170, width: 140, height: 390 },
    plate: { width: 16.0, depth: 0, corridor: 1.8 },
    source: 'demo',
  },
  {
    id: 'd', code: 'D', name: 'Blloku D',
    floors: 9, unitsPerFloor: 5,
    structure: '3B + P + 8K',
    accent: '#9AA0A6',
    polygon: [[718, 240], [840, 240], [840, 500], [718, 500]],
    facade: { x: 718, y: 240, w: 122, h: 215 },
    crop: { left: 690, top: 200, width: 190, height: 360 },
    plate: { width: 22.0, depth: 0, corridor: 1.8 },
    source: 'demo',
  },
  {
    id: 'e', code: 'E', name: 'Blloku E',
    floors: 7, unitsPerFloor: 6,
    structure: '3B + P + 6K',
    accent: '#C4B49C',
    polygon: [[840, 320], [1012, 320], [1012, 500], [840, 500]],
    facade: { x: 840, y: 320, w: 172, h: 135 },
    crop: { left: 808, top: 278, width: 244, height: 292 },
    plate: { width: 24.0, depth: 0, corridor: 1.8 },
    source: 'demo',
  },
];

/* Verified figures published on https://fs-invest.international/portfolio/dardania/ */
const facts: Fact[] = [
  { label: 'Sipërfaqe e ndërtuar bruto', value: '63.825,18', unit: 'm²', source: 'fs-website' },
  { label: 'Mbi tokë', value: '≈ 50.000', unit: 'm²', source: 'fs-website' },
  { label: 'Nën tokë', value: '13.825,18', unit: 'm²', source: 'fs-website' },
  { label: 'Hapësirë banimi', value: '44.695,60', unit: 'm²', source: 'fs-website' },
  { label: 'Hapësira afariste', value: '7.111', unit: 'm²', source: 'fs-website' },
  { label: 'Bodrume', value: '12.018,60', unit: 'm²', source: 'fs-website' },
  { label: 'Parkim i mbuluar', value: '275', unit: 'vende', source: 'fs-website' },
  { label: 'Parkim i jashtëm', value: '75', unit: 'vende', source: 'fs-website' },
  { label: 'Parcela', value: '≈ 1', unit: 'ha', source: 'fs-website' },
  { label: 'Blloqe', value: '5', unit: 'A – E', source: 'fs-website' },
  { label: 'Struktura më e lartë', value: '3B+S+P+11K+NK', source: 'fs-website' },
  { label: 'Koeficienti urbanistik', value: '3.0 → 5.0', source: 'fs-website' },
];

export const project: Project = {
  id: 'dardania',
  name: 'Dardania Complex',
  city: 'Skenderaj',
  country: 'Kosovë',
  coordinates: { lat: 42.7333, lng: 20.7833 },
  status: 'Në zhvillim',
  architect: 'Froject Architecture',
  developer: 'FS Real Estate International',
  facts,
  blocks,
};

export const blockById = (id: string): Block =>
  project.blocks.find((b) => b.id === id)!;

/* Roman numerals are used for floor labels in FS documentation. */
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const roman = (n: number): string => ROMAN[n] ?? String(n);

/* Construction standard. Categories requested by FS brief; each entry states
   only what can be described without claiming unverified specifications. */
export const standard = [
  { key: 'struktura', title: 'Struktura', body: 'Konstruksion i armiranobetonit me tri nivele bodrumi, i dimensionuar sipas kushteve urbanistike të Komunës së Skenderajt.', source: 'fs-website' as const },
  { key: 'fasada', title: 'Fasada', body: 'Fasadë e ventiluar me ritëm vertikal dhe korniza të theksuara; paleta e materialeve përcaktohet në dokumentacionin përfundimtar.', source: 'demo' as const },
  { key: 'izolimi', title: 'Izolimi', body: 'Izolim termik dhe akustik i mbështjellësit, sipas specifikimit teknik të projektit.', source: 'demo' as const },
  { key: 'dritaret', title: 'Dritaret', body: 'Xhamim i dyfishtë me profile alumini me ndërprerje termike.', source: 'demo' as const },
  { key: 'ngrohja', title: 'Ngrohja & ftohja', body: 'Sistem individual për çdo banesë, me përgatitje instalimesh në fazën e ndërtimit.', source: 'demo' as const },
  { key: 'ashensoret', title: 'Ashensorët', body: 'Ashensorë me akses nga bodrumet deri në katin e fundit të secilit bllok.', source: 'demo' as const },
  { key: 'parkingu', title: 'Parkingu', body: '275 vende parkimi të mbuluara në bodrumet 1–3 dhe 75 vende të jashtme për vizitorë.', source: 'fs-website' as const },
  { key: 'perbashketa', title: 'Hapësirat e përbashkëta', body: 'Hyrje të veçanta për secilin bllok, korridore të ndriçuara natyrshëm dhe oborr i brendshëm i gjelbëruar.', source: 'demo' as const },
];
