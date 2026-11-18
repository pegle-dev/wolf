/* =========================================================
   Wolf: Sideways — 코드로 그리는 픽셀 아트
   - 배경: 256x144 캔버스. 그라데이션은 평평한 띠로 칠하고, 띠 경계에만 디더링을 넣는다.
   - 스프라이트: 32x44(+외곽선 1px). 숨쉬기 2프레임.
   - 배경과 스프라이트는 같은 배율로 확대한다 (engine.js의 layout).
   - 결과는 dataURL로 캐시.
   ========================================================= */
(function () {
  'use strict';

  var sw = (setup.sw = setup.sw || {});

  /* 회색 10단계. 포인트 컬러는 4일차부터 따로 추가한다. */
  var PAL = ['#070707', '#131313', '#202020', '#303030', '#444444',
             '#5b5b5b', '#757575', '#929292', '#b2b2b2', '#d4d4d4'];
  var TOP = PAL.length - 1;
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  function threshold(x, y) { return (BAYER[y & 3][x & 3] + 0.5) / 16; }

  /* 시드 고정 난수: 매번 같은 그림이 나오게 */
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function Painter(w, h) {
    this.w = w;
    this.h = h;
    this.c = document.createElement('canvas');
    this.c.width = w;
    this.c.height = h;
    this.g = this.c.getContext('2d');
    this.ox = 0;
    this.oy = 0;
    this.band = 2.6;   /* 클수록 평평한 띠가 넓어지고 디더 구간이 좁아진다 */
  }

  Painter.prototype.dot = function (x, y, col) {
    x = Math.round(x) + this.ox;
    y = Math.round(y) + this.oy;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) { return; }
    this.g.fillStyle = col;
    this.g.fillRect(x, y, 1, 1);
  };

  Painter.prototype.rect = function (x, y, w, h, col) {
    this.g.fillStyle = col;
    this.g.fillRect(Math.round(x) + this.ox, Math.round(y) + this.oy, Math.round(w), Math.round(h));
  };

  /* v: 0~9 연속값. 소수부가 0.5 근처일 때만 두 단계를 디더링으로 섞는다. */
  Painter.prototype.tone = function (x, y, v) {
    if (v < 0) { v = 0; }
    if (v > TOP) { v = TOP; }
    var lo = Math.floor(v);
    var hi = Math.min(lo + 1, TOP);
    var f = (v - lo - 0.5) * this.band + 0.5;
    this.dot(x, y, PAL[f > threshold(x + this.ox, y + this.oy) ? hi : lo]);
  };

  Painter.prototype.fill = function (x0, y0, w, h, fn) {
    for (var y = y0; y < y0 + h; y++) {
      for (var x = x0; x < x0 + w; x++) {
        var v = typeof fn === 'number' ? fn : fn(x, y);
        if (v !== null && v !== undefined) { this.tone(x, y, v); }
      }
    }
  };

  Painter.prototype.line = function (x0, y0, x1, y1, col) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = dx + dy;
    for (;;) {
      this.dot(x0, y0, col);
      if (x0 === x1 && y0 === y1) { break; }
      var e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };

  /* 가장자리만 살짝 어둡게 */
  Painter.prototype.vignette = function (k) {
    for (var y = 0; y < this.h; y++) {
      for (var x = 0; x < this.w; x++) {
        var dx = (x / this.w - 0.5) * 2;
        var dy = (y / this.h - 0.5) * 2;
        var v = Math.max(0, Math.sqrt(dx * dx * 0.8 + dy * dy * 0.6) - 0.85) * k;
        if (v > threshold(x, y)) { this.dot(x, y, PAL[0]); }
      }
    }
  };

  /* 투명 픽셀 중 불투명 픽셀과 맞닿은 곳에 외곽선 */
  Painter.prototype.outline = function (col) {
    var w = this.w, h = this.h;
    var d = this.g.getImageData(0, 0, w, h).data;
    var solid = function (x, y) {
      return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
    };
    var pts = [];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) {
          pts.push([x, y]);
        }
      }
    }
    this.g.fillStyle = col;
    for (var i = 0; i < pts.length; i++) { this.g.fillRect(pts[i][0], pts[i][1], 1, 1); }
  };

  Painter.prototype.url = function () { return this.c.toDataURL('image/png'); };

  /* ---------- 배경용 도형 ---------- */

  /* 둥근 덩어리. toneFn(x, y, ny): ny는 위쪽 -1 ~ 아래쪽 1 (위에서 빛이 오는 표현용) */
  function blob(p, cx, cy, r, squash, toneFn) {
    for (var y = Math.floor(cy - r / squash); y <= cy + r / squash; y++) {
      for (var x = Math.floor(cx - r); x <= cx + r; x++) {
        var dx = x - cx, dy = (y - cy) * squash;
        if (dx * dx + dy * dy <= r * r) { p.tone(x, y, toneFn(x, y, dy / r)); }
      }
    }
  }

  /* 능선: topFn(x)부터 bottom까지 칠한다 */
  function ridge(p, topFn, bottom, toneFn) {
    for (var x = 0; x < p.w; x++) {
      var top = Math.round(topFn(x));
      for (var y = top; y < bottom; y++) { p.tone(x, y, toneFn(x, y, top)); }
    }
  }

  /* 기와 지붕: 위가 좁고 아래가 넓으며 처마 끝이 들린다 */
  function roof(p, cx, top, bottom, halfTop, halfBottom, base, stripe) {
    for (var y = top; y <= bottom; y++) {
      var t = (y - top) / Math.max(1, bottom - top);
      var half = halfTop + (halfBottom - halfTop) * t * t;
      for (var x = Math.round(cx - half); x <= Math.round(cx + half); x++) {
        p.tone(x, y, (y - top) % 2 === 0 ? base + stripe : base);
      }
    }
    var tip = Math.round(halfBottom);
    for (var k = 1; k <= 3; k++) {
      p.tone(cx - tip - k, bottom - k, base);
      p.tone(cx + tip + k, bottom - k, base);
    }
  }

  /* 석등 (baseY = 바닥) */
  function lantern(p, x, baseY) {
    p.fill(x - 7, baseY - 22, 15, 3, 1.0);
    p.fill(x - 5, baseY - 25, 11, 3, 1.0);
    p.fill(x - 1, baseY - 27, 3, 2, 1.0);
    p.fill(x - 5, baseY - 19, 11, 7, 1.7);
    p.fill(x - 2, baseY - 17, 5, 3, 6.0);
    p.fill(x - 2, baseY - 12, 5, 7, 2.0);
    p.fill(x - 6, baseY - 5, 13, 5, 2.5);
  }

  /* 풀 한 포기 */
  function tuft(p, x, y, h, col) {
    p.line(x, y, x - 1, y - h, col);
    p.line(x + 1, y, x + 2, y - h + 1, col);
    if (h > 3) { p.line(x + 2, y, x + 4, y - h + 2, col); }
  }

  var W = 256, H = 144;

  /* ---------- 배경: 훈련장 (흐린 낮) ---------- */
  function bgTraining() {
    var p = new Painter(W, H), r = rng(11), i, x, y;
    var GY = 88;

    p.fill(0, 0, W, GY, function (x, y) { return 6.8 - y * 0.017; });

    ridge(p, function (x) { return 58 + Math.sin(x * 0.021 + 0.5) * 6 + Math.sin(x * 0.07) * 2; }, GY,
      function () { return 5.0; });
    ridge(p, function (x) { return 68 + Math.sin(x * 0.033 + 2) * 5 + Math.sin(x * 0.11) * 1.5; }, GY,
      function () { return 4.1; });

    for (i = 0; i < 36; i++) {
      blob(p, i * 7.5 + r() * 6 - 3, 80 + r() * 5, 6 + r() * 6, 1.25, function (x, y, ny) {
        return 2.0 - ny * 0.8 + r() * 0.3;
      });
    }

    /* 땅: 가운데는 밟혀서 밝은 흙, 가장자리는 어둡게 */
    p.fill(0, GY, W, H - GY, function (x, y) {
      var ex = (x - 140) / 96, ey = (y - 106) / 15;
      var worn = ex * ex + ey * ey < 1 ? 0.6 : 0;
      var patch = Math.sin(x * 0.05 + y * 0.11) * 0.2 + Math.sin(x * 0.013 - y * 0.07) * 0.2;
      return 4.6 + (y - GY) * 0.012 + worn + patch;
    });
    p.fill(0, GY, W, 1, 3.0);

    for (i = 0; i < 26; i++) {           /* 발자국 */
      x = 70 + r() * 140;
      y = 96 + r() * 20;
      p.dot(x, y, PAL[4]);
      p.dot(x + 1, y, PAL[4]);
      p.dot(x + 3, y + 1, PAL[4]);
      p.dot(x + 4, y + 1, PAL[4]);
    }
    for (i = 0; i < 70; i++) {           /* 풀 */
      x = r() * W;
      y = GY + 3 + r() * (H - GY - 3);
      var ex2 = (x - 140) / 96, ey2 = (y - 106) / 15;
      if (ex2 * ex2 + ey2 * ey2 < 1.1) { continue; }
      tuft(p, x, y, 2 + Math.floor(r() * 3), PAL[3]);
    }

    /* 왼쪽 사당 */
    var cx = 38;
    p.fill(cx - 14, 47, 29, 2, 0.8);
    roof(p, cx, 49, 64, 12, 33, 1.1, 0.8);
    p.fill(cx - 28, 65, 57, 21, 0.5);
    [cx - 27, cx - 12, cx + 10, cx + 25].forEach(function (px) { p.fill(px, 65, 3, 21, 2.6); });
    /* 금줄과 종이 장식 */
    for (x = cx - 26; x <= cx + 26; x++) {
      var t = (x - (cx - 26)) / 52;
      p.dot(x, 68 + Math.round(Math.sin(t * Math.PI) * 3), PAL[5]);
    }
    [0.25, 0.5, 0.75].forEach(function (t) {
      var sx = Math.round(cx - 26 + t * 52), sy = 68 + Math.round(Math.sin(t * Math.PI) * 3);
      p.dot(sx, sy + 1, PAL[8]); p.dot(sx + 1, sy + 2, PAL[8]); p.dot(sx, sy + 3, PAL[8]); p.dot(sx + 1, sy + 4, PAL[8]);
    });
    p.fill(cx - 32, 86, 65, 2, 3.2);
    p.fill(cx - 32, 88, 65, 1, 2.0);
    p.fill(cx - 8, 89, 17, 4, function (x, y) { return y % 2 ? 3.6 : 2.6; });

    /* 목검 걸이 */
    p.fill(86, 74, 2, 20, 1.0);
    p.fill(110, 74, 2, 20, 1.0);
    p.fill(84, 76, 30, 2, 1.3);
    p.fill(84, 85, 30, 1, 1.3);
    [91, 96, 101, 106].forEach(function (bx, k) {
      p.line(bx, 75, bx + (k % 2), 93, PAL[6]);
    });

    /* 짚 과녁 */
    p.fill(170, 70, 3, 24, 1.2);
    p.fill(167, 72, 9, 11, function (x, y) { return (x + y) % 3 === 0 ? 4.0 : 4.9; });
    p.fill(167, 74, 9, 1, 1.0);
    p.fill(167, 79, 9, 1, 1.0);

    /* 오른쪽 큰 나무와 앞쪽 풀 */
    p.fill(240, 26, 8, 66, function (x) { return x === 242 ? 1.7 : 0.7; });
    p.line(240, 92, 234, 95, PAL[1]);
    p.line(247, 92, 254, 95, PAL[1]);
    blob(p, 238, 20, 24, 1.1, function (x, y, ny) { return 1.0 - ny * 0.6 + r() * 0.5; });
    blob(p, 256, 40, 18, 1.1, function (x, y, ny) { return 0.9 - ny * 0.5 + r() * 0.5; });
    blob(p, 216, 8, 16, 1.2, function (x, y, ny) { return 1.1 - ny * 0.6 + r() * 0.5; });
    for (i = 0; i < 26; i++) {
      tuft(p, r() * 30, H - 1, 6 + Math.floor(r() * 8), PAL[1]);
      tuft(p, W - r() * 30, H - 1, 6 + Math.floor(r() * 8), PAL[1]);
    }

    return p.url();
  }

  /* ---------- 배경: 황폐한 절 ---------- */
  function bgTemple() {
    var p = new Painter(W, H), r = rng(23), i, x;
    var cx = 128;

    p.fill(0, 0, W, 104, function (x, y) { return 6.5 - y * 0.015; });

    /* 삼나무 실루엣 */
    [12, 30, 52, 196, 220, 244].forEach(function (tx, k) {
      var top = 34 + (k % 3) * 8;
      for (var y = top; y < 100; y++) {
        var half = Math.floor((y - top) * 0.22) + 1;
        half -= (y % 6 < 2) ? 1 : 0;
        for (var xx = tx - half; xx <= tx + half; xx++) { p.tone(xx, y, 1.5 + (xx < tx ? 0.4 : 0)); }
      }
    });
    for (i = 0; i < 26; i++) {
      blob(p, r() * W, 86 + r() * 6, 8 + r() * 8, 1.2, function (x, y, ny) { return 2.2 - ny * 0.7 + r() * 0.3; });
    }

    /* 자갈 마당과 돌길 */
    p.fill(0, 100, W, H - 100, function (x, y) { return 5.0 + (y - 100) * 0.01 + r() * 0.5; });
    p.fill(cx - 16, 114, 33, 30, function (x, y) { return (y - 114) % 7 === 0 || (x - cx + 16 + Math.floor((y - 114) / 7) * 5) % 11 === 0 ? 4.4 : 5.9; });

    /* 지붕 */
    p.fill(cx - 30, 25, 61, 3, 0.6);
    p.fill(cx - 34, 20, 5, 7, 0.6);
    p.fill(cx + 30, 20, 5, 7, 0.6);
    roof(p, cx, 28, 55, 30, 82, 1.0, 0.8);
    /* 황폐: 지붕에 뚫린 구멍과 빠진 기와 */
    blob(p, cx + 34, 40, 9, 2.2, function () { return 0.1; });
    for (i = 0; i < 8; i++) { p.fill(cx - 60 + Math.floor(r() * 110), 36 + Math.floor(r() * 16), 3, 1, 0.3); }
    p.fill(cx - 80, 56, 161, 4, 0.25);

    /* 본당 */
    p.fill(cx - 66, 60, 133, 38, 1.6);
    p.fill(cx - 66, 60, 133, 7, function (x, y) { return (x + y) % 3 === 0 ? 3.0 : 1.3; });
    for (x = cx - 66; x <= cx + 64; x += 22) { p.fill(x, 60, 3, 38, 2.9); }
    p.fill(cx - 18, 70, 37, 28, 0.15);
    /* 찢어진 장지문 */
    p.fill(cx - 60, 72, 28, 20, function (x, y) { return x % 4 === 0 || y % 5 === 0 ? 2.2 : 3.8; });
    p.fill(cx - 52, 78, 6, 5, 0.6);
    p.fill(cx + 34, 72, 28, 20, function (x, y) { return x % 4 === 0 || y % 5 === 0 ? 2.2 : 3.8; });
    p.fill(cx + 48, 84, 5, 6, 0.6);

    /* 기단과 계단 */
    p.fill(cx - 74, 98, 149, 5, 3.6);
    p.fill(cx - 74, 102, 149, 1, 2.4);
    p.fill(cx - 20, 103, 41, 11, function (x, y) { return y % 3 === 0 ? 3.0 : 4.6; });

    lantern(p, 42, 124);
    lantern(p, 214, 124);

    for (i = 0; i < 40; i++) { tuft(p, cx - 74 + r() * 149, 104, 2 + Math.floor(r() * 3), PAL[3]); }
    for (i = 0; i < 30; i++) { tuft(p, r() * W, 106 + r() * 38, 2 + Math.floor(r() * 2), PAL[4]); }

    return p.url();
  }

  /* ---------- 배경: 밤의 지붕 ---------- */
  function bgNight() {
    var p = new Painter(W, H), r = rng(37), i, x, y;

    p.fill(0, 0, W, H, function (x, y) { return 0.5 + y * 0.026; });
    for (i = 0; i < 90; i++) { p.dot(r() * W, r() * 70, PAL[4 + Math.floor(r() * 3)]); }
    [[30, 14], [118, 9], [160, 30]].forEach(function (s) {
      p.dot(s[0], s[1], PAL[8]);
      p.dot(s[0] - 1, s[1], PAL[5]); p.dot(s[0] + 1, s[1], PAL[5]);
      p.dot(s[0], s[1] - 1, PAL[5]); p.dot(s[0], s[1] + 1, PAL[5]);
    });

    /* 달, 달무리, 얼룩 */
    var mx = 200, my = 32;
    p.fill(mx - 22, my - 22, 45, 45, function (x, y) {
      var d = Math.sqrt((x - mx) * (x - mx) + (y - my) * (y - my));
      if (d <= 13) { return 8.7 - d * 0.04; }
      if (d <= 22) { return 1.3 + (22 - d) * 0.14; }
      return null;
    });
    blob(p, mx - 4, my - 3, 4, 1, function () { return 7.4; });
    blob(p, mx + 5, my + 4, 3, 1, function () { return 7.6; });
    /* 달을 가로지르는 구름 */
    for (x = 150; x < 250; x++) {
      var cy = 40 + Math.round(Math.sin(x * 0.08) * 1.5);
      p.tone(x, cy, 2.4);
      if (x > 165 && x < 236) { p.tone(x, cy + 1, 1.8); }
    }

    /* 먼 성 */
    var tx = 62;
    p.fill(tx - 20, 72, 41, 24, function (x, y) { return 0.15 + (y - 72) * 0.01; });
    roof(p, tx, 64, 71, 12, 26, 0.1, 0.3);
    p.fill(tx - 14, 54, 29, 10, 0.15);
    roof(p, tx, 47, 53, 8, 20, 0.1, 0.3);
    p.fill(tx - 9, 38, 19, 9, 0.15);
    roof(p, tx, 30, 37, 5, 14, 0.1, 0.3);
    p.fill(tx - 1, 26, 3, 4, 0.1);
    p.fill(tx + 6, 58, 2, 2, 5.6);        /* 불 켜진 창 하나 */

    /* 먼 마을 지붕들 */
    for (x = 0; x < W; x++) {
      var top = 90 + Math.round(-Math.abs(Math.sin(x * 0.07)) * 6 + Math.sin(x * 0.29) * 1.5);
      for (y = top; y < 108; y++) { p.tone(x, y, 0.35); }
    }

    /* 발밑의 기와 지붕 */
    for (x = 0; x < W; x++) {
      var ridgeY = Math.round(104 - x * 0.04);
      p.dot(x, ridgeY - 1, PAL[4]);
      p.dot(x, ridgeY, PAL[3]);
      p.dot(x, ridgeY + 1, PAL[2]);
      for (y = ridgeY + 2; y < H; y++) {
        var row = (y - ridgeY) % 5 === 0;
        var seam = (x + Math.floor((y - ridgeY) / 5) * 3) % 7 === 0;
        p.tone(x, y, row ? 2.2 : seam ? 1.5 : 1.2 - (y - ridgeY) * 0.008);
      }
    }

    p.vignette(1.6);
    return p.url();
  }

  /* ---------- 배경: 꿈/인트로 (어둠) ---------- */
  function bgDark() {
    var p = new Painter(W, H), r = rng(5), i;
    p.fill(0, 0, W, H, function (x, y) {
      var band = Math.max(0, 1 - Math.abs(y - 96) / 34);
      return 0.1 + band * 1.1 + Math.sin(x * 0.04 + y * 0.02) * 0.2;
    });
    for (i = 0; i < 50; i++) { p.dot(r() * W, r() * H, PAL[2 + Math.floor(r() * 2)]); }
    p.vignette(2);
    return p.url();
  }

  /* ---------- 스프라이트 (오른쪽을 보는 기준, 32x44) ----------
     f = 숨쉬기 프레임(0/1): 상체를 1px 내린다. 발 바닥은 y=41. */
  var K = '#0d0d0d', G = '#262626', G2 = '#3a3a3a', L = '#b4b4b4', E = '#dadada', W2 = '#5a5a5a';

  function hanbeiUpper(p, dy) {
    var y = dy;
    /* 투구 장식 */
    p.line(11, y + 0, 13, y + 4, K);
    p.line(20, y + 0, 18, y + 4, K);
    p.rect(15, y + 2, 2, 3, G);
    /* 투구와 목가리개 */
    p.rect(12, y + 4, 8, 1, K);
    p.rect(11, y + 5, 10, 4, K);
    p.rect(9, y + 9, 13, 1, G);
    p.rect(8, y + 10, 8, 3, G);
    /* 얼굴(면갑) */
    p.rect(14, y + 9, 7, 5, K);
    p.rect(15, y + 12, 6, 2, G);
    p.dot(19, y + 10, E);
    /* 목 */
    p.rect(12, y + 14, 8, 2, G);
    /* 몸통 */
    p.rect(11, y + 16, 10, 9, K);
    p.rect(12, y + 18, 8, 1, G2);
    p.rect(12, y + 21, 8, 1, G2);
    /* 뒤쪽 어깨 갑옷과 팔 */
    p.rect(7, y + 15, 5, 8, G);
    p.rect(7, y + 17, 5, 1, K);
    p.rect(7, y + 20, 5, 1, K);
    p.rect(8, y + 23, 3, 4, K);
    /* 앞쪽 어깨 갑옷 */
    p.rect(19, y + 15, 6, 8, G);
    p.rect(19, y + 17, 6, 1, K);
    p.rect(19, y + 20, 6, 1, K);
    /* 허리 */
    p.rect(11, y + 25, 10, 1, G2);
    p.rect(9, y + 26, 14, 6, G);
    [12, 15, 18, 21].forEach(function (gx) { p.rect(gx, y + 26, 1, 6, K); });
  }

  function drawHanbei(p, pose, f) {
    if (pose === 'sit') {
      hanbeiUpper(p, 9 + f);
      p.rect(8, 35, 18, 4, K);
      p.rect(9, 37, 6, 2, G);
      p.rect(19, 37, 6, 2, G);
      p.rect(7, 39, 20, 2, K);
      p.rect(21, 33, 3, 4, K);
      p.line(2, 41, 18, 41, L);
      p.rect(0, 41, 3, 1, G2);
      return;
    }

    if (pose === 'shoulder') {          /* 칼날은 몸 뒤로 지나가게 먼저 그린다 */
      p.line(24, 21 + f, 1, 9 + f, L);
      p.line(24, 22 + f, 1, 10 + f, L);
    }

    /* 다리 */
    p.rect(11, 32, 4, 8, K);
    p.rect(17, 32, 4, 8, K);
    p.rect(11, 35, 4, 3, G);
    p.rect(17, 35, 4, 3, G);
    p.rect(10, 40, 5, 2, K);
    p.rect(17, 40, 6, 2, K);

    hanbeiUpper(p, f);

    if (pose === 'shoulder') {          /* 검을 어깨에 걸침: 앞에는 칼자루와 손 */
      p.rect(23, 20 + f, 3, 4, G2);
      p.rect(21, 22 + f, 3, 3, K);
    } else if (pose === 'draw') {       /* 검을 앞으로 겨눔 */
      p.rect(21, 22 + f, 5, 3, K);
      p.rect(25, 21 + f, 2, 4, G2);
      p.line(27, 21 + f, 31, 12 + f, L);
      p.line(27, 20 + f, 30, 13 + f, L);
    } else if (pose === 'rest') {       /* 검을 바닥에 내려놓음 */
      p.rect(21, 23 + f, 3, 6, K);
      p.line(13, 42, 31, 42, L);
      p.rect(9, 42, 4, 1, G2);
    } else {                            /* 기본: 검을 세워 짚음 */
      p.rect(21, 23 + f, 3, 4, K);
      p.rect(24, 22, 2, 5, G2);
      p.rect(23, 27, 4, 1, G);
      p.line(24, 28, 24, 41, L);
      p.line(25, 28, 25, 41, L);
    }
  }

  function wolfUpper(p, dy, f) {
    var y = dy;
    /* 상투와 뒤로 묶은 머리 */
    p.rect(14, y + 1, 4, 2, K);
    p.dot(15, y + 0, K);
    p.rect(11, y + 3, 2, 3, K);
    p.rect(10, y + 5, 2, 3, K);
    /* 머리 */
    p.rect(13, y + 3, 6, 8, K);
    p.rect(12, y + 4, 1, 5, K);
    p.dot(17, y + 6, E);
    /* 목도리와 끝자락 (바람에 흔들림) */
    p.rect(12, y + 11, 8, 3, G);
    for (var k = 0; k < 3; k++) {
      p.line(12, y + 12 + k, 4 + k, y + 17 + k + f, G);
      p.line(11, y + 12 + k, 3 + k, y + 17 + k + f, G);
    }
    /* 몸통 */
    p.rect(13, y + 14, 7, 11, K);
    p.line(16, y + 14, 18, y + 17, G);
    /* 허리띠 */
    p.rect(13, y + 25, 7, 2, G);
    /* 허리의 칼집 */
    p.line(5, y + 28, 19, y + 24, G2);
  }

  function prosthetic(p, x, y, horizontal) {
    if (horizontal) {
      p.rect(x, y, 6, 3, G2);
      p.dot(x + 2, y + 1, W2);
      p.dot(x + 4, y + 1, W2);
    } else {
      p.rect(x, y, 3, 9, G2);
      p.dot(x + 1, y + 3, W2);
      p.dot(x + 1, y + 6, W2);
      p.rect(x, y + 9, 3, 2, K);
    }
  }

  function drawWolf(p, pose, f) {
    if (pose === 'sit') {
      wolfUpper(p, 9 + f, f);
      prosthetic(p, 16, 26 + f, false);
      p.rect(10, 36, 15, 3, K);
      p.rect(9, 39, 17, 2, K);
      p.rect(24, 39, 3, 2, K);
      return;
    }

    /* 하카마와 다리 */
    p.rect(12, 27, 9, 5, K);
    p.rect(11, 31, 11, 3, K);
    p.rect(13, 34, 3, 6, K);
    p.rect(18, 34, 3, 6, K);
    p.rect(13, 37, 3, 2, G);
    p.rect(18, 37, 3, 2, G);
    p.rect(12, 40, 4, 2, K);
    p.rect(18, 40, 5, 2, K);

    wolfUpper(p, f, f);

    if (pose === 'guard') {             /* 칼을 뽑아 겨눔 */
      p.rect(18, 18 + f, 5, 3, K);
      prosthetic(p, 17, 20 + f, true);
      p.rect(23, 18 + f, 2, 3, G2);
      p.line(25, 18 + f, 31, 9 + f, L);
      p.line(25, 17 + f, 30, 9 + f, L);
    } else {
      p.line(19, 24 + f, 23, 22 + f, K);  /* 칼자루 */
      prosthetic(p, 16, 15 + f, false);
    }
  }

  var SPRITES = { hanbei: drawHanbei, wolf: drawWolf };
  var BGS = {
    training: { draw: bgTraining, ground: 106, particles: 'leaves' },
    temple: { draw: bgTemple, ground: 101, particles: 'dust' },
    night: { draw: bgNight, ground: 101, particles: 'ash' },
    dark: { draw: bgDark, ground: 108, particles: 'ash' }
  };
  var cache = {};

  sw.art = {
    W: W,
    H: H,
    SPRITE_W: 34,
    SPRITE_H: 46,
    SPRITE_FOOT: 43,   /* 스프라이트 이미지에서 발바닥 외곽선이 놓이는 행 */
    PAL: PAL,
    sprite: function (who, pose, frame) {
      var key = 's:' + who + ':' + pose + ':' + (frame || 0);
      if (!cache[key]) {
        var p = new Painter(34, 46);
        p.ox = 1;
        p.oy = 1;
        SPRITES[who](p, pose, frame || 0);
        p.outline('#737373');
        cache[key] = p.url();
      }
      return cache[key];
    },
    bg: function (name) {
      var key = 'b:' + name;
      if (!cache[key]) { cache[key] = (BGS[name] || BGS.dark).draw(); }
      return cache[key];
    },
    ground: function (name) { return (BGS[name] || BGS.dark).ground; },
    particles: function (name) { return (BGS[name] || BGS.dark).particles; }
  };
})();
