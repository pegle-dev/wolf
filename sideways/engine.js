/* =========================================================
   Wolf: Sideways — 장면 진행 엔진
   한 장면 = 한 passage. 안의 대사는 클릭/스페이스로 한 줄씩 넘긴다.

   대사      <<n>>나레이션<</n>>  <<h>>한베<</h>>  <<w>>늑대<</w>>
   안내      <<note>>거리가 조금 줄었다.<</note>>
   자막      <<caption "1일째" "낮">>
   선택지    <<choices>>[[라벨|Passage]]<</choices>>
   연출(즉시 실행, 클릭 없이 다음으로)
             <<bg "training">>                 training | temple | night | dark
             <<stage "hanbei" 76 "shoulder" "l">>  x(%) 또는 "dist", 자세, 방향(l/r)
             <<stage "wolf" "hide">>
             <<fx "shake">>                     shake | flash | arrow(화살이 화면을 가로지름)
             <<tint "dawn">>                    none | warm | dawn | shura | dim (화면 색 번짐)
             <<stage "all" "hide">>             모두 퇴장. 등장인물: hanbei wolf emma isshin genichiro
             <<bgm "eve">>                      배경음 직접 지정 (보통은 bg/tint를 따라 자동, audio.js)
   초상화    <<h "bad">>                        대사 옆 얼굴 변형 지정 (보통은 상태를 따라 자동, portraits.js)
   결말      <<ending "true">>                  결말 카드 + 기록 (id는 sw.endingDefs)
             <<memory "just">>                  인연 기억 카드 획득
   ========================================================= */
(function () {
  'use strict';

  var sw = (setup.sw = setup.sw || {});

  sw.names = { h: '한베', w: '늑대', e: '에마', i: '잇신', g: '겐이치로' };
  sw.distX = [24, 40, 54, 60, 64];   /* 거리 단계별 늑대 위치 (한베는 76) */

  sw.memoryDefs = [
    { id: 'just', title: '그냥 온 날', text: '늑대는 검을 뽑지 않고 한베를 찾아갔다.' },
    { id: 'spar', title: '첫 대련', text: '익숙한 소리, 익숙한 자세, 익숙한 거리.' },
    { id: 'hurt', title: '아프냐고 물은 날', text: '한베가 먼저 검을 멈추고 물었다. 아프냐고.' },
    { id: 'sit', title: '대련하지 않은 날', text: '검을 뽑지 않고 나란히 앉았다. 바람 소리만 들렸다.' },
    { id: 'sake', title: '잔을 나눈 날', text: '취하는 법을 잊었다는 사람과 술잔 사이에 앉았다.' },
    { id: 'mask', title: '얼굴을 본 날', text: '자네의 얼굴이 보고 싶다고, 늑대가 먼저 말했다.' },
    { id: 'envy', title: '끝을 부러워한 날', text: '죽지 않는 무사가, 끝이라는 것이 부럽다고 했다.' },
    { id: 'away', title: '돌아가라던 날', text: '밀어낸 만큼의 거리를, 검이 아니라 무릎으로 좁혔다.' }
  ];

  /* 결말: 등급은 docs/Wolf_Sideways_Hanbei.md §4 */
  sw.endingDefs = [
    { id: 'true', grade: 'True End', title: '새벽의 대련' },
    { id: 'empty', grade: 'End', title: '빈자리' },
    { id: 'someday', grade: 'End', title: '언젠가의 끝' },
    { id: 'distant', grade: 'End', title: '멀어지는 날들' },
    { id: 'hilt', grade: 'Bad End', title: '잘 맞는 칼자루' },
    { id: 'shura', grade: 'Shura End', title: '베어낸다' }
  ];

  sw.seenEndings = function () {
    try { return recall('swEndings', []) || []; } catch (e) { return []; }
  };
  sw.recordEnding = function (id) {
    try {
      var seen = sw.seenEndings().slice();
      if (seen.indexOf(id) === -1) { seen.push(id); memorize('swEndings', seen); }
    } catch (e) { /* 저장소를 못 쓰는 환경 */ }
  };

  /* ---------- SugarCube 설정 ---------- */
  Config.history.controls = false;
  try { UIBar.destroy(); } catch (e) { /* 이미 없음 */ }

  /* ---------- 무대 DOM ---------- */
  var stage = document.createElement('div');
  stage.id = 'sw-stage';
  stage.innerHTML =
    '<img id="sw-bg" alt="">' +
    '<canvas id="sw-particles"></canvas>' +
    '<div id="sw-tint"></div>' +
    '<div id="sw-fx"></div>';
  document.body.insertBefore(stage, document.body.firstChild);

  var memBtn = document.createElement('button');
  memBtn.id = 'sw-mem-btn';
  memBtn.type = 'button';
  document.body.appendChild(memBtn);

  /* 소리 켜기/끄기 (M 키로도) */
  var sndBtn = document.createElement('button');
  sndBtn.id = 'sw-snd-btn';
  sndBtn.type = 'button';
  function updateSndBtn() {
    var off = sw.audio && sw.audio.isMuted();
    sndBtn.textContent = off ? '♪ 소리 끔' : '♪ 소리 켬';
    sndBtn.classList.toggle('sw-off', !!off);
  }
  sndBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (sw.audio) { sw.audio.setMuted(!sw.audio.isMuted()); }
    updateSndBtn();
  });
  document.body.appendChild(sndBtn);
  updateSndBtn();

  var memPanel = document.createElement('div');
  memPanel.id = 'sw-mem';
  memPanel.hidden = true;
  document.body.appendChild(memPanel);

  var toast = document.createElement('div');
  toast.id = 'sw-toast';
  document.body.appendChild(toast);

  /* 등장인물은 처음 무대에 오를 때 만든다 (hanbei, wolf, emma, isshin, genichiro) */
  var spriteState = {};
  function actor(who) {
    if (!spriteState[who]) {
      spriteState[who] = { x: 50, pose: who === 'wolf' || who === 'hanbei' ? 'stand' : 'stand', facing: 'r', hidden: true };
      var el = document.createElement('img');
      el.id = 'sw-sprite-' + who;
      el.className = 'sw-sprite';
      el.alt = '';
      el.hidden = true;
      stage.insertBefore(el, document.getElementById('sw-tint'));
      sw.layout();
    }
    return spriteState[who];
  }
  var currentBg = 'dark';
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idleFrame = 0;

  /* ---------- 배치: 배경과 스프라이트를 같은 픽셀 배율로 ---------- */
  var view = { s: 1, left: 0, top: 0, ss: 1 };

  sw.layout = function () {
    var A = sw.art, vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.max(vw / A.W, vh / A.H);
    view.s = s;
    view.left = (vw - A.W * s) / 2;
    view.top = (vh - A.H * s) / 2;
    view.ss = Math.min(s, vw / 84);       /* 좁은 화면에서는 캐릭터만 조금 줄인다 */

    ['sw-bg', 'sw-particles'].forEach(function (id) {
      var el = document.getElementById(id);
      el.style.width = A.W * s + 'px';
      el.style.height = A.H * s + 'px';
      el.style.left = view.left + 'px';
      el.style.top = view.top + 'px';
    });

    var feet = view.top + A.ground(currentBg) * s;
    Object.keys(spriteState).forEach(function (who) {
      var el = document.getElementById('sw-sprite-' + who);
      el.style.width = A.SPRITE_W * view.ss + 'px';
      el.style.height = A.SPRITE_H * view.ss + 'px';
      el.style.top = feet - A.SPRITE_FOOT * view.ss + 'px';
    });
    document.documentElement.style.setProperty('--sw-ground', Math.max(0, window.innerHeight - feet) + 'px');
  };

  function renderSprite(who) {
    var s = spriteState[who];
    var el = document.getElementById('sw-sprite-' + who);
    el.hidden = s.hidden;
    if (s.hidden) { return; }
    var frame = reducedMotion ? 0 : (idleFrame + (who === 'wolf' ? 1 : 0)) % 2;
    el.src = sw.art.sprite(who, s.pose, frame, !!State.variables.color);
    el.style.left = s.x + '%';
    el.classList.toggle('sw-face-left', s.facing === 'l');
  }

  sw.setBg = function (name) {
    if (name === currentBg && document.getElementById('sw-bg').getAttribute('src')) { return; }
    currentBg = name;
    var bg = document.getElementById('sw-bg');
    bg.src = sw.art.bg(name);
    bg.classList.remove('sw-fade-in');
    void bg.offsetWidth;
    bg.classList.add('sw-fade-in');
    sw.layout();
    particles.reset(sw.art.particles(name));
  };

  /* ---------- 움직임: 숨쉬기와 날리는 입자 ---------- */
  if (!reducedMotion) {
    setInterval(function () {
      idleFrame = (idleFrame + 1) % 2;
      Object.keys(spriteState).forEach(renderSprite);
    }, 700);
  }

  var particles = (function () {
    var cvs = stage.querySelector('#sw-particles');
    var A = sw.art;
    cvs.width = A.W;
    cvs.height = A.H;
    var g = cvs.getContext('2d');
    var kind = null, list = [], arrow = null, last = 0;

    function spawn(p, fresh) {
      if (kind === 'leaves') {
        p.x = fresh ? Math.random() * A.W : -4;
        p.y = Math.random() * A.H * 0.7;
        p.vx = 0.6 + Math.random() * 0.7;
        p.vy = 0.25 + Math.random() * 0.3;
      } else if (kind === 'dust') {
        p.x = Math.random() * A.W;
        p.y = 40 + Math.random() * (A.H - 60);
        p.vx = (Math.random() - 0.5) * 0.2;
        p.vy = -0.05 - Math.random() * 0.1;
      } else {
        p.x = Math.random() * A.W;
        p.y = fresh ? Math.random() * A.H : -2;
        p.vx = 0.1 + Math.random() * 0.15;
        p.vy = 0.2 + Math.random() * 0.25;
      }
      p.ph = Math.random() * 6.28;
      p.c = Math.random() < 0.5 ? 0 : 1;
    }

    function step(t) {
      requestAnimationFrame(step);
      if (t - last < 80) { return; }   /* 약 12fps: 픽셀 게임 느낌 */
      last = t;
      g.clearRect(0, 0, A.W, A.H);
      list.forEach(function (p) {
        p.ph += 0.25;
        p.x += p.vx + (kind === 'leaves' ? Math.sin(p.ph) * 0.4 : 0);
        p.y += p.vy + (kind === 'leaves' ? Math.cos(p.ph * 0.7) * 0.2 : 0);
        if (p.x > A.W + 4 || p.y > A.H + 4 || p.y < -4) { spawn(p, false); }
        var x = Math.round(p.x), y = Math.round(p.y);
        if (kind === 'leaves') {
          g.fillStyle = p.c ? A.PAL[2] : A.PAL[6];
          g.fillRect(x, y, 2, 1);
          if (Math.sin(p.ph) > 0) { g.fillRect(x + 1, y + 1, 1, 1); }
        } else if (kind === 'dust') {
          if (Math.sin(p.ph) > -0.3) { g.fillStyle = A.PAL[8]; g.fillRect(x, y, 1, 1); }
        } else {
          g.fillStyle = p.c ? A.PAL[4] : A.PAL[5];
          g.fillRect(x, y, 1, 1);
        }
      });
      if (arrow) {
        arrow.x -= 26;
        var ax = Math.round(arrow.x);
        g.fillStyle = A.PAL[6];
        g.fillRect(ax + 3, arrow.y, 18, 1);
        g.fillStyle = A.PAL[9];
        g.fillRect(ax, arrow.y, 4, 1);
        g.fillRect(ax + 1, arrow.y - 1, 1, 3);
        if (arrow.x < -30) { arrow = null; }
      }
    }

    if (!reducedMotion) { requestAnimationFrame(step); }

    return {
      reset: function (k) {
        kind = k;
        arrow = null;
        g.clearRect(0, 0, A.W, A.H);
        var n = k === 'leaves' ? 9 : k === 'dust' ? 16 : 24;
        list = [];
        for (var i = 0; i < n; i++) { var p = {}; spawn(p, true); list.push(p); }
      },
      arrow: function () {
        arrow = { x: A.W + 10, y: Math.round(A.ground(currentBg) - 33) };
      }
    };
  })();

  window.addEventListener('resize', sw.layout);

  sw.setSprite = function (who, x, pose, facing) {
    if (who === 'all') {
      Object.keys(spriteState).forEach(function (k) { spriteState[k].hidden = true; renderSprite(k); });
      return;
    }
    var s = actor(who);
    if (x === 'hide') { s.hidden = true; renderSprite(who); return; }
    s.hidden = false;
    if (x === 'dist') { x = sw.distX[Math.min(State.variables.hanbeiDist || 0, sw.distX.length - 1)]; }
    if (typeof x === 'number') { s.x = x; }
    if (pose) { s.pose = pose; }
    if (facing) { s.facing = facing; }
    renderSprite(who);
  };

  /* 화면 전체 색 번짐: none | warm(따뜻한 빛) | dawn(새벽, 색이 번진다) | shura(붉음) | dim */
  sw.setTint = function (name) {
    var el = document.getElementById('sw-tint');
    el.className = name && name !== 'none' ? 'sw-tint-' + name : '';
  };

  sw.fx = function (kind) {
    if (kind === 'arrow') { particles.arrow(); kind = 'flash'; }
    var target = kind === 'shake' ? stage : document.getElementById('sw-fx');
    var cls = 'sw-' + kind;
    target.classList.remove(cls);
    void target.offsetWidth;
    target.classList.add(cls);
  };

  /* ---------- 인연 기억 ---------- */
  function memDef(id) {
    for (var i = 0; i < sw.memoryDefs.length; i++) {
      if (sw.memoryDefs[i].id === id) { return sw.memoryDefs[i]; }
    }
    return { id: id, title: id };
  }

  sw.updateMemBtn = function () {
    var got = (State.variables.memories || []).length;
    memBtn.textContent = '인연 기억 ' + got + '/' + sw.memoryDefs.length;
  };

  sw.showToast = function (id) {
    var def = memDef(id);
    toast.innerHTML = '<div class="sw-toast-label">인연 기억</div><div class="sw-toast-title">「' +
      def.title + '」</div>';
    toast.classList.remove('sw-show');
    void toast.offsetWidth;
    toast.classList.add('sw-show');
    sw.updateMemBtn();
  };

  sw.openMemories = function () {
    var got = State.variables.memories || [];
    var html = '<div class="sw-mem-inner"><div class="sw-mem-head">인연 기억 · 한베</div><ul>';
    sw.memoryDefs.forEach(function (def) {
      var has = got.indexOf(def.id) !== -1;
      html += '<li class="' + (has ? 'sw-has' : 'sw-locked') + '"><div class="sw-mem-title">' +
        (has ? '「' + def.title + '」' : '???') + '</div>' +
        (has && def.text ? '<div class="sw-mem-text">' + def.text + '</div>' : '') + '</li>';
    });
    var seen = sw.seenEndings();
    html += '</ul><div class="sw-mem-head sw-mem-head-2">결말 ' + seen.length + '/' + sw.endingDefs.length + '</div><ul>';
    sw.endingDefs.forEach(function (def) {
      var has = seen.indexOf(def.id) !== -1;
      html += '<li class="' + (has ? 'sw-has' : 'sw-locked') + '"><div class="sw-mem-title">' +
        (has ? '[' + def.grade + '] ' + def.title : '???') + '</div></li>';
    });
    html += '</ul><button type="button" class="sw-mem-close">닫는다</button></div>';
    memPanel.innerHTML = html;
    memPanel.hidden = false;
  };

  sw.closeMemories = function () { memPanel.hidden = true; };

  memBtn.addEventListener('click', function (e) { e.stopPropagation(); sw.openMemories(); });
  memPanel.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target === memPanel || e.target.classList.contains('sw-mem-close')) { sw.closeMemories(); }
  });

  /* ---------- 장면 진행 ---------- */
  var seq = { items: [], idx: -1, current: null, done: true, root: null };

  /* audio.js가 없거나 막혀 있어도 진행은 멈추지 않게 */
  function sound(fn, arg, arg2) {
    try { if (sw.audio) { sw.audio[fn](arg, arg2); } } catch (e) { /* 소리 실패는 무시 */ }
  }

  /* 대사 한 줄이 나올 때의 소리 */
  function beatSound(it) {
    if (it.classList.contains('sw-ending')) { sound('sfx', 'ending', it.getAttribute('data-ending')); return; }
    if (it.classList.contains('sw-caption')) { sound('sfx', 'chime'); return; }
    if (it.classList.contains('sw-note')) { sound('sfx', 'note'); return; }
    sound('sfx', 'voice', it.getAttribute('data-who') || 'n');
  }

  function applyCue(el) {
    var args = JSON.parse(el.getAttribute('data-args') || '[]');
    switch (el.getAttribute('data-cue')) {
      case 'bg': sw.setBg(args[0]); sound('musicForBg', args[0]); break;
      case 'stage': sw.setSprite(args[0], args[1], args[2], args[3]); break;
      case 'fx': sw.fx(args[0]); sound('sfx', args[0] === 'shake' ? 'clash' : args[0]); break;
      case 'tint': sw.setTint(args[0]); sound('musicForTint', args[0]); break;
      case 'bgm': sound('music', args[0]); break;
      case 'memory': sw.showToast(args[0]); sound('sfx', 'memory'); break;
    }
  }

  sw.next = function () {
    if (seq.done || !memPanel.hidden) { return; }
    while (++seq.idx < seq.items.length) {
      var it = seq.items[seq.idx];
      if (it.classList.contains('sw-cue')) { applyCue(it); continue; }

      if (it.classList.contains('sw-choices')) {
        if (seq.current) { seq.current.classList.remove('sw-waiting'); }
        it.classList.remove('sw-hidden');
        seq.root.classList.remove('sw-mode-caption');
        seq.done = true;
        var first = it.querySelector('a, button');
        if (first) { first.focus({ preventScroll: true }); }
        return;
      }

      if (seq.current) { seq.current.classList.add('sw-hidden'); seq.current.classList.remove('sw-waiting'); }
      it.classList.remove('sw-hidden');
      it.classList.add('sw-waiting');
      seq.current = it;
      seq.root.classList.toggle('sw-mode-caption', it.classList.contains('sw-caption'));
      beatSound(it);
      return;
    }
    seq.done = true;
    if (seq.current) { seq.current.classList.remove('sw-waiting'); }
  };

  function startScene() {
    var root = document.getElementById('passages');
    var items = Array.prototype.slice.call(root.querySelectorAll('.sw-item')).filter(function (el) {
      return !el.parentElement.closest('.sw-item');
    });
    items.forEach(function (el) { if (!el.classList.contains('sw-cue')) { el.classList.add('sw-hidden'); } });
    seq = { items: items, idx: -1, current: null, done: items.length === 0, root: root };
    root.classList.remove('sw-mode-caption');
    root.classList.toggle('sw-has-items', items.some(function (el) { return !el.classList.contains('sw-cue'); }));
    sw.updateMemBtn();
    sw.next();
  }

  $(document).on(':passagestart', function (ev) {
    document.body.setAttribute('data-tags', ev.passage.tags.join(' '));
    if (ev.passage.tags.indexOf('title') !== -1) { sound('music', 'title'); }
    updateSndBtn();
  });
  $(document).on(':passagedisplay', startScene);

  document.addEventListener('click', function (e) {
    if (e.target.closest('.sw-choices a, .sw-title-menu a')) { sound('sfx', 'select'); }
    if (e.target.closest('a, button, #sw-mem, .sw-choices')) { return; }
    sw.next();
  });

  document.addEventListener('keydown', function (e) {
    if (!memPanel.hidden) {
      if (e.key === 'Escape') { sw.closeMemories(); }
      return;
    }
    if ((e.key === 'm' || e.key === 'M') && sw.audio) {
      sw.audio.setMuted(!sw.audio.isMuted());
      updateSndBtn();
      return;
    }
    var active = document.activeElement;
    var onLink = active && active.closest && active.closest('a, button');
    if ((e.key === ' ' || e.key === 'Enter') && !(onLink && seq.done)) {
      e.preventDefault();
      sw.next();
      return;
    }
    if (/^[1-9]$/.test(e.key) && seq.done) {
      var links = document.querySelectorAll('#passages .sw-choices:not(.sw-hidden) a');
      var link = links[Number(e.key) - 1];
      if (link) { e.preventDefault(); link.click(); }
    }
  });

  /* ---------- 대화 초상화 ----------
     <<h>> 처럼 쓰면 상태에 맞는 얼굴을 고른다. <<h "bad">> 처럼 변형을 직접 고를 수도 있다("plain"은 기본 얼굴). */
  var FACES = { h: 'hanbei', w: 'wolf', e: 'emma', i: 'isshin', g: 'genichiro' };
  sw.portraitFor = function (who, variant) {
    var base = FACES[who];
    if (!base) { return null; }
    if (variant) { return variant === 'plain' ? base : base + '_' + variant; }
    var v = State.variables;
    if (who === 'h') {
      if (v.shura >= 3) { return 'hanbei_bad'; }
      if (v.hanbeiDist >= 3) { return 'hanbei_like'; }
    }
    if (who === 'w') {
      if (v.shura >= 3) { return 'wolf_shura_on'; }
      if (v.shura >= 2) { return 'wolf_bad'; }
    }
    return base;
  };

  /* ---------- 매크로 ---------- */
  function addBeat(name, who, cls) {
    Macro.add(name, {
      tags: null,
      handler: function () {
        var el = document.createElement('div');
        el.className = 'sw-item sw-beat sw-' + who + (cls ? ' ' + cls : '');
        el.setAttribute('data-who', who);
        var face = !cls && sw.portraitFor(who, this.args[0]);
        var src = face && sw.art.portrait(face);
        if (src) {
          var img = document.createElement('img');
          img.className = 'sw-portrait';
          img.alt = '';
          img.src = src;
          el.appendChild(img);
          el.classList.add('sw-has-portrait');
        }
        if (sw.names[who]) {
          var plate = document.createElement('div');
          plate.className = 'sw-name';
          plate.textContent = sw.names[who];
          el.appendChild(plate);
        }
        var body = document.createElement('div');
        body.className = 'sw-text';
        $(body).wiki(this.payload[0].contents.trim());
        el.appendChild(body);
        this.output.appendChild(el);
      }
    });
  }

  addBeat('n', 'n');
  addBeat('h', 'h');
  addBeat('w', 'w');
  addBeat('e', 'e');
  addBeat('i', 'i');
  addBeat('g', 'g');
  addBeat('note', 'n', 'sw-note');

  Macro.add('caption', {
    handler: function () {
      var el = document.createElement('div');
      el.className = 'sw-item sw-beat sw-caption';
      el.innerHTML = '<div class="sw-caption-main"></div><div class="sw-caption-sub"></div>';
      el.firstChild.textContent = this.args[0] || '';
      el.lastChild.textContent = this.args[1] || '';
      this.output.appendChild(el);
    }
  });

  /* <<ending "true">>: 결말 카드. 렌더 시점에 기록한다 */
  Macro.add('ending', {
    handler: function () {
      var id = this.args[0], def = null;
      sw.endingDefs.forEach(function (d) { if (d.id === id) { def = d; } });
      if (!def) { return this.error('unknown ending: ' + id); }
      sw.recordEnding(id);
      State.variables.lastEnding = id;
      var el = document.createElement('div');
      el.className = 'sw-item sw-beat sw-caption sw-ending sw-ending-' + id;
      el.setAttribute('data-ending', id);
      el.innerHTML = '<div class="sw-caption-sub"></div><div class="sw-caption-main"></div><div class="sw-ending-note">기록장에 새로운 결말이 남았다.</div>';
      el.children[0].textContent = def.grade;
      el.children[1].textContent = def.title;
      this.output.appendChild(el);
    }
  });

  Macro.add('choices', {
    tags: null,
    handler: function () {
      var el = document.createElement('div');
      el.className = 'sw-item sw-choices';
      $(el).wiki(this.payload[0].contents.trim());
      /* 선택지가 3개 이상이면 두 줄로 놓아 캐릭터를 가리지 않게 */
      if (el.querySelectorAll('a').length >= 3) { el.classList.add('sw-grid'); }
      this.output.appendChild(el);
    }
  });

  function addCue(name, onRender) {
    Macro.add(name, {
      handler: function () {
        var el = document.createElement('div');
        el.className = 'sw-item sw-cue';
        el.setAttribute('data-cue', name);
        el.setAttribute('data-args', JSON.stringify(this.args.slice()));
        this.output.appendChild(el);
        if (onRender) { onRender.call(this); }
      }
    });
  }

  addCue('bg');
  addCue('stage');
  addCue('fx');
  addCue('tint');
  addCue('bgm');   /* <<bgm "eve">>: 배경과 다른 곡을 직접 고를 때 */
  addCue('memory', function () {
    var list = State.variables.memories;
    if (list.indexOf(this.args[0]) === -1) { list.push(this.args[0]); }
  });
})();
