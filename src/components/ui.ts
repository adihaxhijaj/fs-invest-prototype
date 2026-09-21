import type { Availability, Fact } from '../data/types.ts';
import { statusLabel } from '../data/i18n.ts';
import { esc, nf } from '../lib/html.ts';

export const statusPill = (s: Availability, small = false): string =>
  `<span class="pill pill--${s}${small ? ' pill--sm' : ''}"><i></i>${statusLabel(s)}</span>`;

export const eyebrow = (text: string, num?: string): string =>
  `<p class="eyebrow" data-reveal><span class="label">${esc(text)}</span>${num ? `<span class="eyebrow__no label num">${esc(num)}</span>` : ''}</p>`;

export function sectionHead(o: { eyebrow?: string; num?: string; title: string; lead?: string; link?: { href: string; label: string } }): string {
  return `<div class="shead">
    ${o.eyebrow ? eyebrow(o.eyebrow, o.num) : ''}
    <div class="shead__row">
      <h2 class="display h1" data-reveal>${o.title}</h2>
      ${o.link ? `<a class="link" href="${o.link.href}" data-reveal>${esc(o.link.label)}<span class="arw" aria-hidden="true">&#8594;</span></a>` : ''}
    </div>
    ${o.lead ? `<p class="lead" data-reveal style="--rd:80ms">${o.lead}</p>` : ''}
  </div>`;
}

export const statList = (facts: Fact[]): string =>
  `<dl class="stats">${facts.map((f, i) => `
    <div class="stats__i" data-reveal style="--rd:${i * 55}ms">
      <dt class="label">${esc(f.label)}</dt>
      <dd><span class="stats__v display num">${esc(f.value)}</span>${f.unit ? `<span class="stats__u">${esc(f.unit)}</span>` : ''}</dd>
    </div>`).join('')}</dl>`;

export const dataRow = (k: string, v: string): string =>
  `<div class="drow"><dt class="label">${esc(k)}</dt><dd>${v}</dd></div>`;

export const areaTable = (
  rows: { name: string; area: number }[],
  total?: number,
  extra?: { name: string; area: number } | null,
): string =>
  `<table class="atable">
    <tbody>${rows.map((r) => `<tr><th scope="row">${esc(r.name)}</th><td class="num">${nf(r.area, 1)} m²</td></tr>`).join('')}</tbody>
    ${total !== undefined ? `<tfoot>
      <tr><th scope="row">Gjithsej — hapësirë e brendshme</th><td class="num">${nf(total, 2)} m²</td></tr>
      ${extra ? `<tr class="atable__x"><th scope="row">${esc(extra.name)} (jashtë)</th><td class="num">${nf(extra.area, 1)} m²</td></tr>` : ''}
    </tfoot>` : ''}
  </table>`;

export const breadcrumb = (items: { href?: string; label: string }[]): string =>
  `<nav class="crumb" aria-label="Rruga">${items.map((i, n) =>
    (i.href ? `<a href="${i.href}">${esc(i.label)}</a>` : `<span aria-current="page">${esc(i.label)}</span>`) +
    (n < items.length - 1 ? '<i aria-hidden="true">/</i>' : '')).join('')}</nav>`;

/** Pan + zoom shell used for every plan on touch devices. */
export const planViewport = (svg: string, hint = 'Zmadho · rrëshqit'): string =>
  `<div class="pv" data-planview>
    <div class="pv__inner" data-planview-inner>${svg}</div>
    <p class="pv__hint">${esc(hint)}</p>
    <div class="pv__tools">
      <button type="button" data-zoom="out" aria-label="Zvogëlo">−</button>
      <button type="button" data-zoom="in" aria-label="Zmadho">+</button>
      <button type="button" data-zoom="reset" aria-label="Rikthe pamjen">⤢</button>
    </div>
  </div>`;
