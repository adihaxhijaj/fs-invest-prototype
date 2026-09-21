/* ------------------------------------------------------------------
   FS INVEST — domain model
   Project → Block → Floor → Unit → Typology
   Every record carries `source` so real FS content and prototype demo
   content stay distinguishable when this data layer is swapped for a CMS.
-------------------------------------------------------------------*/

export type Source = 'fs-website' | 'demo';

export type Availability = 'available' | 'reserved' | 'sold';

export type UnitKind = 'residential' | 'penthouse' | 'commercial';

export interface AreaLine {
  /** Albanian room name as it appears on the plan */
  name: string;
  /** m², indicative unless source === 'fs-website' */
  area: number;
}

export interface Rooms {
  living: number;
  kitchen: number;
  bedrooms: number;
  bathrooms: number;
  wc: number;
  storage: number;
  utility: number;
  hall: number;
  balcony: number;
  terrace: number;
}

export interface Typology {
  id: string;
  /** Code shown to visitors, e.g. "A3_1" */
  code: string;
  blockId: string;
  kind: UnitKind;
  /** Net saleable area, m² */
  area: number;
  /** Terrace area for penthouses, m² */
  terraceArea?: number;
  rooms: Rooms;
  orientation: string;
  /** Inclusive floor range in which this layout occurs */
  floorFrom: number;
  floorTo: number;
  /** Position index on the floor plate (0-based, front row then back row) */
  slot: number;
  description?: string;
  source: Source;
  /** Provenance note kept out of the public UI */
  note?: string;
}

export interface Unit {
  id: string;            // "B07-03"
  projectId: string;
  blockId: string;
  floor: number;
  slot: number;
  typologyId: string;
  kind: UnitKind;
  availability: Availability;
  /** null = price on request ("Kërko ofertë") */
  price: number | null;
}

export interface CommercialUnit {
  id: string;            // "L-A03"
  projectId: string;
  label: string;         // "Lokali A03"
  area: number;
  frontage: number;      // running metres of shopfront
  floor: string;         // "Përdhesë"
  position: string;
  entrance: string;
  availability: Availability;
  price: number | null;
  /** x/width along the normalised 0–1000 frontage strip */
  x: number;
  w: number;
  source: Source;
}

export interface Block {
  id: string;            // "b"
  code: string;          // "B"
  name: string;          // "Blloku B"
  floors: number;
  unitsPerFloor: number;
  /** Storeys description as published by FS where known */
  structure: string;
  accent: string;
  /** Polygon over the masterplan render, in the render's 1080×608 space */
  polygon: [number, number][];
  /** Facade rectangle used to build floor bands: [x, yRoof, w, yGroundFloorTop] */
  facade: { x: number; y: number; w: number; h: number };
  /** Crop box on the masterplan render used for the block hero */
  crop: { left: number; top: number; width: number; height: number };
  /** Floor-plate geometry in metres */
  plate: { width: number; depth: number; corridor: number };
  source: Source;
}

export interface Project {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  status: string;
  architect: string;
  developer: string;
  facts: Fact[];
  blocks: Block[];
}

export interface Fact {
  label: string;
  value: string;
  unit?: string;
  source: Source;
}
