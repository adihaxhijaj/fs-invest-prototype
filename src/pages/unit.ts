import { page } from '../components/layout.ts';
import { enquireButton, enquirySheet, whatsappLink } from '../components/sheet.ts';
import { areaTable, breadcrumb, dataRow, planViewport, statusPill } from '../components/ui.ts';
import type { Unit } from '../data/types.ts';
import { blockById, roman } from '../data/project.ts';
import { site } from '../data/site.ts';
import { byId } from '../data/typologies.ts';
import { unitsOfTypology } from '../data/units.ts';
import { outdoorArea, roomProgram } from '../lib/plan.ts';
import { unitPlanSvg } from '../lib/planSvg.ts';
import { esc, nf } from '../lib/html.ts';
import { statusLabel } from '../data/i18n.ts';

export function unitPage(u: Unit): string {
  const block = blockById(u.blockId);
  const t = byId(u.typologyId);
  const rooms = roomProgram(t);
  const out = outdoorArea(t);
  const slug = u.id.toLowerCase();
  const siblings = unitsOfTypology(t.id);
  const isPH = t.kind === 'penthouse';

  const ctx = {
    Projekti: 'Dardania Complex',
    Blloku: block.name,
    Kati: String(u.floor),
    Njësia: u.id,
    Tipologjia: t.code,
    Sipërfaqja: `${nf(t.area, 2)} m²`,
  };

  const waMsg = `Përshëndetje, jam i interesuar për banesën ${u.id} në Dardania Complex, ${block.name}, Kati ${u.floor} (${nf(t.area, 2)} m²). ${site.url}/dardania/banesa/${slug}/`;

  const sheetData = {
    id: u.id,
    title: `${isPH ? 'Penthouse' : 'Banesë'} · ${block.name} · Kati ${String(u.floor).padStart(2, '0')} · Tipologjia ${t.code}`,
    project: 'Dardania Complex — Skenderaj',
    status: statusLabel(u.availability),
    lines: [
      ['Sipërfaqja', `${nf(t.area, 2)} m²`],
      ['Dhoma gjumi', String(t.rooms.bedrooms)],
      ['Banjo / WC', `${t.rooms.bathrooms} / ${t.rooms.wc}`],
      ['Orientimi', t.orientation],
      out ? [out.name, `${nf(out.area, 2)} m²`] : ['Kati', roman(u.floor)],
      ['Çmimi', site.pricing.requestLabel],
    ],
    areas: [...rooms.map((r) => [r.name, `${nf(r.area, 1)} m²`]), ...(out ? [[out.name, `${nf(out.area, 1)} m²`]] : [])],
    render: '/dardania/masterplan/complex-night.jpg',
    qr: `/dardania/qr/${slug}.png`,
    url: `${site.url}/dardania/banesa/${slug}/`,
    planSel: '#unit-plan',
    contact: [site.legalName, `${site.contact.address}, ${site.contact.postal}`, `${site.contact.phone} · ${site.contact.email}`],
    footnote: 'Ndarja e sipërfaqes është indikative. Të dhënat përfundimtare konfirmohen me dokumentacionin e projektit.',
  };

  const others = siblings.filter((s) => s.floor !== u.floor);

  const body = `
<article class="upage">
  <div class="wrap">
    ${breadcrumb([
      { href: '/', label: 'FS Invest' },
      { href: '/dardania/', label: 'Dardania' },
      { href: `/dardania/blloku/${block.id}/`, label: block.name },
      { href: `/dardania/blloku/${block.id}/kati/${u.floor}/`, label: `Kati ${u.floor}` },
      { label: u.id },
    ])}

    <header class="upage__head">
      <div class="upage__id">
        <p class="label">Dardania Complex · ${block.name} · Kati ${String(u.floor).padStart(2, '0')}</p>
        <h1 class="display h-hero">${u.id}</h1>
        <div class="upage__badges">${statusPill(u.availability)}<span class="pill pill--ghost">Tipologjia ${t.code}</span>${isPH ? '<span class="pill pill--ghost">Penthouse</span>' : ''}</div>
      </div>
      <div class="upage__key">
        <div><span class="label">Sipërfaqja</span><b class="display num">${nf(t.area, 2)}<i>m²</i></b></div>
        <div><span class="label">Dhoma gjumi</span><b class="display num">${t.rooms.bedrooms}</b></div>
        <div><span class="label">Banjo</span><b class="display num">${t.rooms.bathrooms}</b></div>
        ${out ? `<div><span class="label">${out.name}</span><b class="display num">${nf(out.area, 1)}<i>m²</i></b></div>` : ''}
      </div>
    </header>
  </div>

  <div class="wrap">
    <div class="upage__grid">
      <section class="upage__plan" aria-label="Plani i banesës">
        ${planViewport(unitPlanSvg(t, { id: 'unit-plan' }), 'Zmadho planin')}
      </section>

      <aside class="upage__meta">
        <dl class="drows">
          ${dataRow('Projekti', 'Dardania Complex')}
          ${dataRow('Blloku', esc(block.name))}
          ${dataRow('Kati', `${u.floor} <span class="muted">(${roman(u.floor)})</span>`)}
          ${dataRow('Tipologjia', esc(t.code))}
          ${dataRow('Sipërfaqja', `<span class="num">${nf(t.area, 2)} m²</span>`)}
          ${dataRow('Dhoma gjumi', `<span class="num">${t.rooms.bedrooms}</span>`)}
          ${dataRow('Banjo', `<span class="num">${t.rooms.bathrooms}</span>`)}
          ${t.rooms.wc ? dataRow('WC', `<span class="num">${t.rooms.wc}</span>`) : ''}
          ${t.rooms.storage ? dataRow('Depo', 'Po') : ''}
          ${t.rooms.utility ? dataRow('Hapësirë ndihmëse', 'Po') : ''}
          ${out ? dataRow(out.name, `<span class="num">${nf(out.area, 1)} m²</span>`) : ''}
          ${dataRow('Orientimi', esc(t.orientation))}
          ${dataRow('Statusi', statusPill(u.availability, true))}
          ${dataRow('Çmimi', site.pricing.mode === 'exact' && u.price ? `<span class="num">${u.price} €</span>` : `<span class="muted">${site.pricing.requestLabel}</span>`)}
        </dl>

        <div class="upage__actions">
          ${enquireButton(ctx, site.pricing.requestLabel)}
          <button class="btn btn--ghost" type="button" data-spec-sheet='${esc(JSON.stringify(sheetData))}'>
            <span data-sheet-label>Shkarko fletën e banesës</span>
          </button>
          ${whatsappLink(waMsg)}
        </div>
        ${t.description ? `<p class="muted upage__desc">${esc(t.description)}</p>` : ''}
      </aside>
    </div>
  </div>

  <div class="wrap">
    <div class="upage__split">
      <section>
        <h2 class="label" data-reveal>Ndarja e sipërfaqes</h2>
        ${areaTable(rooms, t.area, out)}
        <p class="src-note">Sipërfaqja totale është e publikuar nga FS. Ndarja sipas dhomave është indikative dhe zëvendësohet me matjet e projektit.</p>
      </section>

      <section>
        <h2 class="label" data-reveal>Kjo tipologji gjendet edhe në</h2>
        <ul class="tfloors">
          ${siblings.map((s) => {
            const me = s.id === u.id;
            const label = me ? 'Po e shikoni' : statusLabel(s.availability);
            const cls = me ? 'is-me' : s.availability;
            const inner = `<span class="tfloors__k">Kati ${String(s.floor).padStart(2, '0')}</span><span class="tfloors__v">${label}</span><span class="tfloors__id num">${s.id}</span>`;
            return `<li class="tfloors__i tfloors__i--${cls}">${me || s.availability === 'sold'
              ? `<span>${inner}</span>`
              : `<a href="/dardania/banesa/${s.id.toLowerCase()}/">${inner}<span class="arw" aria-hidden="true">&#8594;</span></a>`}</li>`;
          }).join('')}
        </ul>
        ${others.length === 0 ? '<p class="muted">Kjo tipologji shfaqet vetëm në këtë kat.</p>' : ''}
      </section>
    </div>
  </div>

  <section class="section section--tight">
    <div class="wrap">
      <h2 class="label" data-reveal>Pamje të projektit</h2>
      <div class="ugal">
        <figure data-reveal="img"><img src="/dardania/masterplan/complex-night.jpg" alt="Kompleksi Dardania — pamje nate" loading="lazy"></figure>
        <figure data-reveal="img" style="--rd:120ms"><img src="/dardania/blocks/block-${block.id}-day.webp" alt="${esc(block.name)} — pamje ditore" loading="lazy"></figure>
      </div>
    </div>
  </section>
</article>

<div class="sticky-cta">
  <div class="sticky-cta__in">
    <div class="sticky-cta__id"><b>${u.id}</b><span class="num">${nf(t.area, 2)} m²</span></div>
    ${enquireButton(ctx, site.pricing.requestLabel)}
  </div>
</div>
${enquirySheet()}`;

  return page({
    title: `${u.id} — ${nf(t.area, 2)} m², ${block.name} | Dardania Complex`,
    description: `Banesa ${u.id}: ${nf(t.area, 2)} m², ${t.rooms.bedrooms} dhoma gjumi, ${block.name}, kati ${u.floor}. ${statusLabel(u.availability)}.`,
    path: `/dardania/banesa/${slug}/`,
    bodyClass: 'has-sticky',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Apartment',
      name: `${u.id} — Dardania Complex`,
      numberOfRooms: t.rooms.bedrooms,
      floorSize: { '@type': 'QuantitativeValue', value: t.area, unitCode: 'MTK' },
      address: { '@type': 'PostalAddress', addressLocality: 'Skenderaj', addressCountry: 'XK' },
    },
  }, body);
}
