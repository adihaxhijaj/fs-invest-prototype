import type { Block } from '../data/types.ts';
import { floorTally } from '../data/units.ts';
import { roman } from '../data/project.ts';

/** Floor selection directly on the building facade. */
export function facadeSelector(block: Block): string {
  const { x, y, w, h } = block.facade;
  const band = h / block.floors;
  const c = block.crop;

  const bands = Array.from({ length: block.floors }, (_, i) => {
    const floor = block.floors - i;               // top band = top floor
    return `<rect class="fsel__band" data-floor="${floor}" x="${x}" y="${(y + i * band).toFixed(2)}"
      width="${w}" height="${band.toFixed(2)}" role="link" tabindex="-1"
      aria-label="Kati ${floor}"></rect>`;
  }).join('');

  const rows = Array.from({ length: block.floors }, (_, i) => {
    const floor = block.floors - i;
    const t = floorTally(block.id, floor);
    const top = floor === block.floors && block.id === 'b';
    return `<button class="fsel__row" type="button" data-floor="${floor}" data-href="/dardania/blloku/${block.id}/kati/${floor}/">
      <span class="fsel__no num">${String(floor).padStart(2, '0')}</span>
      <span class="fsel__meta">${top ? 'Penthouse · ' : ''}${t.total} banesa · ${t.available} të lira<span class="sr"> (kati ${roman(floor)})</span></span>
      <span class="fsel__go">Shiko<span class="arw" aria-hidden="true"> &#8594;</span></span>
    </button>`;
  }).join('');

  return `<div class="fsel" data-floorsel>
    <div class="fsel__stage">
      <div class="fsel__frame" style="aspect-ratio:${c.width}/${c.height}">
        <img class="fsel__img" src="/dardania/blocks/block-${block.id}-night.webp"
             alt="Renderim i ${block.name}" loading="lazy" decoding="async">
        <svg class="fsel__svg" viewBox="${c.left} ${c.top} ${c.width} ${c.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          ${bands}
        </svg>
      </div>
    </div>
    <div class="fsel__list">${rows}</div>
  </div>`;
}
