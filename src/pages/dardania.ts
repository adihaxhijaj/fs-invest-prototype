import { page } from '../components/layout.ts';
import { blockList, masterplan } from '../components/masterplan.ts';
import { enquirySheet } from '../components/sheet.ts';
import { breadcrumb, sectionHead, statList } from '../components/ui.ts';
import { project, standard } from '../data/project.ts';
import { commercialTotal, commercialUnits } from '../data/commercial.ts';
import { projectTally } from '../data/units.ts';
import { int } from '../lib/html.ts';

export function dardania(): string {
  const t = projectTally();
  const body = `
<section class="phero deep" data-header-over>
  <div class="phero__media">
    <picture>
      <source media="(min-width:900px)" srcset="/dardania/masterplan/complex-dusk.webp">
      <img src="/dardania/masterplan/complex-dusk.jpg" alt="Kompleksi Dardania — renderim i frontit kryesor" fetchpriority="high" width="1080" height="608">
    </picture>
    <div class="phero__veil" aria-hidden="true"></div>
  </div>
  <div class="wrap phero__in">
    ${breadcrumb([{ href: '/', label: 'FS Invest' }, { label: 'Dardania Complex' }])}
    <h1 class="display h-hero phero__title">Dardania<br>Complex</h1>
    <div class="phero__facts">
      <div><span class="label">Lokacioni</span><b>${project.city}, ${project.country}</b></div>
      <div><span class="label">Statusi</span><b>${project.status}</b></div>
      <div><span class="label">Arkitektura</span><b>${project.architect}</b></div>
      <div><span class="label">Zhvilluesi</span><b>FS Invest</b></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="intro-split">
      <p class="label" data-reveal>Përmbledhje</p>
      <div>
        <p class="lead lead--xl" data-reveal>Pesë blloqe me lartësi të shkallëzuar formojnë një front të vazhdueshëm urban përgjatë rrugës, me hapësira afariste në përdhesë dhe banim mbi to.</p>
        <p class="muted measure" data-reveal style="--rd:80ms">Struktura më e lartë është 3B+S+P+11K+NK. Nën tokë shtrihen tri nivele bodrumi me 275 vende parkimi të mbuluara; 75 vende shtesë janë të organizuara jashtë për vizitorë.</p>
      </div>
    </div>
    ${statList(project.facts)}
    <p class="src-note">Burimi: dokumentacioni publik i FS për Kompleksin Dardania.</p>
  </div>
</section>

<section class="section deep" id="blloqet">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Zgjidh bllokun', num: '01', title: 'Blloqet' })}
  </div>
  ${masterplan()}
  <div class="wrap">${blockList()}</div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ eyebrow: 'Hapësira afariste', num: '02', title: 'Përdhesa<br>komerciale' })}
        <p class="lead">${commercialUnits.length} njësi afariste përgjatë frontit të rrugës, me hyrje të drejtpërdrejta dhe sipërfaqe nga ${Math.min(...commercialUnits.map((c) => c.area)).toFixed(0)} deri në ${Math.max(...commercialUnits.map((c) => c.area)).toFixed(0)} m².</p>
        <a class="btn" href="/dardania/hapesira-afariste/">Shiko hapësirat<span class="arw" aria-hidden="true">&#8594;</span></a>
      </div>
      <dl class="stats stats--3">
        <div class="stats__i" data-reveal><dt class="label">Njësi afariste</dt><dd><span class="stats__v display num">${commercialUnits.length}</span></dd></div>
        <div class="stats__i" data-reveal style="--rd:60ms"><dt class="label">Sipërfaqe e listuar</dt><dd><span class="stats__v display num">${int(Math.round(commercialTotal))}</span><span class="stats__u">m²</span></dd></div>
        <div class="stats__i" data-reveal style="--rd:120ms"><dt class="label">Banesa të lira</dt><dd><span class="stats__v display num">${t.available}</span></dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section section--tight bg-alt">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Standardi i ndërtimit', num: '03', title: 'Specifikimet' })}
    <div class="std">
      ${standard.map((s, i) => `<div class="std__i" data-reveal style="--rd:${i * 45}ms"><h3 class="std__t">${s.title}</h3><p class="muted">${s.body}</p></div>`).join('')}
    </div>
  </div>
</section>
${enquirySheet()}`;

  return page({
    title: 'Dardania Complex — FS Invest',
    description: 'Pesë blloqe, banim urban dhe hapësira afariste në qendër të Skenderajt. Zgjidh bllokun, katin dhe banesën.',
    path: '/dardania/',
    headerMode: 'over',
  }, body);
}
