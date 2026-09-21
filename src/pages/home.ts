import { page } from '../components/layout.ts';
import { locationScene } from '../components/location.ts';
import { blockList, masterplan } from '../components/masterplan.ts';
import { enquirySheet } from '../components/sheet.ts';
import { sectionHead, statList } from '../components/ui.ts';
import { project, standard } from '../data/project.ts';
import { site } from '../data/site.ts';
import { projectTally } from '../data/units.ts';
import { commercialTotal, commercialUnits } from '../data/commercial.ts';
import { int } from '../lib/html.ts';

export function home(): string {
  const t = projectTally();
  const body = `
<section class="hero" data-header-over>
  <div class="hero__media">
    <video class="hero__video" data-hero-video
      data-desktop="/dardania/hero/hero-desktop"
      data-mobile="/dardania/hero/hero-mobile"
      data-poster-desktop="/dardania/hero/hero-poster.jpg"
      data-poster-mobile="/dardania/hero/hero-poster-mobile.webp"
      poster="/dardania/hero/hero-poster.jpg"
      autoplay muted loop playsinline preload="none" aria-hidden="true">
      <source src="/dardania/hero/hero-desktop.webm" type="video/webm">
      <source src="/dardania/hero/hero-desktop.mp4" type="video/mp4">
    </video>
    <div class="hero__veil" aria-hidden="true"></div>
  </div>
  <div class="hero__in wrap">
    <p class="hero__eyebrow label">${project.city}, ${project.country} — ${project.status}</p>
    <h1 class="hero__title display">Dardania<br>Complex</h1>
    <p class="hero__sub">Në zemër të Skenderajt. Pesë blloqe, banim urban dhe hapësira afariste në një zhvillim të vetëm.</p>
    <div class="hero__cta">
      <a class="btn" href="/dardania/">Eksploro projektin<span class="arw" aria-hidden="true">&#8594;</span></a>
      <a class="btn btn--ghost" href="/dardania/hapesira-afariste/">Hapësira afariste</a>
    </div>
  </div>
  <a class="hero__scroll" href="#hyrje" aria-label="Vazhdo poshtë"><span></span><i>Rrëshqit</i></a>
</section>

<section class="section" id="hyrje">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Projekti', num: '01',
      title: 'Një zhvillim,<br>pesë blloqe',
      lead: 'Kompleksi Dardania është zhvilluar sipas kushteve urbanistike të Komunës së Skenderajt, në një parcelë prej afërsisht një hektari në qendër të qytetit. Banimi, hapësirat afariste dhe parkingu janë të integruara në një strukturë të vetme urbane.',
    })}
    ${statList(project.facts.slice(0, 8))}
    <p class="src-note">Të dhënat e mësipërme janë publikuar nga FS për Kompleksin Dardania.</p>
  </div>
</section>

${locationScene()}

<section class="section deep" id="kompleksi">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Kompleksi', num: '02',
      title: 'Ndërtesat<br>janë navigimi',
      lead: 'Zgjidh një bllok drejt në renderim — çdo bllok hapet me katet, planet dhe banesat e veta.',
    })}
  </div>
  ${masterplan()}
  <div class="wrap">${blockList()}</div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ eyebrow: 'Disponueshmëria', num: '03', title: 'Gjendja<br>aktuale' })}
        <p class="lead">Statusi i çdo njësie përditësohet nga një burim i vetëm i të dhënave dhe reflektohet menjëherë në renderim, në plan dhe në faqen e banesës.</p>
        <a class="link" href="/dardania/blloku/b/">Shiko Bllokun B<span class="arw" aria-hidden="true">&#8594;</span></a>
      </div>
      <dl class="stats stats--big">
        <div class="stats__i" data-reveal><dt class="label">Banesa gjithsej</dt><dd><span class="stats__v display num">${t.total}</span></dd></div>
        <div class="stats__i" data-reveal style="--rd:60ms"><dt class="label">Të lira</dt><dd><span class="stats__v display num">${t.available}</span></dd></div>
        <div class="stats__i" data-reveal style="--rd:120ms"><dt class="label">Hapësira afariste</dt><dd><span class="stats__v display num">${commercialUnits.length}</span><span class="stats__u">njësi · ${int(Math.round(commercialTotal))} m²</span></dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section section--tight bg-alt" id="standardi">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Standardi i ndërtimit', num: '04', title: 'Çfarë ndërtohet' })}
    <div class="std">
      ${standard.map((s, i) => `<div class="std__i" data-reveal style="--rd:${i * 45}ms">
        <h3 class="std__t">${s.title}</h3>
        <p class="muted">${s.body}</p>
      </div>`).join('')}
    </div>
    <p class="src-note">Specifikimet përfundimtare konfirmohen me dokumentacionin teknik të projektit.</p>
  </div>
</section>

<section class="section deep cta-band">
  <div class="wrap">
    <h2 class="display h1" data-reveal>Bisedo për<br>një banesë</h2>
    <div class="cta-band__row">
      <p class="lead" data-reveal>Ekipi i shitjes në Skenderaj ju përgjigjet për disponueshmërinë, planet dhe kushtet.</p>
      <div class="cta-band__btns" data-reveal>
        <a class="btn" href="/kontakt/">Kontakt</a>
        <a class="btn btn--ghost" href="tel:${site.contact.phoneHref}">${site.contact.phone}</a>
      </div>
    </div>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: 'FS Invest — Dardania Complex, Skenderaj',
    description: 'Dardania Complex: pesë blloqe banimi dhe hapësira afariste në qendër të Skenderajt. Zgjidh bllokun, katin dhe banesën.',
    path: '/',
    headerMode: 'over',
    intro: true,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: site.legalName, url: site.url,
      telephone: site.contact.phone, email: site.contact.email,
      address: { '@type': 'PostalAddress', streetAddress: site.contact.address, addressLocality: 'Skenderaj', postalCode: '41000', addressCountry: 'XK' },
    },
  }, body);
}
