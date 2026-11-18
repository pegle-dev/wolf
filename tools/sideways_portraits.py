"""Wolf: Sideways — assets/portraits/*.png 를 64x64 도트 데이터로 옮겨 sideways/portraits.js 를 만든다.  실행: python3 tools/sideways_portraits.py
sips로 축소 + BMP 변환 → 순수 파이썬으로 읽어 회색 단계/빨강으로 양자화."""
import os, struct, subprocess, json, tempfile
from collections import Counter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, 'assets/portraits')
TMP = tempfile.mkdtemp()
N = 64
NAMES = ['hanbei', 'hanbei_like', 'hanbei_bad', 'wolf', 'wolf_bad', 'wolf_shura_on', 'wolf_shura_end',
         'emma', 'isshin', 'genichiro']
# 회색 단계: 원본 실루엣이 대부분 아주 어두운 쪽에 몰려 있어 어두운 쪽을 촘촘하게
LEVELS = [0x04, 0x0b, 0x13, 0x1b, 0x24, 0x2e, 0x3a, 0x48, 0x58, 0x6a, 0x80, 0x9a, 0xb8, 0xdc]
CHARS = '0123456789abcd'
RED = '#b8262a'


def read_bmp(path):
    b = open(path, 'rb').read()
    off = struct.unpack_from('<I', b, 10)[0]
    w, h = struct.unpack_from('<ii', b, 18)
    bpp = struct.unpack_from('<H', b, 28)[0]
    step = bpp // 8
    row = ((w * bpp + 31) // 32) * 4
    px = []
    for y in range(abs(h)):
        sy = (abs(h) - 1 - y) if h > 0 else y
        base = off + sy * row
        line = []
        for x in range(w):
            bb, gg, rr = b[base + x * step], b[base + x * step + 1], b[base + x * step + 2]
            line.append((rr, gg, bb))
        px.append(line)
    return px


def convert(name):
    bmp = os.path.join(TMP, name + '.bmp')
    subprocess.run(['sips', '-z', str(N), str(N), '-s', 'format', 'bmp', os.path.join(SRC, name + '.png'), '--out', bmp],
                   check=True, capture_output=True)
    px = read_bmp(bmp)
    lum = lambda p: round(0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2])
    border = [lum(px[y][x]) for y in range(N) for x in range(N) if x in (0, N - 1) or y in (0, N - 1)]
    bg = Counter(border).most_common(1)[0][0]
    rows = []
    for y in range(N):
        s = ''
        for x in range(N):
            r, g, b = px[y][x]
            if r > 36 and r - max(g, b) > 20:
                s += 'r'; continue
            L = lum((r, g, b))
            if abs(L - bg) <= 6:
                s += 'z'; continue
            i = min(range(len(LEVELS)), key=lambda k: abs(LEVELS[k] - L))
            s += CHARS[i]
        rows.append(s)
    return {'bg': '#%02x%02x%02x' % (bg, bg, bg), 'rows': rows}


def main():
    out = {n: convert(n) for n in NAMES}
    js = ['/* 대화 초상화 도트 데이터 — tools/sideways_portraits.py 가 만든 파일. 손으로 고치지 말 것.',
          '   assets/portraits/*.png 를 %dx%d 로 줄여 회색 %d단계 + 배경(z) + 빨강(r)으로 옮겨 적은 것.' % (N, N, len(LEVELS)),
          '   그리는 쪽은 art.js 의 sw.art.portrait(). */',
          '(function () {',
          "  'use strict';",
          '  var sw = (setup.sw = setup.sw || {});',
          '  sw.portraitData = {',
          '    size: %d,' % N,
          '    levels: %s,' % json.dumps(['#%02x%02x%02x' % (v, v, v) for v in LEVELS]),
          "    chars: '%s'," % CHARS,
          "    red: '%s'," % RED,
          '    faces: {']
    for i, n in enumerate(NAMES):
        d = out[n]
        js.append("      %s: { bg: '%s', rows: [" % (n, d['bg']))
        js.append(',\n'.join("        '%s'" % r for r in d['rows']))
        js.append('      ] }' + (',' if i < len(NAMES) - 1 else ''))
    js += ['    }', '  };', '})();', '']
    open(os.path.join(REPO, 'sideways/portraits.js'), 'w', encoding='utf-8').write('\n'.join(js))
    for n in NAMES:
        print(n, out[n]['bg'], sum(r.count('r') for r in out[n]['rows']))


main()
