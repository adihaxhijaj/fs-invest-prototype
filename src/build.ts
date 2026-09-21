import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const dist = path.join(root, 'dist');

export function write(rel: string, html: string): void {
  const file = rel.endsWith('.xml') || rel.endsWith('.txt') || rel.endsWith('.json')
    ? path.join(dist, rel)
    : path.join(dist, rel, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function copyDir(from: string, to: string): void {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function main(): Promise<void> {
  /* clear dist but keep the Vercel project link (dist/ is what gets deployed) */
  const keep = new Set(['.vercel', '.env.local', '.gitignore']);
  if (fs.existsSync(dist)) {
    for (const e of fs.readdirSync(dist)) {
      if (!keep.has(e)) fs.rmSync(path.join(dist, e), { recursive: true, force: true });
    }
  }
  fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });

  /* static assets */
  copyDir(path.join(root, 'public'), dist);

  /* typefaces (Roboto headings, Roboto Mono body) + fontkit for the PDF
     sheet: taken straight from their npm packages so nothing is vendored
     twice. The latin .woff files are what pdf-lib embeds into the sheet. */
  fs.mkdirSync(path.join(dist, 'fonts'), { recursive: true });
  for (const [pkg, family] of [['roboto', 'roboto'], ['roboto-mono', 'roboto-mono']]) {
    const files = path.join(root, 'node_modules/@fontsource', pkg, 'files');
    for (const subset of ['latin', 'latin-ext']) {
      for (const weight of ['400', '700']) {
        const name = `${family}-${subset}-${weight}-normal`;
        fs.copyFileSync(path.join(files, `${name}.woff2`), path.join(dist, 'fonts', `${name}.woff2`));
        if (subset === 'latin') fs.copyFileSync(path.join(files, `${name}.woff`), path.join(dist, 'fonts', `${name}.woff`));
      }
    }
    fs.copyFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'LICENSE'), path.join(dist, 'fonts', `${family}-LICENSE.txt`));
  }
  fs.mkdirSync(path.join(dist, 'vendor'), { recursive: true });
  fs.copyFileSync(path.join(root, 'node_modules/@pdf-lib/fontkit/dist/fontkit.umd.min.js'), path.join(dist, 'vendor/fontkit.umd.min.js'));

  /* styles */
  const styleDir = path.join(root, 'src/styles');
  const css = fs.readdirSync(styleDir).filter((f) => f.endsWith('.css')).sort()
    .map((f) => `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(styleDir, f), 'utf8'))
    .join('\n');
  fs.writeFileSync(path.join(dist, 'assets/app.css'), css);

  /* client script */
  /* run the local tsc through node itself: no npx, no shell (npx is a .cmd
     on Windows, which would otherwise force shell: true) */
  execFileSync(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'),
    path.join(root, 'src/client/app.ts'),
    '--outDir', path.join(dist, 'assets'),
    '--ignoreConfig', '--target', 'ES2020', '--module', 'ESNext', '--moduleResolution', 'bundler',
    '--lib', 'ES2020,DOM,DOM.Iterable', '--strict', '--removeComments',
  ], { stdio: 'inherit', cwd: root });

  /* pages */
  const { renderAll } = await import('./pages/index.ts');
  const routes = renderAll();
  for (const [route, html] of routes) write(route, html);

  /* sitemap + robots */
  const { site } = await import('./data/site.ts');
  const urls = routes.map(([r]) => r).filter((r) => !r.endsWith('.xml') && !r.endsWith('.txt'));
  write('sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${site.url}${u === '/' ? '/' : u}</loc></url>`).join('\n') +
    `\n</urlset>\n`);
  write('robots.txt', site.prototype.isConceptPrototype
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

  /* static hosts (Vercel, Netlify) serve /404.html for unknown paths */
  const notFound = path.join(dist, '404/index.html');
  if (fs.existsSync(notFound)) fs.copyFileSync(notFound, path.join(dist, '404.html'));

  const count = routes.length;
  const bytes = du(dist);
  console.log(`✓ ${count} routes · ${(bytes / 1024 / 1024).toFixed(1)} MB → dist/`);
}

function du(dir: string): number {
  let total = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    total += e.isDirectory() ? du(p) : fs.statSync(p).size;
  }
  return total;
}

main().catch((e) => { console.error(e); process.exit(1); });
