import { page } from '../components/layout.ts';
import { enquireButton, enquirySheet, whatsappLink } from '../components/sheet.ts';
import { breadcrumb } from '../components/ui.ts';
import { site } from '../data/site.ts';
import { esc } from '../lib/html.ts';

export function contactPage(): string {
  const c = site.contact;
  const body = `
<section class="section section--tight">
  <div class="wrap">
    ${breadcrumb([{ href: '/', label: 'FS Invest' }, { label: 'Kontakt' }])}
    <div class="chead">
      <h1 class="display h-hero">Kontakt</h1>
      <p class="lead lead--xl">Zyra e shitjes në Skenderaj. Për një banesë ose hapësirë afariste konkrete, kërkesa juaj vjen bashkë me të dhënat e njësisë.</p>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="ctc">
      <div class="ctc__block">
        <h2 class="label">Adresa</h2>
        <p class="ctc__big">${esc(c.address)}<br>${esc(c.postal)}<br>${esc(c.country)}</p>
        <a class="link" href="${esc(c.maps)}" target="_blank" rel="noopener">Hap në hartë<span class="arw" aria-hidden="true">&#8594;</span></a>
      </div>
      <div class="ctc__block">
        <h2 class="label">Telefoni</h2>
        <p class="ctc__big"><a href="tel:${esc(c.phoneHref)}">${esc(c.phone)}</a></p>
        <h2 class="label" style="margin-top:2rem">Email</h2>
        <p class="ctc__big"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>
      </div>
      <div class="ctc__block">
        <h2 class="label">Rrjetet</h2>
        <ul class="ctc__links">
          <li><a class="link" href="${esc(c.instagram)}" target="_blank" rel="noopener">Instagram<span class="arw" aria-hidden="true">&#8594;</span></a></li>
          <li><a class="link" href="${esc(c.facebook)}" target="_blank" rel="noopener">Facebook<span class="arw" aria-hidden="true">&#8594;</span></a></li>
        </ul>
        <div class="ctc__actions">
          ${enquireButton({ Projekti: 'Dardania Complex', Kërkesa: 'Informata të përgjithshme' }, 'Dërgo kërkesë')}
          ${whatsappLink('Përshëndetje, dëshiroj informata për Dardania Complex në Skenderaj.', 'Shkruaj mesazh')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section deep cta-band">
  <div class="wrap">
    <h2 class="display h1" data-reveal>Zgjidh një banesë<br>dhe pyet drejtpërdrejt</h2>
    <div class="cta-band__row">
      <p class="lead" data-reveal>Çdo kërkesë nga faqja e një banese përmban bllokun, katin, njësinë dhe tipologjinë — pa e shpjeguar asnjëherë se për cilën banesë bëhet fjalë.</p>
      <div class="cta-band__btns" data-reveal><a class="btn" href="/dardania/blloku/b/kati/7/">Shembull: Kati 07, Blloku B<span class="arw" aria-hidden="true">&#8594;</span></a></div>
    </div>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: 'Kontakt — FS Invest',
    description: `FS Invest, ${c.address}, ${c.postal}, ${c.country}. ${c.phone} · ${c.email}`,
    path: '/kontakt/',
  }, body);
}

export function notFound(): string {
  return page({
    title: '404 — FS Invest',
    description: 'Faqja nuk u gjet.',
    path: '/404/',
  }, `<section class="section"><div class="wrap" style="min-height:52vh;display:flex;flex-direction:column;justify-content:center;gap:1.5rem">
    <p class="label">404</p>
    <h1 class="display h-hero">Faqja nuk<br>u gjet</h1>
    <div><a class="btn" href="/dardania/">Kthehu te projekti<span class="arw" aria-hidden="true">&#8594;</span></a></div>
  </div></section>`);
}
