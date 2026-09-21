import { page } from '../components/layout.ts';
import { enquirySheet } from '../components/sheet.ts';
import { breadcrumb, sectionHead } from '../components/ui.ts';
import { company } from '../data/company.ts';
import { project } from '../data/project.ts';
import { site } from '../data/site.ts';
import { esc } from '../lib/html.ts';

export function companyPage(): string {
  const body = `
<section class="section section--tight">
  <div class="wrap">
    ${breadcrumb([{ href: '/', label: 'FS Invest' }, { label: 'Kompania' }])}
    <div class="chead">
      <h1 class="display h-hero">FS<br>Invest</h1>
      <p class="lead lead--xl">${esc(company.intro)}</p>
    </div>
  </div>
</section>

<figure class="cimg" data-reveal="img">
  <picture>
    <source media="(min-width:900px)" srcset="/dardania/masterplan/complex-day.webp">
    <img src="/dardania/masterplan/complex-day.jpg" alt="Kompleksi Dardania — renderim ditor" loading="lazy" width="1080" height="608">
  </picture>
  <figcaption class="label">Dardania Complex, Skenderaj — zhvillimi aktual</figcaption>
</figure>

<section class="section deep">
  <div class="wrap">
    <blockquote class="quote" data-reveal>
      <p class="display h2">“${esc(company.mission)}”</p>
      <cite class="label">${esc(company.name)}</cite>
    </blockquote>
    <dl class="stats stats--big">
      ${company.published.map((p, i) => `<div class="stats__i" data-reveal style="--rd:${i * 70}ms">
        <dt class="label">${esc(p.label)}</dt>
        <dd><span class="stats__v display num">${p.value}</span><span class="stats__u">${p.unit}</span></dd></div>`).join('')}
      <div class="stats__i" data-reveal style="--rd:140ms"><dt class="label">Baza</dt><dd><span class="stats__v stats__v--text display">Skenderaj</span></dd></div>
    </dl>
    <p class="src-note">Shifrat e kënaqshmërisë janë të publikuara nga FS.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Procesi', num: '01', title: 'Si punojmë' })}
    <div class="proc">
      ${company.process.map((p, i) => `<div class="proc__i" data-reveal style="--rd:${i * 70}ms">
        <span class="proc__n display num">${p.n}</span>
        <h3 class="proc__t">${esc(p.title)}</h3>
        <p class="muted">${esc(p.body)}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--tight bg-alt">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Shërbimet', num: '02', title: 'Çfarë mbulojmë' })}
    <ul class="svc">
      ${company.services.map((s, i) => `<li data-reveal style="--rd:${i * 40}ms">
        <h3 class="svc__t">${esc(s.title)}</h3>
        <p class="muted">${esc(s.body)}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section deep">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Kronologjia', num: '03', title: 'Zhvillimi' })}
    <ol class="tline">
      ${company.milestones.map((m, i) => `<li class="tline__i" data-reveal style="--rd:${i * 90}ms">
        <span class="tline__y display num">${esc(m.year)}</span>
        <span class="tline__bar" data-reveal="line" style="--rd:${i * 90 + 120}ms"></span>
        <div class="tline__c"><h3 class="tline__t">${esc(m.title)}</h3><p class="muted">${esc(m.body)}</p></div>
      </li>`).join('')}
    </ol>
    <p class="src-note">Kronologjia përmban vetëm data të publikuara nga FS. Ngjarjet e tjera shtohen kur konfirmohen.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ eyebrow: 'Zhvillimi aktual', num: '04', title: 'Dardania<br>Complex' })}
        <p class="lead">Pesë blloqe në qendër të Skenderajt, të zhvilluara në bashkëpunim me ${esc(project.architect)}.</p>
        <a class="btn" href="/dardania/">Shiko projektin<span class="arw" aria-hidden="true">&#8594;</span></a>
      </div>
      <dl class="drows">
        <div class="drow"><dt class="label">Lokacioni</dt><dd>${project.city}, ${project.country}</dd></div>
        <div class="drow"><dt class="label">Statusi</dt><dd>${project.status}</dd></div>
        <div class="drow"><dt class="label">Arkitektura</dt><dd>${esc(project.architect)}</dd></div>
        <div class="drow"><dt class="label">Kontakt</dt><dd><a href="tel:${site.contact.phoneHref}">${site.contact.phone}</a></dd></div>
      </dl>
    </div>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: 'Kompania — FS Invest',
    description: 'FS Invest zhvillon objekte banimi dhe hapësira afariste në Kosovë. Procesi, shërbimet dhe zhvillimi aktual: Dardania Complex, Skenderaj.',
    path: '/kompania/',
  }, body);
}
