import { nav, site } from '../data/site.ts';
import { esc } from '../lib/html.ts';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** header treatment on load */
  headerMode?: 'over' | 'solid' | 'solid-deep';
  bodyClass?: string;
  ogImage?: string;
  /** JSON-LD */
  jsonLd?: object;
  intro?: boolean;
}

const mark = (tag = 'span') =>
  `<${tag} class="mark" aria-label="${esc(site.brand)}"><span class="mark__fs">FS</span><span class="mark__word">Invest</span></${tag}>`;

export const wordmark = mark;

function header(meta: PageMeta): string {
  return `<header class="hdr" data-mode="${meta.headerMode ?? 'solid'}" data-header>
  <div class="hdr__in">
    <a href="/" class="hdr__mark" aria-label="FS Invest — ballina">${mark()}</a>
    <nav class="nav" aria-label="Kryesore">
      ${nav.map((n) => `<a href="${n.href}"${meta.path.startsWith(n.href) ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
    </nav>
    <button class="burger" type="button" aria-label="Hap menynë" aria-expanded="false" data-burger><span></span></button>
  </div>
</header>
<div class="menu" id="menu">
  <nav aria-label="Menyja mobile">
    <ul class="menu__list">
      <li><a href="/">Ballina</a></li>
      ${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
    </ul>
  </nav>
  <div class="menu__foot">
    <span>${esc(site.contact.phone)}</span>
    <span>${esc(site.contact.email)}</span>
    <span>${esc(site.contact.postal)}, ${esc(site.contact.country)}</span>
  </div>
</div>`;
}

function footer(): string {
  const c = site.contact;
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div class="ftr__brand">
        ${mark('div')}
        <p class="lead" style="font-size:var(--t-body);max-width:24rem">Zhvillues i pasurive të paluajtshme në Kosovë. Projekti aktual: Dardania Complex, Skenderaj.</p>
      </div>
      <div>
        <h3>Navigimi</h3>
        <ul>
          <li><a href="/dardania/">Dardania Complex</a></li>
          <li><a href="/dardania/hapesira-afariste/">Hapësira afariste</a></li>
          <li><a href="/kompania/">Kompania</a></li>
          <li><a href="/kontakt/">Kontakt</a></li>
        </ul>
      </div>
      <div>
        <h3>Kontakt</h3>
        <ul>
          <li><a href="tel:${esc(c.phoneHref)}">${esc(c.phone)}</a></li>
          <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
          <li><a href="${esc(c.maps)}" target="_blank" rel="noopener">${esc(c.address)}<br>${esc(c.postal)}, ${esc(c.country)}</a></li>
          <li style="margin-top:1rem"><a href="${esc(c.instagram)}" target="_blank" rel="noopener">Instagram</a> · <a href="${esc(c.facebook)}" target="_blank" rel="noopener">Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__bar">
      <span>© ${new Date().getFullYear()} ${esc(site.legalName)}</span>
      <span>${esc(site.tagline)}</span>
    </div>
  </div>
</footer>`;
}

export function page(meta: PageMeta, body: string): string {
  const url = site.url + meta.path;
  const og = meta.ogImage ?? '/dardania/masterplan/complex-night.jpg';
  return `<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
${site.prototype.isConceptPrototype ? '<meta name="robots" content="noindex,nofollow">' : ''}
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="FS Invest">
<meta property="og:locale" content="sq_AL">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(site.url + og)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0C0D0E">
<link rel="preload" href="/fonts/roboto-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/roboto-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/app.css">
<link rel="icon" href="/fs/favicon.svg" type="image/svg+xml">
${meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : ''}
</head>
<body class="${meta.bodyClass ?? ''}" data-page="${esc(meta.path)}">
<a class="skip" href="#main">Kalo te përmbajtja</a>
${meta.intro ? '<div class="intro" data-intro><div class="intro__mark">' + mark('div') + '<div class="intro__bar"><i></i></div></div></div>' : ''}
<div class="pt" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
<script>try{if(sessionStorage.getItem('pt')){sessionStorage.removeItem('pt');document.body.classList.add('pt-in')}}catch(e){}</script>
${header(meta)}
<main id="main">
${body}
</main>
${footer()}
${site.prototype.isConceptPrototype ? `<aside class="proto" role="note" title="${esc(site.prototype.note)}" data-proto><span>${esc(site.prototype.badge)}</span><button type="button" aria-label="Mbyll" data-proto-close>×</button></aside>
<script>try{if(sessionStorage.getItem('proto-x'))document.querySelector('[data-proto]').hidden=true}catch(e){}document.querySelector('[data-proto-close]').onclick=function(){this.parentNode.hidden=true;try{sessionStorage.setItem('proto-x','1')}catch(e){}}</script>` : ''}
<script type="module" src="/assets/app.js"></script>
</body>
</html>`;
}
