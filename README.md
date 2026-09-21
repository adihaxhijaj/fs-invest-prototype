# FS INVEST — Dardania Complex
### Interactive property-developer website — concept prototype

> **Speculative concept prototype.** Not an official FS Invest production
> website. Contains verified FS content alongside clearly marked demo data.

## Run it

`dist/` is build output and is not committed. Build it first:

```bash
npm install
npm run build            # renders all 375 routes → dist/
node tools/serve.mjs dist 4173
# → http://127.0.0.1:4173
```

`npm run dev` builds and serves in one step. Type check with `npm run typecheck`.

## The demo path

```
/                              cinematic hero → location sequence → masterplan
/dardania/                     project, verified figures, interactive complex
/dardania/blloku/b/            block B in context + facade floor selector
/dardania/blloku/b/kati/7/     generated floor plate, tap a unit
/dardania/banesa/b07-03/       apartment page → PDF sheet → enquiry
/dardania/hapesira-afariste/   commercial frontage selector
/dardania/hapesira-afariste/l-b02/
/kompania/  /kontakt/
```

## Tooling

```
tools/serve.mjs     zero-dependency static server
tools/qr.py         regenerates the per-unit QR codes in public/dardania/qr/
                    (needs Python with reportlab + Pillow)
```
