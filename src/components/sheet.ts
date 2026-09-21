import { site } from '../data/site.ts';
import { esc } from '../lib/html.ts';

/** Context-aware enquiry sheet. One per page; every CTA feeds it a payload. */
export function enquirySheet(): string {
  return `<div class="sheet" data-sheet role="dialog" aria-modal="true" aria-labelledby="sheet-title">
  <button class="sheet__scrim" type="button" data-sheet-close aria-label="Mbyll"></button>
  <div class="sheet__panel">
    <div class="sheet__grip" aria-hidden="true"></div>
    <div class="sheet__head">
      <h2 class="display h3" id="sheet-title">Kërko ofertë</h2>
      <button class="sheet__x" type="button" data-sheet-close aria-label="Mbyll">&#215;</button>
    </div>
    <dl class="sheet__ctx" data-sheet-context></dl>
    <form novalidate>
      <input type="hidden" name="context" value="">
      <label class="fld"><span class="label">Emri *</span><input name="name" required autocomplete="name" placeholder="Emri dhe mbiemri"></label>
      <label class="fld"><span class="label">Telefoni *</span><input name="phone" type="tel" required autocomplete="tel" placeholder="+383 ..."></label>
      <label class="fld"><span class="label">Email</span><input name="email" type="email" autocomplete="email" placeholder="opsionale"></label>
      <label class="fld"><span class="label">Mesazhi</span><textarea name="message" rows="3" placeholder="opsionale"></textarea></label>
      <button class="btn btn--block" type="submit">Dërgo kërkesën</button>
      <p class="sheet__note">Duke dërguar, pranoni që FS Invest t'ju kontaktojë për këtë njësi.</p>
    </form>
    <div class="sheet__ok" data-sheet-state hidden tabindex="-1">
      <p class="display h3">Faleminderit.</p>
      <p class="muted">Kërkesa juaj u regjistrua me të gjitha të dhënat e njësisë. Ekipi i shitjes ju kontakton së shpejti.</p>
      <p class="muted" style="font-size:var(--t-sm)">Ose na telefononi drejtpërdrejt: <a href="tel:${esc(site.contact.phoneHref)}" style="text-decoration:underline;text-underline-offset:.25em">${esc(site.contact.phone)}</a></p>
      <button class="btn btn--ghost btn--block" type="button" data-sheet-close>Mbyll</button>
    </div>
  </div>
</div>`;
}

export interface CtaContext { [k: string]: string }

export const enquireButton = (ctx: CtaContext, label = 'Kërko ofertë', variant = ''): string =>
  `<button class="btn ${variant}" type="button" data-enquire data-context='${esc(JSON.stringify(ctx))}'>${esc(label)}</button>`;

/** WhatsApp deep link. FS has not published a WhatsApp line, so the href is
    resolved on the client and falls back to SMS rather than inventing a number. */
export const whatsappLink = (message: string, label = 'Shkruaj në WhatsApp'): string =>
  `<a class="btn btn--ghost" data-wa="${esc(message)}"${site.whatsapp.number ? ` data-wa-number="${esc(site.whatsapp.number)}"` : ''} href="tel:${esc(site.contact.phoneHref)}">${esc(label)}</a>`;
