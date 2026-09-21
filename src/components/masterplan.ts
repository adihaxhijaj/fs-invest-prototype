import { blockTally } from '../data/units.ts';
import { project } from '../data/project.ts';
import { polygonPoints } from '../lib/geometry.ts';
import { esc } from '../lib/html.ts';

/** Interactive complex render: the buildings are the navigation. */
export function masterplan(): string {
  const zones = project.blocks.map((b) => {
    const t = blockTally(b.id);
    const xs = b.polygon.map((p) => p[0]), ys = b.polygon.map((p) => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const topY = Math.min(...ys);
    return `<g class="mp__zone" data-block="${b.id}" data-name="${esc(b.name)}" data-floors="${b.floors}"
        data-units="${t.total}" data-available="${t.available}" data-href="/dardania/blloku/${b.id}/"
        tabindex="0" role="link" aria-label="${esc(b.name)}: ${b.floors} kate, ${t.total} banesa, ${t.available} të lira">
      <polygon class="mp__shape" points="${polygonPoints(b.polygon)}"></polygon>
      <line class="mp__tick" x1="${cx}" y1="${topY - 6}" x2="${cx}" y2="${topY - 26}"></line>
      <text class="mp__code" x="${cx}" y="${topY - 34}">${b.code}</text>
    </g>`;
  }).join('');

  return `<div class="mp" data-masterplan>
  <div class="mp__stage">
    <picture>
      <source media="(min-width:900px)" srcset="/dardania/masterplan/complex-night.webp">
      <img class="mp__img" src="/dardania/masterplan/complex-night.jpg" width="1080" height="608"
           alt="Renderim i Kompleksit Dardania — pamje nga fronti kryesor" loading="lazy" decoding="async">
    </picture>
    <svg class="mp__svg" viewBox="0 0 1080 608" preserveAspectRatio="xMidYMid meet" aria-label="Zgjedhja e bllokut">
      <defs>${project.blocks.map((b) => `<clipPath id="clip-${b.id}"><polygon points="${polygonPoints(b.polygon)}"/></clipPath>`).join('')}</defs>
      <g class="mp__lit" aria-hidden="true">${project.blocks.map((b) =>
        `<image class="mp__bright" data-block="${b.id}" clip-path="url(#clip-${b.id})" href="/dardania/masterplan/complex-night.jpg" x="0" y="0" width="1080" height="608" preserveAspectRatio="xMidYMid meet"/>`).join('')}</g>
      ${zones}
    </svg>
    <p class="mp__hint">Zgjidh një bllok</p>
    <div class="mp__panel"><div class="mp__card" data-mp-card aria-live="polite"><p class="mp__idle label">Prek një bllok për detajet</p></div></div>
  </div>
</div>`;
}

/** Fallback list — always in the DOM so the journey works without JS. */
export function blockList(): string {
  return `<ul class="blist">${project.blocks.map((b, i) => {
    const t = blockTally(b.id);
    return `<li data-reveal style="--rd:${i * 60}ms">
      <a href="/dardania/blloku/${b.id}/">
        <span class="blist__code display">${b.code}</span>
        <span class="blist__meta">
          <span class="num">${b.floors}</span> kate<i></i>
          <span class="num">${t.total}</span> banesa<i></i>
          <span class="num">${t.available}</span> të lira
        </span>
        <span class="blist__arw" aria-hidden="true">&#8594;</span>
      </a></li>`;
  }).join('')}</ul>`;
}
