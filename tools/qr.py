#!/usr/bin/env python3
"""Pre-render QR codes for every unit page. Run: python3 tools/qr.py <ids.txt>
Each line: <slug> <url>.  Output: public/dardania/qr/<slug>.png (1-bit, tiny)."""
import sys, os
from reportlab.graphics.barcode import qrencoder as qe
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'dardania', 'qr')
os.makedirs(OUT, exist_ok=True)

def build(url):
    for version in range(3, 12):
        try:
            q = qe.QRCode(version, qe.QRErrorCorrectLevel.M)
            q.addData(url); q.make()
            return q
        except Exception:
            continue
    raise RuntimeError('qr too long: ' + url)

def render(slug, url, quiet=2, scale=8):
    q = build(url)
    n = q.getModuleCount()
    size = n + quiet * 2
    im = Image.new('1', (size, size), 1)
    for r in range(n):
        for c in range(n):
            if q.isDark(r, c):
                im.putpixel((c + quiet, r + quiet), 0)
    im.resize((size * scale, size * scale), Image.NEAREST).save(os.path.join(OUT, slug + '.png'))

if __name__ == '__main__':
    src = sys.argv[1]
    n = 0
    for line in open(src):
        line = line.strip()
        if not line: continue
        slug, url = line.split(' ', 1)
        render(slug, url); n += 1
    print(f'{n} QR codes → public/dardania/qr/')
