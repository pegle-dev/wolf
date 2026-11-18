/* =========================================================
   Wolf: Sideways — 캐릭터 도트 데이터 (32x44, 오른쪽을 보는 기준)
   한 줄 = "시작열:픽셀들". '.'는 투명, '_'는 지우기.
   빛은 왼쪽 위에서. 발바닥은 43행.

   디자인 메모
   - 한베: 텐구풍 차림. 토킨(작은 검은 모자), 코가 긴 반가면, 가슴의 방울 장식(본텐),
           낡은 갑옷의 어깨·허리 미늘. 원작에서 확인한 것은 "텐구풍 가면과 갑옷"까지이고
           토킨·본텐은 텐구/야마부시 차림에서 가져온 해석이다.
   - 늑대: 헝클어진 상투, 해진 목도리(원작은 주황 — 4일차부터 색이 돌아온다), 겉옷,
           왼팔 의수(관절), 왼허리의 쿠사비마루, 밝은 각반.
   ========================================================= */
(function () {
  'use strict';

  var sw = (setup.sw = setup.sw || {});

  var GREY = {
    k: '#080808', d: '#181818', m: '#272727', g: '#3a3a3a', l: '#555555',
    L: '#7c7c7c', w: '#a9a9a9', W: '#dddddd', f: '#8b8b8b', F: '#646464',
    S: '#8e8e8e', s: '#5f5f5f', o: '#e08a3c', O: '#f6c27a', r: '#9e2b25'
  };
  var COLOR = { S: '#c8692e', s: '#86401f' };   /* 색이 돌아온 뒤의 목도리 */

  /* ---------- 한베 ---------- */
  var H_UPPER = [
    '',
    '14:kk',
    '13:kmmk',
    '12:kmggmk',
    '12:kkmmkk',
    '10:kdddddddk',
    '9:kdddddddddddk',
    '9:kddddddffffk',
    '9:kddddddfkffk',
    '9:kdddddkLLLLwwwwk',
    '9:kdddddkLLLLLLLLk',
    '9:kdddddkLgLgLk',
    '10:kddddkLLLLk',
    '10:kkkkkkkkkk',
    '11:kmmmmmmk',
    '5:kkkkkkkkkkkkkkkk',
    '4:kgggggkgggggggkdWWk',
    '4:kmmmmmkmmmmmmmkWwwWk',
    '4:kkkkkkkkkkkkkkkWwwWk',
    '4:kgggggkgggggggkdWWk',
    '4:kmmmmmkmmmmmmmkWwwWk',
    '5:kkkkkkkkkkkkkkWwwWk',
    '9:kddddddddkdWWk',
    '9:kddddddddkWwwWk',
    '9:kddddddddkkWWkk',
    '9:kggggggggggggk',
    '8:kmmmkmmmkmmmkmmmk',
    '8:kgmmkgmmkgmmkgmmk',
    '7:kmmmmkmmmmkmmmmkmmmk',
    '7:kgmmmkgmmmkgmmmkgmmk',
    '7:kmmmmkmmmmkmmmmkmmmk',
    '7:kkkkkkkkkkkkkkkkkkkk'
  ];
  var H_LEGS = [
    '9:kddddk..kddddk',
    '9:kddddk..kddddk',
    '9:kmgmmk..kmgmmk',
    '9:kddddk..kddddk',
    '10:kddk....kddk',
    '10:kLLk....kLLk',
    '10:kggk....kggk',
    '10:kggk....kggk',
    '10:kggk....kggk',
    '9:kkddkk..kkddkk',
    '9:kddddddk.kddddddk',
    '9:kkkkkkkk.kkkkkkkk'
  ];
  var H_LAP = [
    '6:kddddddddddddddddddk',
    '5:kdgmmmmmmmmmmmmmmgmdk',
    '5:kdddddddddddddddddddddk',
    '5:kmmmmmmmmmmmmmmmmmmmmmk',
    '5:kddddddddddddddddddddddkk',
    '5:kkkkkkkkkkkkkkkkkkkkkkkkk'
  ];
  var H_ARM_HANG = ['kmmmk', 'kdddk', 'kdddk', '.kddk', '.kddk', '.kmmmk', '..kkk'];
  var H_ARM_KNEE = ['kmmmk', '.kdddk', '..kdddk', '...kdddk', '....kmmmk', '.....kkk'];
  var H_ARM_CARRY = [
    '........kmmk',
    '.......kddk',
    '......kddk',
    '.kmmmkddk',
    '.kdddddk',
    '..kkkkk'
  ];
  var H_ARM_DRAW = ['kmmmk', 'kddddkkk', '.kddddddmk', '..kkkkkkk'];
  var H_ARM_CUP = [
    '.......koOk',
    '......kmmk',
    '.....kddk',
    '.kmmkddk',
    '.kdddddk',
    '..kkkkk'
  ];
  var H_FACE = [                 /* 가면을 벗은 얼굴 (9~12행 위에 덮는다) */
    '15:kffffk____',
    '15:kffffFk___',
    '15:kfFFfk',
    '15:kffffk'
  ];
  var H_MASK_HELD = ['kLLLLwwk', 'kLgLgLk', '.kkkkk'];

  /* ---------- 늑대 ---------- */
  var W_UPPER = [
    '14:k',
    '12:kkdk.k',
    '11:kddddkdk',
    '10:kddddddk',
    '8:kkdddddddddk',
    '7:kdddddddddffk',
    '6:kddddddddddfffk',
    '6:kdddddddddffkfk',
    '7:kddddddddfffffk',
    '8:kddddddkfffFk',
    '9:kddddkkFFFk',
    '7:kSSSSSSSSSSSSk',
    '4:kSSSsSSSSSSSSSSSk',
    '2:kSSsk.kgSSSSSSSgk',
    '1:kSsk..kggsSSSsggk',
    '0:kSk...kgggssgggggk',
    '0:kk....kgmmmmmmmggk',
    '8:kgmmmmmmmmgk',
    '8:kgmmmmmmmmgk',
    '8:kgmmmmmmmmgk',
    '8:kggmmmmmmggk',
    '8:kllllllllllk',
    '8:kgmmmmmmmmmgk',
    '7:kgmmmmmmmmmmgk',
    '7:kgmmmmmmmmmmgk',
    '6:kgmmmmmmmmmmmmgk',
    '6:kgmgmmmgmmmgmmgk',
    '6:kk.kkk.kkk.kk.kk'
  ];
  var W_LEGS = [                 /* 27행부터 */
    '9:kddddk.kddddk',
    '9:kddddk.kddddk',
    '9:kddddk.kddddk',
    '9:kddddk.kddddk',
    '9:kddddk.kddddk',
    '9:kddddk.kddddk',
    '10:kddk...kddk',
    '10:kLLk...kLLk',
    '10:kLlk...kLlk',
    '10:kLLk...kLLk',
    '10:kLlk...kLlk',
    '10:kLLk...kLLk',
    '10:kLlk...kLlk',
    '10:kLLk...kLLk',
    '9:kkddkk.kkddkk',
    '9:kddddddkddddddk',
    '9:kkkkkkkkkkkkkkk'
  ];
  var W_LAP = [
    '6:kddddddddddddddddk',
    '5:kdgddddddddddddgdk',
    '5:kLLdddddddddddLLddk',
    '5:kddddddddddddddddddkk',
    '5:kdddddddddddddddddddkk',
    '5:kkkkkkkkkkkkkkkkkkkkkk'
  ];
  var W_ARM_HANG = ['kLLk', 'kLlk', 'klLk', 'kmmk', 'kmgk', 'kLLk', 'kllk', 'kmmk', 'klllk', 'kLkLk', '.k.k'];
  var W_ARM_GUARD = ['kLLk', 'kLlk', '.klLk', '..kmmkk', '...kmmLLk', '....kkLLLkk', '.......kkk'];
  var W_ARM_CUP = ['kLLk', 'kLlk', 'klLk', 'kmmk', 'kmgkk', '.kLLLk', '..kllkkoOk', '...kmmmkk'];
  var W_ARM_REACH = ['kLLk', 'kLlkkkkkkkkk', 'klLLLlLLLlLLk', '.kkkkkkkkkkkWk'];

  /* ---------- 조연 ---------- */
  var EMMA = [
    '', '', '', '',
    '13:kkk',
    '12:kdddk',
    '11:kkdddkk',
    '10:kddddddk',
    '9:kdddddddk',
    '9:kddddffffk',
    '9:kdddfffkfk',
    '9:kdddffffk',
    '10:kddfffk',
    '10:kkffkk',
    '9:kLLLwLLLk',
    '8:kLLLLwLLLLk',
    '8:kLLLLLwLLLk',
    '8:kLLLLLLLLLk',
    '8:kLlLLLLLlLk',
    '8:kmmmmmmmmmk',
    '8:kmgmmmmmmmk',
    '8:kLLLLLLLLLk',
    '8:kLLLLLLLLLk',
    '8:kLLLLLLLLLk',
    '8:kLlLLLLLLLk',
    '8:kLLLLLLLLLk',
    '8:kLLLLLLLLLLk',
    '8:kLLLLLLLLLLk',
    '7:kLlLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLLlLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLlLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLlLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kLLLLLLLLLLLk',
    '7:kkkkkkkkkkkkk',
    '8:kddk..kdddk',
    '8:kkkk..kkkkk'
  ];
  var EMMA_ARM = ['kLLLk', 'kLLLLk', 'kLLLLLk', '.kLLLLLk', '..kkfkgk', '....kggk', '....kkkk'];

  var ISSHIN = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '12:kwwk',
    '11:kwWWwk',
    '10:kwwwwwwk',
    '9:kwwwwwwffk',
    '9:kwwwwfkffk',
    '9:kwwwwffffk',
    '10:kwwwWWWk',
    '10:kkwWWWkk',
    '7:kmmmmLLLmmmk',
    '6:kmmmmmmLmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kmgmmmmmmmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kmmmmmmmmmmmmmk',
    '6:kgggggggggggggk',
    '5:kmmmmmmmmmmmmmmmk',
    '5:kmmmmmmmmmmmmmmmk',
    '5:kmmmmmmmmmmmmmmmk',
    '5:kmmmmmmmmmmmmmmmk',
    '5:kddddddddddddddddddk',
    '4:kdgddddddddddddddgddk',
    '4:kddddddddddddddddddddk',
    '4:kddddddddddddddddddddk',
    '4:kddddddddddddddddddddk',
    '4:kkkkkkkkkkkkkkkkkkkkkk'
  ];
  var ISSHIN_GOURD = ['.kk', 'kLLk', 'kwLk', '.kk', 'kLLLk', 'kLwLLk', 'kLLLLk', 'kLLLLk', '.kkkk'];
  var ISSHIN_ARM = ['kmmmk', '.kmmmk', '..kmmmk', '...kffk', '....kk'];

  var GEN_HEAD = [
    '',
    '13:kkk',
    '12:kdddk',
    '11:kdddddk',
    '10:kdddddddk',
    '9:kdddddddddk',
    '8:kddddddddffk',
    '7:kdddddddddfkk',
    '6:kddddddddddffk',
    '6:kdddddddddfffk',
    '5:kddddddddkFfk',
    '5:kdddddddkkkk',
    '5:kdddddddk',
    '6:kdddddk'
  ];

  /* ---------- 그리기 ---------- */
  function stamp(p, rows, ox, oy, pal) {
    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      if (!row) { continue; }
      var off = 0, m = /^(\d+):(.*)$/.exec(row);
      if (m) { off = Number(m[1]); row = m[2]; }
      for (var i = 0; i < row.length; i++) {
        var ch = row.charAt(i);
        if (ch === '.') { continue; }
        var x = ox + off + i, yy = oy + y;
        if (ch === '_') {
          p.g.clearRect(x + p.ox, yy + p.oy, 1, 1);
        } else {
          p.dot(x, yy, pal[ch] || '#ff00ff');
        }
      }
    }
  }

  function line(p, x0, y0, x1, y1, col) { p.line(x0, y0, x1, y1, col); }

  /* 겐이치로 상체: 한베의 갑옷 몸통에서 방울 장식을 빼고 긴 머리를 얹는다 */
  var GEN_UPPER = GEN_HEAD.concat(H_UPPER.slice(14).map(function (row) {
    var m = /^(\d+):(.*)$/.exec(row);
    if (!m) { return row; }
    var off = Number(m[1]), s = m[2].replace(/[Ww]/g, 'd');
    var cut = Math.max(0, 19 - off);
    if (off + s.length > 20 && /W|w/.test(m[2])) { s = s.slice(0, cut) + 'k'; }
    return off + ':' + s;
  }));

  var POSES = {
    hanbei: function (p, pose, f, pal) {
      var sit = /^sit|^unmask/.test(pose);
      var dy = (sit ? 10 : 0) + f;
      if (pose === 'shoulder') {          /* 칼날은 몸 뒤로 */
        line(p, 21, 18 + f, 1, 6 + f, pal.W);
        line(p, 21, 19 + f, 1, 7 + f, pal.w);
      }
      if (pose === 'rest') { line(p, 2, 43, 30, 43, pal.W); stamp(p, ['kgggk'], 0, 43, pal); }
      if (sit) { line(p, 0, 43, 4, 43, pal.W); }
      if (!sit) { stamp(p, H_LEGS, 0, 32, pal); }
      stamp(p, H_UPPER, 0, dy, pal);
      if (sit) { stamp(p, H_LAP, 0, 38, pal); }

      if (pose === 'shoulder') {
        stamp(p, H_ARM_CARRY, 12, 19 + f, pal);
        stamp(p, ['kgk', 'klk', 'kgk'], 21, 17 + f, pal);
      } else if (pose === 'draw') {
        stamp(p, H_ARM_DRAW, 12, 21 + f, pal);
        line(p, 22, 22 + f, 24, 21 + f, pal.g);
        line(p, 25, 20 + f, 31, 13 + f, pal.W);
        line(p, 25, 21 + f, 31, 14 + f, pal.w);
      } else if (pose === 'stand') {
        stamp(p, H_ARM_KNEE, 13, 22 + f, pal);
        stamp(p, ['kgk', 'klk', 'klk', 'kgk', 'kLk'], 21, 24, pal);
        stamp(p, ['kwwwk'], 20, 29, pal);
        line(p, 22, 30, 22, 42, pal.W);
        line(p, 23, 30, 23, 42, pal.w);
      } else if (pose === 'sitcup') {
        stamp(p, H_ARM_CUP, 12, 20 + dy, pal);
      } else if (pose === 'unmask') {
        stamp(p, H_FACE, 0, 9 + dy, pal);
        stamp(p, H_ARM_KNEE, 13, 22 + dy - 4, pal);
        stamp(p, H_MASK_HELD, 19, 35, pal);
      } else if (sit) {
        stamp(p, H_ARM_KNEE, 13, 22 + dy - 4, pal);
      } else {
        stamp(p, H_ARM_HANG, 12, 22 + f, pal);
      }
    },

    wolf: function (p, pose, f, pal) {
      var sit = /^sit|^reach/.test(pose);
      var dy = (sit ? 10 : 0) + f;
      if (sit) {
        line(p, 1, 43, 14, 43, pal.m);
      } else {
        stamp(p, W_LEGS, 0, 27, pal);
      }
      stamp(p, W_UPPER, 0, dy, pal);
      /* 목도리 끝자락이 숨쉬기와 엇갈려 흔들린다 */
      if (f) { stamp(p, ['kSk', 'kk'], 0, 16 + dy - f, pal); }
      if (sit) { stamp(p, W_LAP, 0, 38, pal); }
      /* 왼허리의 쿠사비마루 */
      line(p, 3, 22 + dy, 15, 19 + dy, pal.m);
      line(p, 3, 23 + dy, 15, 20 + dy, pal.g);
      if (pose !== 'guard') {
        stamp(p, ['w'], 15, 19 + dy, pal);
        line(p, 16, 19 + dy, 20, 17 + dy, pal.L);
        line(p, 16, 18 + dy, 19, 17 + dy, pal.l);
      }

      if (pose === 'guard') {
        stamp(p, W_ARM_GUARD, 11, 13 + dy, pal);
        line(p, 22, 17 + dy, 31, 8 + dy, pal.W);
        line(p, 22, 18 + dy, 31, 9 + dy, pal.w);
      } else if (pose === 'sitcup') {
        stamp(p, W_ARM_CUP, 11, 13 + dy, pal);
      } else if (pose === 'reach') {
        stamp(p, W_ARM_REACH, 11, 13 + dy, pal);
      } else {
        stamp(p, W_ARM_HANG, 11, 13 + dy, pal);
      }
    },

    emma: function (p, pose, f, pal) {
      stamp(p, EMMA, 0, 0, pal);
      stamp(p, EMMA_ARM, 11, 15 + f, pal);
    },

    isshin: function (p, pose, f, pal) {
      stamp(p, ISSHIN, 0, f, pal);
      stamp(p, ISSHIN_GOURD, 20, 22 + f, pal);
      stamp(p, ISSHIN_ARM, 15, 23 + f, pal);
    },

    genichiro: function (p, pose, f, pal) {
      /* 등 뒤의 큰 활 */
      line(p, 25, 1, 29, 12, pal.m);
      line(p, 29, 12, 30, 22, pal.m);
      line(p, 30, 22, 29, 32, pal.m);
      line(p, 29, 32, 25, 42, pal.m);
      line(p, 25, 1, 25, 42, pal.L);
      stamp(p, H_LEGS, 0, 32, pal);
      stamp(p, GEN_UPPER, 0, f, pal);
      stamp(p, H_ARM_KNEE, 13, 22 + f, pal);
    }
  };

  sw.spriteData = {
    draw: function (p, who, pose, frame, colorOn) {
      var pal = {};
      for (var k in GREY) { pal[k] = GREY[k]; }
      if (colorOn) { for (var c in COLOR) { pal[c] = COLOR[c]; } }
      (POSES[who] || POSES.wolf)(p, pose, frame || 0, pal);
    },
    rows: { H_UPPER: H_UPPER, H_LEGS: H_LEGS, W_UPPER: W_UPPER, W_LEGS: W_LEGS }
  };
})();
