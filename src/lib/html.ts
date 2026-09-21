export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const attr = (o: Record<string, string | number | boolean | null | undefined>): string =>
  Object.entries(o)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(String(v))}"`))
    .join(' ');

export const cls = (...c: (string | false | null | undefined)[]): string =>
  c.filter(Boolean).join(' ');

export const nf = (n: number, d = 2): string =>
  n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

export const int = (n: number): string => n.toLocaleString('de-DE');

export const arrow = '<span class="arw" aria-hidden="true">&#8594;</span>';
