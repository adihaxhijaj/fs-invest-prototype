import { page } from '../components/layout.ts';
import { enquireButton, enquirySheet, whatsappLink } from '../components/sheet.ts';
import { areaTable, breadcrumb, dataRow, planViewport, sectionHead, statusPill } from '../components/ui.ts';
import type { CommercialUnit } from '../data/types.ts';
import { commercialTotal, commercialUnits } from '../data/commercial.ts';
import { site } from '../data/site.ts';
import { statusLabel } from '../data/i18n.ts';
import { commercialPlanSvg, commercialStripSvg } from '../lib/planSvg.ts';
import { esc, int, nf } from '../lib/html.ts';

export function commercialIndex(): string {
  const avail = commercialUnits.filter((c) => c.availability === 'available').length;
  const body = `
<section class="section section--tight">
  <div class="wrap">
    ${breadcrumb([{ href: '/', label: 'FS Invest' }, { href: '/dardania/', label: 'Dardania' }, { label: 'Hapësira afariste' }])}
    <header class="chead">
      <h1 class="display h-hero">Hapësira<br>afariste</h1>
      <p class="lead">Përdhesa e Kompleksit Dardania është një front i vazhdueshëm komercial përgjatë rrugës. ${commercialUnits.length} njësi me hyrje të drejtpërdrejta, nga ${Math.min(...commercialUnits.map((c) => c.area)).toFixed(0)} deri në ${Math.max(...commercialUnits.map((c) => c.area)).toFixed(0)} m².</p>
      <dl class="chead__stats">
        <div><dt class="label">Njësi</dt><dd class="display num">${commercialUnits.length}</dd></div>
        <div><dt class="label">Të lira</dt><dd class="display num">${avail}</dd></div>
        <div><dt class="label">Sipërfaqe e listuar</dt><dd class="display num">${int(Math.round(commercialTotal))}<i>m²</i></dd></div>
      </dl>
    </header>
  </div>
</section>

<section class="deep">
  <div class="mp cm" data-masterplan>
    <div class="mp__stage cm__stage">
      <div class="cm__frame">
        <img class="mp__img cm__img" src="/dardania/masterplan/complex-night.jpg" width="1080" height="608"
             alt="Përdhesa komerciale e Kompleksit Dardania — fronti i rrugës" loading="lazy" decoding="async">
        ${commercialStripSvg(commercialUnits)}
      </div>
      <p class="mp__hint">Zgjidh një lokal</p>
      <div class="mp__panel"><div class="mp__card" data-mp-card aria-live="polite"><p class="mp__idle label">Prek një lokal për detajet</p></div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Të gjitha njësitë', num: '01', title: 'Lokalet' })}
    <ul class="clist">
      ${commercialUnits.map((c, i) => `<li data-reveal style="--rd:${i * 30}ms">
        <a href="/dardania/hapesira-afariste/${c.id.toLowerCase()}/">
          <span class="clist__id">${c.label}</span>
          <span class="clist__area num">${nf(c.area, 1)} m²</span>
          <span class="clist__front num">${nf(c.frontage, 1)} m front</span>
          <span class="clist__pos">${esc(c.position)}</span>
          ${statusPill(c.availability, true)}
          <span class="arw" aria-hidden="true">&#8594;</span>
        </a></li>`).join('')}
    </ul>
    <p class="src-note">FS publikon 7.111 m² hapësira afariste për Kompleksin Dardania. Ndarja në njësi individuale është propozim i prototipit dhe zëvendësohet me listën përfundimtare.</p>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: 'Hapësira afariste — Dardania Complex | FS Invest',
    description: `${commercialUnits.length} hapësira afariste në përdhesën e Kompleksit Dardania, Skenderaj. Plane, sipërfaqe dhe disponueshmëri.`,
    path: '/dardania/hapesira-afariste/',
  }, body);
}

export function commercialPage(c: CommercialUnit): string {
  const slug = c.id.toLowerCase();
  const ctx = {
    Projekti: 'Dardania Complex',
    Njësia: c.label,
    Kati: c.floor,
    Sipërfaqja: `${nf(c.area, 1)} m²`,
    Fronti: `${nf(c.frontage, 1)} m`,
  };
  const waMsg = `Përshëndetje, jam i interesuar për ${c.label} (${nf(c.area, 1)} m²) në Dardania Complex, Skenderaj. ${site.url}/dardania/hapesira-afariste/${slug}/`;
  const areas = [
    { name: 'Hapësira e shitjes', area: +(c.area * 0.78).toFixed(1) },
    { name: 'Depo', area: +(c.area * 0.12).toFixed(1) },
    { name: 'WC', area: +(c.area * 0.05).toFixed(1) },
    { name: 'Hapësirë teknike', area: +(c.area * 0.05).toFixed(1) },
  ];
  const sheetData = {
    id: c.id,
    title: `Hapësirë afariste · ${c.floor} · ${c.position}`,
    project: 'Dardania Complex — Skenderaj',
    status: statusLabel(c.availability),
    lines: [
      ['Sipërfaqja', `${nf(c.area, 1)} m²`],
      ['Fronti', `${nf(c.frontage, 1)} m`],
      ['Kati', c.floor],
      ['Pozita', c.position],
      ['Hyrja', c.entrance],
      ['Çmimi', site.pricing.requestLabel],
    ],
    areas: areas.map((a) => [a.name, `${nf(a.area, 1)} m²`]),
    render: '/dardania/masterplan/complex-night.jpg',
    qr: `/dardania/qr/${slug}.png`,
    url: `${site.url}/dardania/hapesira-afariste/${slug}/`,
    planSel: '#unit-plan',
    contact: [site.legalName, `${site.contact.address}, ${site.contact.postal}`, `${site.contact.phone} · ${site.contact.email}`],
    footnote: 'Ndarja e brendshme është indikative dhe përshtatet sipas qiramarrësit.',
  };

  const body = `
<article class="upage">
  <div class="wrap">
    ${breadcrumb([
      { href: '/', label: 'FS Invest' },
      { href: '/dardania/', label: 'Dardania' },
      { href: '/dardania/hapesira-afariste/', label: 'Hapësira afariste' },
      { label: c.label },
    ])}
    <header class="upage__head">
      <div class="upage__id">
        <p class="label">Dardania Complex · ${c.floor}</p>
        <h1 class="display h-hero">${esc(c.label)}</h1>
        <div class="upage__badges">${statusPill(c.availability)}<span class="pill pill--ghost">Hapësirë afariste</span></div>
      </div>
      <div class="upage__key">
        <div><span class="label">Sipërfaqja</span><b class="display num">${nf(c.area, 1)}<i>m²</i></b></div>
        <div><span class="label">Fronti</span><b class="display num">${nf(c.frontage, 1)}<i>m</i></b></div>
        <div><span class="label">Kati</span><b class="display">${c.floor}</b></div>
      </div>
    </header>
  </div>

  <div class="wrap">
    <div class="upage__grid">
      <section class="upage__plan" aria-label="Plani i lokalit">
        ${planViewport(commercialPlanSvg(c, 'unit-plan'), 'Zmadho planin')}
      </section>
      <aside class="upage__meta">
        <dl class="drows">
          ${dataRow('Projekti', 'Dardania Complex')}
          ${dataRow('Njësia', esc(c.id))}
          ${dataRow('Kati', esc(c.floor))}
          ${dataRow('Sipërfaqja', `<span class="num">${nf(c.area, 1)} m²</span>`)}
          ${dataRow('Fronti', `<span class="num">${nf(c.frontage, 1)} m</span>`)}
          ${dataRow('Pozita', esc(c.position))}
          ${dataRow('Hyrja', esc(c.entrance))}
          ${dataRow('Statusi', statusPill(c.availability, true))}
          ${dataRow('Çmimi', `<span class="muted">${site.pricing.requestLabel}</span>`)}
        </dl>
        <div class="upage__actions">
          ${enquireButton(ctx, 'Kërko informata')}
          <button class="btn btn--ghost" type="button" data-spec-sheet='${esc(JSON.stringify(sheetData))}'><span data-sheet-label>Shkarko fletën e hapësirës</span></button>
          ${whatsappLink(waMsg)}
        </div>
      </aside>
    </div>
  </div>

  <div class="wrap">
    <div class="upage__split">
      <section>
        <h2 class="label" data-reveal>Ndarja e sipërfaqes</h2>
        ${areaTable(areas, c.area)}
        <p class="src-note">Ndarja e brendshme është indikative dhe përshtatet sipas qiramarrësit.</p>
      </section>
      <section>
        <h2 class="label" data-reveal>Njësi të tjera</h2>
        <ul class="tfloors">
          ${commercialUnits.filter((o) => o.id !== c.id).slice(0, 7).map((o) => `<li class="tfloors__i tfloors__i--${o.availability}">
            <a href="/dardania/hapesira-afariste/${o.id.toLowerCase()}/">
              <span class="tfloors__k">${esc(o.label)}</span>
              <span class="tfloors__v">${statusLabel(o.availability)}</span>
              <span class="tfloors__id num">${nf(o.area, 1)} m²</span>
              <span class="arw" aria-hidden="true">&#8594;</span></a></li>`).join('')}
        </ul>
      </section>
    </div>
  </div>
</article>

<div class="sticky-cta">
  <div class="sticky-cta__in">
    <div class="sticky-cta__id"><b>${esc(c.id)}</b><span class="num">${nf(c.area, 1)} m²</span></div>
    ${enquireButton(ctx, 'Kërko informata')}
  </div>
</div>
${enquirySheet()}`;

  return page({
    title: `${c.label} — ${nf(c.area, 1)} m² | Dardania Complex`,
    description: `${c.label}: ${nf(c.area, 1)} m² hapësirë afariste në përdhesën e Kompleksit Dardania, Skenderaj.`,
    path: `/dardania/hapesira-afariste/${slug}/`,
    bodyClass: 'has-sticky',
  }, body);
}
