import { page } from '../components/layout.ts';
import { enquirySheet } from '../components/sheet.ts';
import { breadcrumb, planViewport, statusPill } from '../components/ui.ts';
import type { Block } from '../data/types.ts';
import { roman } from '../data/project.ts';
import { byId } from '../data/typologies.ts';
import { floorTally, unitsOfFloor } from '../data/units.ts';
import { floorPlanSvg } from '../lib/planSvg.ts';
import { nf } from '../lib/html.ts';

export function floorPage(block: Block, floor: number): string {
  const t = floorTally(block.id, floor);
  const list = unitsOfFloor(block.id, floor);
  const prev = floor > 1 ? floor - 1 : null;
  const next = floor < block.floors ? floor + 1 : null;
  const isPenthouse = list.every((u) => u.kind === 'penthouse');

  const body = `
<section class="fpage">
  <div class="wrap">
    ${breadcrumb([
      { href: '/', label: 'FS Invest' },
      { href: '/dardania/', label: 'Dardania' },
      { href: `/dardania/blloku/${block.id}/`, label: block.name },
      { label: `Kati ${floor}` },
    ])}
    <header class="fpage__head">
      <div>
        <p class="label">${block.name}${isPenthouse ? ' · Penthouse' : ''}</p>
        <h1 class="display h-hero fpage__no">Kati ${String(floor).padStart(2, '0')}</h1>
        <p class="label">Kati ${roman(floor)} · ${t.total} banesa · ${t.available} të lira</p>
      </div>
      <nav class="fnav" aria-label="Ndërro katin">
        ${prev ? `<a class="fnav__b" href="/dardania/blloku/${block.id}/kati/${prev}/" rel="prev"><span aria-hidden="true">&#8595;</span> Kati ${String(prev).padStart(2, '0')}</a>` : '<span class="fnav__b is-off">—</span>'}
        ${next ? `<a class="fnav__b" href="/dardania/blloku/${block.id}/kati/${next}/" rel="next"><span aria-hidden="true">&#8593;</span> Kati ${String(next).padStart(2, '0')}</a>` : '<span class="fnav__b is-off">—</span>'}
      </nav>
    </header>
  </div>

  <div class="wrap">
    <div class="fpage__body">
      <div class="fpage__plan">
        ${planViewport(floorPlanSvg(block, floor), 'Prek një banesë')}
        <ul class="legend">
          <li><i class="lg lg--available"></i>E lirë</li>
          <li><i class="lg lg--reserved"></i>E rezervuar</li>
          <li><i class="lg lg--sold"></i>E shitur</li>
        </ul>
      </div>
      <aside class="fpage__side">
        <div class="ucard" data-unit-card aria-live="polite"></div>
        <ul class="ulist">
          ${list.map((u) => {
            const ty = byId(u.typologyId);
            return `<li><a href="/dardania/banesa/${u.id.toLowerCase()}/" data-status="${u.availability}">
              <span class="ulist__id">${u.id}</span>
              <span class="ulist__area num">${nf(ty.area, 2)} m²</span>
              <span class="ulist__rooms">${ty.rooms.bedrooms} dh.</span>
              ${statusPill(u.availability, true)}
            </a></li>`;
          }).join('')}
        </ul>
      </aside>
    </div>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: `Kati ${floor} — ${block.name}, Dardania Complex | FS Invest`,
    description: `Plani i katit ${floor} në ${block.name}: ${t.total} banesa, ${t.available} të lira. Zgjidh banesën drejt në plan.`,
    path: `/dardania/blloku/${block.id}/kati/${floor}/`,
    headerMode: 'solid',
  }, body);
}
