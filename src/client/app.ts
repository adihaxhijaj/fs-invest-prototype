/* ==================================================================
   FS INVEST — client runtime
   No framework, no bundler. One module, progressive enhancement only:
   every page is fully readable and navigable with this file absent.
   ================================================================== */

const q = <T extends Element = Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const qa = <T extends Element = Element>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- intro ------------------------------------------------- */
function intro(): void {
  const el = q('[data-intro]');
  if (!el) return;
  const done = () => el.classList.add('is-done');
  if (reduced()) { el.remove(); return; }
  window.setTimeout(done, 900);
  window.addEventListener('load', () => window.setTimeout(done, 300));
  window.setTimeout(() => el.remove(), 2600);
}

/* ---------- reveal ------------------------------------------------- */
function reveals(): void {
  const items = qa('[data-reveal]');
  if (!items.length) return;
  if (reduced() || !('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const r = e.intersectionRect;
      if (e.isIntersecting && (r.height > 6 || r.width > 6 || e.target.clientHeight < 4)) {
        e.target.classList.add('is-in'); io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  items.forEach((i) => io.observe(i));
}

/* ---------- header -------------------------------------------------- */
function header(): void {
  const hdr = q<HTMLElement>('[data-header]');
  if (!hdr) return;
  const initial = hdr.dataset.mode ?? 'solid';
  const overs = qa<HTMLElement>('[data-header-over]');
  let last = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    let mode = initial === 'over' ? 'solid' : initial;
    if (initial === 'over') {
      const inOver = overs.some((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= 8 && r.bottom > 90;
      });
      mode = inOver ? 'over' : y < 40 ? 'over' : 'solid';
    }
    hdr.dataset.mode = mode;
    hdr.classList.toggle('is-hidden', y > 380 && y > last && !document.body.classList.contains('menu-open'));
    last = y;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- mobile menu ---------------------------------------------- */
function menu(): void {
  const btn = q<HTMLButtonElement>('[data-burger]');
  const panel = q<HTMLElement>('#menu');
  if (!btn || !panel) return;
  const set = (open: boolean) => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Mbyll menynë' : 'Hap menynë');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
  panel.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* ---------- page transitions ------------------------------------------ */
function transitions(): void {
  if (reduced()) return;
  const internal = (a: HTMLAnchorElement) =>
    a.host === location.host && !a.hasAttribute('download') && !a.target &&
    !a.href.includes('#') && !a.dataset.noTransition && a.pathname !== location.pathname;

  /* reveal done: drop the arrival class so it can't linger */
  q('.pt i:last-child')?.addEventListener('animationend', (ev) => {
    if ((ev as AnimationEvent).animationName === 'ptOff') document.body.classList.remove('pt-in');
  });

  let leaving = false;
  document.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const a = (e.target as HTMLElement).closest('a');
    if (!a || !internal(a as HTMLAnchorElement)) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    const href = (a as HTMLAnchorElement).href;
    /* leave only once the last (most delayed) column has fully covered the
       screen — a fixed timer shorter than the stagger cut the sweep short */
    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      try { sessionStorage.setItem('pt', '1'); } catch { /* storage blocked: no reveal */ }
      location.href = href;
    };
    const last = q('.pt i:last-child');
    last?.addEventListener('animationend', (ev) => {
      if ((ev as AnimationEvent).animationName === 'ptIn') go();
    });
    window.setTimeout(go, 1100);
    /* a page reached through a transition still carries pt-in, whose reveal
       rule would override the cover — drop it so the cover always plays */
    document.body.classList.remove('pt-in');
    void document.body.offsetWidth;
    document.body.classList.add('pt-out');
  });
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    leaving = false;
    document.body.classList.remove('pt-out');
  });
}

/* ---------- hero video ------------------------------------------------- */
function heroVideo(): void {
  for (const v of qa<HTMLVideoElement>('[data-hero-video]')) {
    const pick = () => (window.matchMedia('(max-width: 720px)').matches ? 'mobile' : 'desktop');
    const set = () => {
      const which = pick();
      if (v.dataset.current === which) return;
      v.dataset.current = which;
      const base = which === 'mobile' ? v.dataset.mobile! : v.dataset.desktop!;
      v.poster = (which === 'mobile' ? v.dataset.posterMobile : v.dataset.posterDesktop) || v.poster;
      v.innerHTML = `<source src="${base}.webm" type="video/webm"><source src="${base}.mp4" type="video/mp4">`;
      v.load();
      /* autoplay may be refused (data saver, low power) — the poster stands in */
      v.play().catch(() => undefined);
    };
    if (reduced()) { v.removeAttribute('autoplay'); v.pause(); continue; }
    set();
    let t = 0;
    window.addEventListener('resize', () => { window.clearTimeout(t); t = window.setTimeout(set, 250); });
  }
}

/* ---------- masterplan -------------------------------------------------- */
function masterplan(): void {
  const mp = q<HTMLElement>('[data-masterplan]');
  if (!mp) return;
  const card = q<HTMLElement>('[data-mp-card]', mp);
  const zones = qa<SVGGElement>('.mp__zone', mp);
  const touch = window.matchMedia('(hover: none)').matches;
  if (touch) mp.setAttribute('data-touch', '');

  const show = (z: SVGGElement) => {
    zones.forEach((o) => o.classList.toggle('is-active', o === z));
    mp.setAttribute('data-active', z.dataset.block!);
    if (!card) return;
    const d = z.dataset;
    card.innerHTML = `
      <h3>${d.name}</h3>
      <div class="mp__stats">
        <div><b>${d.floors}</b><span>Kate</span></div>
        <div><b>${d.units}</b><span>Banesa</span></div>
        <div><b>${d.available}</b><span>Të lira</span></div>
      </div>
      <a class="link" href="${d.href}">Eksploro bllokun<span class="arw" aria-hidden="true">&#8594;</span></a>`;
    card.classList.add('is-in');
  };

  /* On touch the first tap selects, the second opens. `focus` also previews,
     so selection is tracked separately from the CSS class. */
  let tapped: SVGGElement | null = null;
  zones.forEach((z) => {
    z.addEventListener('mouseenter', () => { if (!touch) show(z); });
    z.addEventListener('focus', () => show(z));
    z.addEventListener('click', (e) => {
      if (touch && tapped !== z) { e.preventDefault(); tapped = z; show(z); return; }
      location.href = z.dataset.href!;
    });
    z.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = z.dataset.href!; }
    });
  });
  if (!touch) {
    mp.addEventListener('mouseleave', () => {
      zones.forEach((o) => o.classList.remove('is-active'));
      mp.removeAttribute('data-active');
      card?.classList.remove('is-in');
    });
  }
}

/* ---------- block floor selector ------------------------------------------ */
function floorSelector(): void {
  const root = q<HTMLElement>('[data-floorsel]');
  if (!root) return;
  const bands = qa<SVGRectElement>('.fsel__band', root);
  const rows = qa<HTMLElement>('.fsel__row', root);

  const activate = (floor: string) => {
    bands.forEach((b) => b.classList.toggle('is-active', b.dataset.floor === floor));
    rows.forEach((r) => r.classList.toggle('is-active', r.dataset.floor === floor));
  };
  const go = (floor: string) => {
    const row = rows.find((r) => r.dataset.floor === floor);
    if (row?.dataset.href) location.href = row.dataset.href;
  };

  bands.forEach((b) => {
    b.addEventListener('mouseenter', () => activate(b.dataset.floor!));
    b.addEventListener('click', () => go(b.dataset.floor!));
  });
  rows.forEach((r) => {
    r.addEventListener('mouseenter', () => activate(r.dataset.floor!));
    r.addEventListener('focus', () => activate(r.dataset.floor!));
    r.addEventListener('click', () => go(r.dataset.floor!));
  });
}

/* ---------- floor plan unit picking ---------------------------------------- */
function floorPlan(): void {
  const svg = q<SVGSVGElement>('.plan--floor');
  const card = q<HTMLElement>('[data-unit-card]');
  if (!svg) return;
  const units = qa<SVGGElement>('.pl-unit', svg);

  const select = (u: SVGGElement | null) => {
    units.forEach((o) => o.classList.toggle('is-active', o === u));
    svg.classList.toggle('has-active', !!u);
    if (!card) return;
    if (!u) { card.classList.remove('is-in'); return; }
    const d = u.dataset;
    const st = d.status as 'available' | 'reserved' | 'sold';
    const label = st === 'available' ? 'E lirë' : st === 'reserved' ? 'E rezervuar' : 'E shitur';
    card.innerHTML = `
      <div class="ucard__head">
        <h2 class="display">${d.unit}</h2>
        <span class="pill pill--${st}"><i></i>${label}</span>
      </div>
      <dl class="ucard__list">
        <div><dt>Sipërfaqja</dt><dd class="num">${Number(d.area).toFixed(2)} m²</dd></div>
        <div><dt>Dhoma gjumi</dt><dd class="num">${d.bedrooms}</dd></div>
        <div><dt>Tipologjia</dt><dd>${d.typology}</dd></div>
      </dl>
      <a class="btn btn--block" href="/dardania/banesa/${(d.unit || '').toLowerCase()}/">Shiko banesën<span class="arw" aria-hidden="true">&#8594;</span></a>`;
    card.classList.add('is-in');
    if (window.matchMedia('(max-width: 900px)').matches) {
      card.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
    }
  };

  units.forEach((u) => {
    u.addEventListener('click', () => select(u.classList.contains('is-active') ? null : u));
    u.addEventListener('mouseenter', () => { if (!window.matchMedia('(hover: none)').matches) select(u); });
    u.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (u.classList.contains('is-active')) location.href = `/dardania/banesa/${(u.dataset.unit || '').toLowerCase()}/`;
        else select(u);
      }
    });
  });
  const first = units.find((u) => u.dataset.status === 'available');
  if (first && window.matchMedia('(hover: hover)').matches) select(first);
}

/* ---------- plan pan / zoom -------------------------------------------------- */
function planViews(): void {
  for (const root of qa<HTMLElement>('[data-planview]')) {
    const inner = q<HTMLElement>('[data-planview-inner]', root)!;
    let scale = 1, tx = 0, ty = 0;
    const apply = () => { inner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
    const clamp = () => {
      const max = Math.max(0, (root.clientWidth * scale - root.clientWidth) / 1);
      tx = Math.min(max * 0.5 + 40, Math.max(-max - 40, tx));
      const maxY = Math.max(0, (root.clientHeight * scale - root.clientHeight));
      ty = Math.min(maxY * 0.5 + 40, Math.max(-maxY - 40, ty));
    };
    const zoom = (f: number, ox?: number, oy?: number) => {
      const prev = scale;
      scale = Math.min(4, Math.max(1, +(scale * f).toFixed(3)));
      if (scale === 1) { tx = 0; ty = 0; }
      else if (ox !== undefined && oy !== undefined) {
        const k = scale / prev;
        tx = ox - (ox - tx) * k;
        ty = oy - (oy - ty) * k;
      }
      clamp(); apply();
      root.classList.toggle('is-zoomed', scale > 1);
    };

    q('[data-zoom="in"]', root)?.addEventListener('click', () => zoom(1.45, root.clientWidth / 2, root.clientHeight / 2));
    q('[data-zoom="out"]', root)?.addEventListener('click', () => zoom(1 / 1.45, root.clientWidth / 2, root.clientHeight / 2));
    q('[data-zoom="reset"]', root)?.addEventListener('click', () => { scale = 1; tx = 0; ty = 0; apply(); root.classList.remove('is-zoomed'); });

    let dragging = false, sx = 0, sy = 0, moved = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch = 0;

    root.addEventListener('pointerdown', (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); return; }
      if (scale === 1) return;
      dragging = true; moved = 0; sx = e.clientX - tx; sy = e.clientY - ty;
      root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinch) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (Math.abs(d - pinch) > 4) { zoom(d / pinch); pinch = d; }
        return;
      }
      if (!dragging) return;
      tx = e.clientX - sx; ty = e.clientY - sy; moved++;
      clamp(); apply();
    });
    const up = (e: PointerEvent) => { pointers.delete(e.pointerId); pinch = 0; dragging = false; };
    root.addEventListener('pointerup', up);
    root.addEventListener('pointercancel', up);
    root.addEventListener('click', (e) => { if (moved > 3) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
    root.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && scale === 1) return;
      e.preventDefault();
      const r = root.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
  }
}

/* ---------- enquiry sheet --------------------------------------------------- */
function enquiry(): void {
  const sheet = q<HTMLElement>('[data-sheet]');
  if (!sheet) return;
  const form = q<HTMLFormElement>('form', sheet)!;
  const ctxWrap = q<HTMLElement>('[data-sheet-context]', sheet);
  let opener: HTMLElement | null = null;

  const open = (btn: HTMLElement) => {
    opener = btn;
    const ctx = btn.dataset.context ? JSON.parse(btn.dataset.context) as Record<string, string> : {};
    ctx.url = location.href;
    const hidden = q<HTMLInputElement>('input[name="context"]', form)!;
    hidden.value = JSON.stringify(ctx);
    if (ctxWrap) {
      ctxWrap.innerHTML = Object.entries(ctx)
        .filter(([k]) => k !== 'url')
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    }
    sheet.classList.add('is-open');
    document.body.classList.add('sheet-open');
    document.documentElement.style.overflow = 'hidden';
    window.setTimeout(() => q<HTMLInputElement>('input[name="name"]', form)?.focus(), 380);
  };
  const close = () => {
    sheet.classList.remove('is-open');
    document.body.classList.remove('sheet-open');
    document.documentElement.style.overflow = '';
    opener?.focus();
  };

  qa<HTMLElement>('[data-enquire]').forEach((b) => b.addEventListener('click', () => open(b)));
  qa('[data-sheet-close]', sheet).forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('is-open')) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const state = q<HTMLElement>('[data-sheet-state]', sheet)!;
    /* Prototype: no backend. A production build posts to /api/leads with the
       same payload, which already carries the full unit context. */
    const payload = Object.fromEntries(new FormData(form).entries());
    // eslint-disable-next-line no-console
    console.info('[FS] lead payload', payload);
    form.hidden = true;
    state.hidden = false;
    state.focus();
  });
}

/* ---------- WhatsApp ---------------------------------------------------------- */
function whatsapp(): void {
  for (const a of qa<HTMLAnchorElement>('[data-wa]')) {
    const msg = a.dataset.wa!;
    const number = a.dataset.waNumber;
    a.href = number
      ? `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
      : `sms:?&body=${encodeURIComponent(msg)}`;
  }
}

/* ---------- specification sheet (PDF) ------------------------------------------- */
const PDF_CSS = `
.pl-slab{fill:#fff}.pl-room-fill{fill:#fff}
.pl-wall-out{fill:none;stroke:#14161A;stroke-width:2.6}
.pl-wall-in{fill:none;stroke:#14161A;stroke-width:.9;stroke-opacity:.55}
.pl-win-cut{stroke:#fff;stroke-width:3.2}.pl-win{stroke:#14161A;stroke-width:.7}.pl-gap{stroke:#fff;stroke-width:2.4}
.pl-door{fill:none;stroke:#14161A;stroke-width:.7;stroke-opacity:.42}
.pl-balcony{fill:rgba(20,22,26,.035);stroke:#14161A;stroke-width:.9;stroke-opacity:.5}
text{font-family:"Roboto Mono",monospace}
.pl-lbl{fill:#14161A;font-size:8.2px;letter-spacing:.1em;text-anchor:middle;font-family:"Roboto Mono",monospace}
.pl-area{fill:#83878C;font-size:7.4px;text-anchor:middle;font-family:"Roboto Mono",monospace}
.pl-lbl-out{fill:#83878C;font-size:7.4px}
.pl-corridor{fill:rgba(20,22,26,.055)}
.pl-core-box{fill:rgba(20,22,26,.09);stroke:#14161A;stroke-width:.9;stroke-opacity:.5}
.pl-lift,.pl-stair{fill:none;stroke:#14161A;stroke-width:.8;stroke-opacity:.55}
.pl-tread{stroke:#14161A;stroke-width:.55;stroke-opacity:.35}
.pl-core-lbl{fill:#83878C;font-size:7px;text-anchor:middle;font-family:"Roboto Mono",monospace}
.pl-unit-fill{fill:rgba(20,22,26,.05)}.pl-unit-wall{fill:none;stroke:#14161A;stroke-width:1.9}
.pl-unit-id{font-family:"Roboto",sans-serif;font-size:13px;text-anchor:middle;fill:#14161A}
.pl-unit-area{font-size:8px;text-anchor:middle;fill:#83878C;font-family:"Roboto Mono",monospace}
.pl-compass{stroke:#83878C;fill:#83878C;stroke-width:.9}.pl-compass text{font-size:8px;text-anchor:middle;stroke:none}
`;

/* An SVG drawn through <img> is sandboxed and can't reach the page's web
   fonts, so the plan's typefaces are inlined into it as data URIs. */
let svgFontCss: Promise<string> | null = null;
function planFontCss(): Promise<string> {
  const face = async (family: string, file: string, weight: number) => {
    const buf = new Uint8Array(await (await fetch(`/fonts/${file}`)).arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${btoa(bin)}) format("woff2");font-weight:${weight};font-style:normal}`;
  };
  svgFontCss ??= Promise.all([
    face('Roboto', 'roboto-latin-400-normal.woff2', 400),
    face('Roboto Mono', 'roboto-mono-latin-400-normal.woff2', 400),
  ]).then((f) => f.join('\n')).catch(() => '');
  return svgFontCss;
}

async function svgToPng(svg: SVGSVGElement, width: number): Promise<Uint8Array> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = (await planFontCss()) + PDF_CSS;
  clone.insertBefore(style, clone.firstChild);
  const vb = (clone.getAttribute('viewBox') || '0 0 100 100').split(/\s+/).map(Number);
  const ratio = vb[3] / vb[2];
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(Math.round(width * ratio)));
  const xml = new XMLSerializer().serializeToString(clone);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  const img = new Image();
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('svg')); img.src = url; });
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = Math.round(width * ratio);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

const loadScript = (src: string, global: string): Promise<any> => new Promise((res, rej) => {
  const s = document.createElement('script');
  s.src = src;
  s.onload = () => res((window as any)[global]);
  s.onerror = () => rej(new Error(global));
  document.head.appendChild(s);
});

let pdfLibPromise: Promise<[any, any]> | null = null;
function loadPdfLib(): Promise<[any, any]> {
  pdfLibPromise ??= Promise.all([
    loadScript('/vendor/pdf-lib.min.js', 'PDFLib'),
    loadScript('/vendor/fontkit.umd.min.js', 'fontkit'),
  ]);
  return pdfLibPromise;
}

const bytes = async (url: string) => new Uint8Array(await (await fetch(url)).arrayBuffer());

async function buildSheet(btn: HTMLElement): Promise<void> {
  const data = JSON.parse(btn.dataset.specSheet!) as {
    id: string; title: string; project: string; lines: [string, string][];
    areas: [string, string][]; render: string; qr: string; url: string;
    status: string; footnote: string; contact: string[]; planSel: string;
  };
  const [PDFLib, fontkit] = await loadPdfLib();
  const { PDFDocument, rgb } = PDFLib;
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`FS Invest · ${data.title}`);
  doc.setAuthor('FS Invest');
  doc.setSubject(data.project);

  const page = doc.addPage([595.28, 841.89]);          // A4
  const W = 595.28, H = 841.89, M = 42;
  /* same typefaces as the site: Roboto for headings, Roboto Mono for text */
  const [bold, head, reg] = await Promise.all([
    bytes('/fonts/roboto-latin-700-normal.woff'),
    bytes('/fonts/roboto-latin-400-normal.woff'),
    bytes('/fonts/roboto-mono-latin-400-normal.woff'),
  ].map(async (b) => doc.embedFont(await b, { subset: true })));
  const ink = rgb(0.078, 0.086, 0.102);
  const grey = rgb(0.51, 0.53, 0.55);
  const hair = rgb(0.82, 0.81, 0.79);

  const width = (str: string, size: number, f = reg, spacing = 0) =>
    f.widthOfTextAtSize(str, size) + spacing * str.length;
  const draw = (str: string, x: number, y: number, size: number, f = reg, color = ink, spacing = 0) => {
    if (str) page.drawText(str, { x, y, size, font: f, color, characterSpacing: spacing });
    return width(str, size, f, spacing);
  };
  const line = (x1: number, y1: number, x2: number, y2: number, c = hair, t = 0.6) =>
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: t, color: c });

  /* masthead */
  let y = H - M - 12;
  /* divider centred in the gap: measure "FS" without its trailing tracking */
  const fsW = width('FS', 13, bold, 3) - 3;
  draw('FS', M, y, 13, bold, ink, 3);
  line(M + fsW + 5, y - 1.5, M + fsW + 5, y + 10.5, ink, 0.7);
  draw('INVEST', M + fsW + 10, y, 13, head, ink, 4);
  const projU = data.project.toUpperCase();
  draw(projU, W - M - width(projU, 8.5, reg, 2), y + 2, 8.5, reg, grey, 2);
  y -= 12; line(M, y, W - M, y, ink, 1);

  /* hero render */
  y -= 16;
  try {
    const img = await doc.embedJpg(await bytes(data.render));
    const iw = W - M * 2;
    const ih = Math.min(200, (img.height / img.width) * iw);
    const dw = (img.width / img.height) * ih;
    page.drawImage(img, { x: M + (iw - dw) / 2, y: y - ih, width: dw, height: ih });
    y -= ih + 26;
  } catch { y -= 8; }

  /* title */
  draw(data.id, M, y - 26, 32, bold, ink, -0.6);
  const st = data.status.toUpperCase();
  draw(st, W - M - width(st, 8.5, reg, 2), y - 12, 8.5, reg, grey, 2);
  y -= 34;
  draw(data.title, M, y - 13, 9.5, reg, grey, 0.5);
  y -= 26; line(M, y, W - M, y);

  /* left column: specification */
  const colW = (W - M * 2) * 0.40;
  /* Roboto Mono runs wide, so long values wrap inside the column instead of
     running under the plan */
  const wrap = (str: string, size: number, max: number) => {
    const rows: string[] = [];
    let row = '';
    for (const word of str.split(' ')) {
      const next = row ? `${row} ${word}` : word;
      if (row && width(next, size) > max) { rows.push(row); row = word; } else row = next;
    }
    if (row) rows.push(row);
    return rows;
  };
  let ly = y - 22;
  for (const [k, v] of data.lines) {
    draw(k.toUpperCase(), M, ly, 6.6, reg, grey, 1.4);
    const rows = wrap(v, 11.5, colW - 6);
    rows.forEach((r, i) => draw(r, M, ly - 13 - i * 14, 11.5, reg, ink));
    ly -= 32 + (rows.length - 1) * 14;
  }

  /* right column: plan */
  const planSvg = document.querySelector<SVGSVGElement>(data.planSel);
  const planBottom = Math.min(ly + 18, 268);
  if (planSvg) {
    try {
      const png = await doc.embedPng(await svgToPng(planSvg, 1500));
      const pw = (W - M * 2) - colW - 16;
      const ph = y - 14 - planBottom;
      const sc = Math.min(pw / png.width, ph / png.height);
      page.drawImage(png, {
        x: M + colW + 16 + (pw - png.width * sc) / 2,
        y: y - 14 - png.height * sc,
        width: png.width * sc, height: png.height * sc,
      });
    } catch { /* the sheet still prints without the plan */ }
  }

  /* area breakdown */
  /* rule sits clear of the last value's descenders and the plan's bottom label */
  let ay = Math.min(ly - 2, planBottom - 22);
  line(M, ay + 14, W - M, ay + 14);
  draw('NDARJA E SIPËRFAQES', M, ay, 6.6, head, grey, 1.6);
  ay -= 18;
  const half = Math.ceil(data.areas.length / 2);
  const colGap = (W - M * 2) / 2;
  data.areas.forEach(([k, v], i) => {
    const col = i < half ? 0 : 1;
    const row = i % half;
    const x = M + col * colGap;
    const yy = ay - row * 14;
    draw(k, x, yy, 8.4, reg, ink);
    draw(v, x + colGap - 26 - width(v, 8.4), yy, 8.4, reg, grey);
    line(x, yy - 4.5, x + colGap - 26, yy - 4.5, rgb(0.9, 0.89, 0.87), 0.4);
  });

  /* footer */
  const fy = M + 74;
  line(M, fy + 20, W - M, fy + 20, ink, 1);
  data.contact.forEach((c, i) => draw(c, M, fy - i * 13, 8.4, i === 0 ? bold : reg, i === 0 ? ink : grey));
  try {
    const qr = await doc.embedPng(await bytes(data.qr));
    page.drawImage(qr, { x: W - M - 58, y: fy - 28, width: 58, height: 58 });
    draw('SKANO PËR NJËSINË', W - M - 58, fy - 38, 5.6, reg, grey, 1.1);
  } catch { /* qr optional */ }
  draw(data.url, M, M + 4, 7, reg, grey);
  draw(data.footnote, M, M - 8, 6.2, reg, grey);

  const blob = new Blob([await doc.save()], { type: 'application/pdf' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `FS-Invest_${data.id.replace(/[^\w-]/g, '')}.pdf`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function sheets(): void {
  for (const btn of qa<HTMLElement>('[data-spec-sheet]')) {
    btn.addEventListener('click', async () => {
      const label = btn.querySelector('[data-sheet-label]') ?? btn;
      const original = label.textContent;
      label.textContent = 'Duke përgatitur…';
      (btn as HTMLButtonElement).disabled = true;
      try { await buildSheet(btn); label.textContent = original; }
      catch (err) { console.error(err); label.textContent = 'Provo përsëri'; }
      finally { (btn as HTMLButtonElement).disabled = false; }
    });
  }
}

/* ---------- location sequence -------------------------------------------------- */
function locationScene(): void {
  const scene = q<HTMLElement>('[data-location]');
  if (!scene) return;
  const steps = qa<HTMLElement>('[data-loc-step]', scene);
  const ticks = qa<HTMLElement>('[data-loc-tick]', scene);
  const stage = q<HTMLElement>('[data-loc-stage]', scene);
  if (!stage) return;

  const onScroll = () => {
    const r = scene.getBoundingClientRect();
    const total = scene.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    stage.style.setProperty('--p', p.toFixed(4));
    const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
    steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    ticks.forEach((s, i) => s.classList.toggle('is-on', i <= idx));
  };
  if (reduced()) { steps[0]?.classList.add('is-on'); ticks.forEach((t) => t.classList.add('is-on')); return; }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/* ---------- boot -------------------------------------------------------------- */
function boot(): void {
  intro(); reveals(); header(); menu(); transitions(); heroVideo();
  masterplan(); floorSelector(); floorPlan(); planViews();
  enquiry(); whatsapp(); sheets(); locationScene();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
