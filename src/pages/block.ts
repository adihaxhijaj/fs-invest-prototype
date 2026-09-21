import { facadeSelector } from '../components/facade.ts';
import { page } from '../components/layout.ts';
import { enquirySheet } from '../components/sheet.ts';
import { breadcrumb, sectionHead } from '../components/ui.ts';
import type { Block } from '../data/types.ts';
import { project } from '../data/project.ts';
import { blockTally } from '../data/units.ts';
import { typologies } from '../data/typologies.ts';
import { nf } from '../lib/html.ts';
import { polygonPoints } from '../lib/geometry.ts';

export function blockPage(block: Block): string {
  const t = blockTally(block.id);
  const types = typologies.filter((x) => x.blockId === block.id);
  const areas = types.map((x) => x.area);
  const others = project.blocks.filter((b) => b.id !== block.id);

  const body = `
<section class="bhero deep" data-header-over>
  <div class="bhero__media">
    <picture>
      <source media="(min-width:900px)" srcset="/dardania/masterplan/complex-night.webp">
      <img src="/dardania/masterplan/complex-night.jpg" alt="Kompleksi Dardania — pozita e ${block.name}" fetchpriority="high" width="1080" height="608">
    </picture>
    <svg class="bhero__mask" viewBox="0 0 1080 608" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><mask id="cut"><rect width="1080" height="608" fill="#fff"/><polygon points="${polygonPoints(block.polygon)}" fill="#000"/></mask></defs>
      <rect width="1080" height="608" fill="rgba(8,9,10,.72)" mask="url(#cut)"/>
      <polygon class="bhero__outline" points="${polygonPoints(block.polygon)}"/>
    </svg>
    <div class="bhero__veil" aria-hidden="true"></div>
  </div>
  <div class="wrap bhero__in">
    ${breadcrumb([{ href: '/', label: 'FS Invest' }, { href: '/dardania/', label: 'Dardania' }, { label: block.name }])}
    <p class="label">Blloku</p>
    <h1 class="display bhero__code">${block.code}</h1>
    <dl class="bhero__facts">
      <div><dt class="label">Kate</dt><dd class="num">${block.floors}</dd></div>
      <div><dt class="label">Banesa</dt><dd class="num">${t.total}</dd></div>
      <div><dt class="label">Të lira</dt><dd class="num">${t.available}</dd></div>
      <div><dt class="label">Struktura</dt><dd>${block.structure}</dd></div>
    </dl>
  </div>
</section>

<section class="section deep section--tight" id="katet">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Zgjidh katin', num: '01', title: 'Katet' })}
    ${facadeSelector(block)}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Tipologjitë', num: '02', title: 'Planet<br>e banesave',
      lead: `${types.length} tipologji nga ${nf(Math.min(...areas), 2)} m² deri në ${nf(Math.max(...areas), 2)} m². Çdo banesë referon një tipologji — një plan i vetëm, i përsëritur nëpër kate.`,
    })}
    <ul class="tlist">
      ${types.map((x, i) => `<li data-reveal style="--rd:${i * 40}ms">
        <span class="tlist__code">${x.code}</span>
        <span class="tlist__area num">${nf(x.area, 2)} m²</span>
        <span class="tlist__rooms">${x.rooms.bedrooms} dhoma gjumi · ${x.rooms.bathrooms} banjo${x.rooms.wc ? ' · WC' : ''}</span>
        <span class="tlist__floors label">Katet ${x.floorFrom}–${x.floorTo}</span>
      </li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section--tight bg-alt">
  <div class="wrap">
    <p class="label" data-reveal>Blloqet e tjera</p>
    <ul class="blist blist--row">
      ${others.map((b) => {
        const bt = blockTally(b.id);
        return `<li data-reveal><a href="/dardania/blloku/${b.id}/">
          <span class="blist__code display">${b.code}</span>
          <span class="blist__meta"><span class="num">${b.floors}</span> kate<i></i><span class="num">${bt.available}</span> të lira</span>
          <span class="blist__arw" aria-hidden="true">&#8594;</span></a></li>`;
      }).join('')}
    </ul>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: `${block.name} — Dardania Complex | FS Invest`,
    description: `${block.name}: ${block.floors} kate, ${t.total} banesa, ${t.available} të lira. Zgjidh katin dhe shiko planin.`,
    path: `/dardania/blloku/${block.id}/`,
    headerMode: 'over',
    ogImage: `/dardania/blocks/block-${block.id}-night.webp`,
  }, body);
}
