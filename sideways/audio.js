/* =========================================================
   Wolf: Sideways — 8비트 소리 (Web Audio로 직접 합성, 음원 파일 없음)
   악기: 펄스파(12.5/25/50%), 삼각파 베이스, 노이즈 타악기 — 패미컴 음원 구성
   배경음은 배경 그림을 따라 자동으로 바뀐다 (engine.js의 setBg/setTint에서 호출).
   음계는 일본 전통 음계: 미야코부시(쓸쓸함)·요(밝음).
   ========================================================= */
(function () {
  'use strict';

  var sw = (setup.sw = setup.sw || {});
  var ctx = null, master = null, musicBus = null, sfxBus = null, noiseBuf = null, pulses = {};
  var muted = false;
  try { muted = localStorage.getItem('sw-mute') === '1'; } catch (e) { /* 저장소 없음 */ }

  var MUSIC_VOL = 0.11, SFX_VOL = 0.22;

  /* ---------- 음 이름 → 주파수 ---------- */
  var SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(note) {
    var m = /^([A-G])([#b]?)(-?\d)$/.exec(note);
    if (!m) { return 0; }
    var midi = 12 * (Number(m[3]) + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /* ---------- 오디오 준비 (첫 클릭/키 입력 뒤에만 소리를 낼 수 있다) ---------- */
  function init() {
    if (ctx) { return true; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { return false; }
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = MUSIC_VOL; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = SFX_VOL; sfxBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0), reg = 1;
    for (var i = 0; i < d.length; i++) {        /* 패미컴식 15비트 LFSR 노이즈 */
      var bit = (reg ^ (reg >> 1)) & 1;
      reg = (reg >> 1) | (bit << 14);
      d[i] = (reg & 1) ? 0.8 : -0.8;
    }
    return true;
  }

  /* 펄스파 듀티비(0.125/0.25/0.5)를 PeriodicWave로 만든다 */
  function pulseWave(duty) {
    if (!pulses[duty]) {
      var n = 32, re = new Float32Array(n), im = new Float32Array(n);
      for (var k = 1; k < n; k++) { im[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty); }
      pulses[duty] = ctx.createPeriodicWave(re, im);
    }
    return pulses[duty];
  }

  /* 음 하나: type = 'p125' | 'p25' | 'p50' | 'tri' */
  function tone(bus, type, f, t, dur, vol, opts) {
    if (!f) { return; }
    opts = opts || {};
    var o = ctx.createOscillator(), g = ctx.createGain();
    if (type === 'tri') { o.type = 'triangle'; } else { o.setPeriodicWave(pulseWave(type === 'p125' ? 0.125 : type === 'p25' ? 0.25 : 0.5)); }
    o.frequency.setValueAtTime(f, t);
    if (opts.slideTo) { o.frequency.exponentialRampToValueAtTime(opts.slideTo, t + dur); }
    if (opts.vibrato) {
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 5.5; lg.gain.value = f * 0.012;
      lfo.connect(lg); lg.connect(o.frequency);
      lfo.start(t + Math.min(0.18, dur / 2)); lfo.stop(t + dur + 0.05);
    }
    var a = 0.004, rel = opts.release || 0.05, sus = opts.decay ? vol * 0.45 : vol;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + a);
    if (opts.decay) { g.gain.exponentialRampToValueAtTime(Math.max(sus, 0.0001), t + a + opts.decay); }
    g.gain.setValueAtTime(sus, t + Math.max(dur - rel, a + 0.001));
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.02);
  }

  /* 노이즈 타악기: k(북) s(작은북) h(방울) */
  function drum(bus, kind, t, vol) {
    if (kind === 'k') {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      g.gain.setValueAtTime(vol * 1.6, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.18);
      return;
    }
    var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), ng = ctx.createGain();
    src.buffer = noiseBuf;
    f.type = kind === 'h' ? 'highpass' : 'bandpass';
    f.frequency.value = kind === 'h' ? 7000 : 1800;
    var len = kind === 'h' ? 0.04 : 0.13;
    ng.gain.setValueAtTime(vol * (kind === 'h' ? 0.35 : 0.8), t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(f); f.connect(ng); ng.connect(bus);
    src.start(t, Math.random() * 0.5); src.stop(t + len + 0.02);
  }

  /* ---------- 배경음 ----------
     한 칸 = 8분음표. "-"는 앞 음을 늘이고, "."은 쉼표, "|"는 마디 구분(무시). */
  var TRACKS = {
    /* 타이틀: 미야코부시 A — 달밤, 혼자 */
    title: { bpm: 64, parts: [
      { inst: 'p25', vol: 0.55, vib: true, notes:
        'A4 - - - E5 - D5 - | F5 - - - E5 - - - | D5 - Bb4 - A4 - - - | . . . . . . . . |' +
        'E5 - - - F5 - A5 - | Bb5 - - - A5 - F5 - | E5 - D5 - E5 - - - | - - - - . . . . ' },
      { inst: 'tri', vol: 0.9, notes:
        'A2 - - - - - - - | Bb2 - - - - - - - | D2 - - - - - - - | A2 - - - - - - - |' +
        'D2 - - - - - - - | Bb1 - - - - - - - | E2 - - - - - - - | A2 - - - - - - - ' } ] },
    /* 낮 훈련장: 요음계 D — 가벼운 검 소리 */
    day: { bpm: 104, parts: [
      { inst: 'p25', vol: 0.5, notes:
        'D5 . E5 G5 A5 - G5 . | B5 - A5 . G5 E5 D5 . | E5 . G5 . A5 - B5 A5 | G5 - E5 . D5 - - . |' +
        'A5 . B5 A5 G5 - E5 . | D5 - E5 . G5 - - . | B4 . D5 . E5 G5 E5 D5 | D5 - - - . . . . ' },
      { inst: 'p125', vol: 0.28, notes:
        'A4 . . . B4 . . . | D5 . . . B4 . . . | G4 . . . A4 . . . | B4 . . . A4 . . . |' +
        'E5 . . . D5 . . . | B4 . . . D5 . . . | G4 . . . A4 . . . | A4 . . . . . . . ' },
      { inst: 'tri', vol: 0.85, notes:
        'D3 . A2 . D3 . A2 . | G2 . D3 . G2 . D3 . | E2 . B2 . E2 . B2 . | A2 . E3 . D3 . . . |' +
        'G2 . D3 . G2 . D3 . | D3 . A2 . D3 . A2 . | E2 . B2 . A2 . E3 . | D3 . A2 . D3 . . . ' },
      { inst: 'drum', vol: 0.5, notes: 'k . h . s . h . | k . h h s . h . | k . h . s . h . | k . h . s h k . ' } ] },
    /* 절 마당 낮: 요음계 G — 느긋하게 */
    calm: { bpm: 80, parts: [
      { inst: 'p25', vol: 0.5, vib: true, notes:
        'B4 - - D5 E5 - D5 - | B4 - A4 - G4 - - - | A4 - B4 - D5 - E5 - | D5 - - - - - . . |' +
        'E5 - - D5 B4 - A4 - | G4 - A4 - B4 - - - | A4 - G4 - E4 - G4 - | G4 - - - - - . . ' },
      { inst: 'tri', vol: 0.85, notes:
        'G2 - - - D3 - - - | E2 - - - B2 - - - | C3 - - - G2 - - - | D3 - - - - - - - |' +
        'C3 - - - G2 - - - | E2 - - - B2 - - - | A2 - - - D3 - - - | G2 - - - - - - - ' },
      { inst: 'drum', vol: 0.3, notes: 'h . . . h . . . | h . . . h . . . | h . . . h . . . | h . . . . . h . ' } ] },
    /* 해질녘·술: 미야코부시 E — 따뜻하고 쓸쓸하게 */
    eve: { bpm: 70, parts: [
      { inst: 'p25', vol: 0.5, vib: true, notes:
        'E5 - - - C5 - B4 - | A4 - - - B4 - C5 - | B4 - A4 - F4 - E4 - | - - - - . . . . |' +
        'A4 - B4 - C5 - E5 - | F5 - - - E5 - C5 - | B4 - C5 - B4 - A4 - | - - - - . . . . ' },
      { inst: 'p125', vol: 0.22, notes:
        'A3 C4 E4 C4 A3 C4 E4 C4 | F3 A3 C4 A3 F3 A3 C4 A3 | D3 F3 A3 F3 D3 F3 A3 F3 | E3 B3 E4 B3 E3 B3 E4 B3 |' +
        'A3 C4 E4 C4 A3 C4 E4 C4 | F3 A3 C4 A3 F3 A3 C4 A3 | D3 F3 A3 F3 E3 B3 E4 B3 | A3 C4 E4 C4 A3 . . . ' },
      { inst: 'tri', vol: 0.8, notes:
        'A2 - - - - - - - | F2 - - - - - - - | D2 - - - - - - - | E2 - - - - - - - |' +
        'A2 - - - - - - - | F2 - - - - - - - | D2 - - - E2 - - - | A2 - - - - - - - ' } ] },
    /* 밤: 드문 음과 낮은 지속음 */
    night: { bpm: 58, parts: [
      { inst: 'p125', vol: 0.45, vib: true, notes:
        'E5 - - - . . . . | . . B4 - - - . . | C5 - - - A4 - - - | . . . . . . . . |' +
        'F5 - - - E5 - . . | . . C5 - B4 - . . | A4 - - - - - - - | . . . . . . . . ' },
      { inst: 'tri', vol: 0.75, notes:
        'E2 - - - - - - - | E2 - - - - - - - | A1 - - - - - - - | B1 - - - - - - - |' +
        'F2 - - - - - - - | E2 - - - - - - - | A1 - - - - - - - | E2 - - - - - - - ' } ] },
    /* 어둠: 거의 지속음뿐 */
    dark: { bpm: 52, parts: [
      { inst: 'p125', vol: 0.35, notes: '. . . . . . . . | . . . . A4 - - - | . . . . . . . . | . . . . Bb4 - - - ' },
      { inst: 'tri', vol: 0.8, notes: 'D2 - - - - - - - | - - - - - - - - | Eb2 - - - - - - - | - - - - - - - - ' } ] },
    /* 수라: 낮게 몰아치는 베이스와 북 */
    shura: { bpm: 132, parts: [
      { inst: 'p50', vol: 0.42, notes:
        'A4 - Bb4 - E5 - - - | F5 - E5 - Bb4 - A4 - | A5 - - - Bb5 - A5 - | E5 - - - - - . . |' +
        'D5 - E5 - F5 - - - | E5 - Bb4 - A4 - - - | Bb4 - A4 - E4 - F4 - | E4 - - - - - . . ' },
      { inst: 'tri', vol: 1, notes:
        'A1 A1 . A1 Bb1 . A1 . | A1 A1 . A1 C2 . Bb1 . | A1 A1 . A1 Bb1 . A1 . | E1 E1 . E1 F1 . E1 . |' +
        'D2 D2 . D2 Eb2 . D2 . | A1 A1 . A1 Bb1 . A1 . | Bb1 Bb1 . Bb1 A1 . Bb1 . | E1 E1 . E1 F1 . E1 . ' },
      { inst: 'drum', vol: 0.7, notes: 'k . . k s . k . | k . k . s . k s | k . . k s . k . | k k . k s s k s ' } ] },
    /* 새벽: 처음으로 색이 번지는 곡 */
    dawn: { bpm: 88, parts: [
      { inst: 'p25', vol: 0.5, vib: true, notes:
        'A4 - D5 - E5 - F#5 - | A5 - - - F#5 - E5 - | D5 - E5 - F#5 - A5 - | B5 - - - A5 - - - |' +
        'F#5 - E5 - D5 - B4 - | A4 - - - B4 - D5 - | E5 - F#5 - E5 - D5 - | D5 - - - - - . . ' },
      { inst: 'p125', vol: 0.22, notes:
        'D4 F#4 A4 F#4 D4 F#4 A4 F#4 | B3 D4 F#4 D4 B3 D4 F#4 D4 | G3 B3 D4 B3 G3 B3 D4 B3 | A3 C#4 E4 C#4 A3 C#4 E4 C#4 |' +
        'D4 F#4 A4 F#4 D4 F#4 A4 F#4 | B3 D4 F#4 D4 B3 D4 F#4 D4 | G3 B3 D4 B3 A3 C#4 E4 C#4 | D4 F#4 A4 F#4 D4 . . . ' },
      { inst: 'tri', vol: 0.85, notes:
        'D3 - A2 - D3 - A2 - | B2 - F#2 - B2 - F#2 - | G2 - D3 - G2 - D3 - | A2 - E3 - A2 - E3 - |' +
        'D3 - A2 - D3 - A2 - | B2 - F#2 - B2 - F#2 - | G2 - D3 - A2 - E3 - | D3 - - - - - - - ' },
      { inst: 'drum', vol: 0.35, notes: 'h . h . h . h . | h . h . h . h h | h . h . h . h . | h . h . h h h . ' } ] }
  };

  /* 문자열 악보 → [{step, note, len}] */
  function parse(str) {
    var tokens = str.replace(/\|/g, ' ').trim().split(/\s+/), evs = [], last = null;
    tokens.forEach(function (tk, i) {
      if (tk === '-') { if (last) { last.len++; } return; }
      if (tk === '.') { last = null; return; }
      last = { step: i, note: tk, len: 1 };
      evs.push(last);
    });
    return { evs: evs, steps: tokens.length };
  }
  Object.keys(TRACKS).forEach(function (k) {
    TRACKS[k].parts.forEach(function (p) { var r = parse(p.notes); p.evs = r.evs; p.steps = r.steps; });
    TRACKS[k].steps = Math.max.apply(null, TRACKS[k].parts.map(function (p) { return p.steps; }));
  });

  var player = { name: null, wanted: null, timer: null, step: 0, next: 0, bus: null };

  function stopMusic(fade) {
    if (player.timer) { clearInterval(player.timer); player.timer = null; }
    if (player.bus) {
      var b = player.bus, t = ctx.currentTime;
      b.gain.setValueAtTime(b.gain.value, t);
      b.gain.linearRampToValueAtTime(0, t + (fade || 0.6));
      setTimeout(function () { b.disconnect(); }, ((fade || 0.6) + 0.2) * 1000);
      player.bus = null;
    }
    player.name = null;
  }

  function startMusic(name) {
    var tr = TRACKS[name];
    if (!tr) { return; }
    stopMusic(0.8);
    player.name = name;
    player.bus = ctx.createGain();
    player.bus.gain.setValueAtTime(0, ctx.currentTime);
    player.bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    player.bus.connect(musicBus);
    var stepDur = 60 / tr.bpm / 2;
    player.step = 0;
    player.next = ctx.currentTime + 0.1;
    var bus = player.bus;
    player.timer = setInterval(function () {
      while (player.next < ctx.currentTime + 0.25) {
        var s = player.step % tr.steps, t = player.next;
        tr.parts.forEach(function (p) {
          p.evs.forEach(function (ev) {
            if (ev.step !== s % p.steps) { return; }
            if (p.inst === 'drum') { drum(bus, ev.note, t, p.vol); return; }
            tone(bus, p.inst, freq(ev.note), t, ev.len * stepDur * 0.95, p.vol * 0.5,
              { vibrato: p.vib && ev.len >= 3, decay: p.inst !== 'tri' ? 0.25 : 0, release: 0.06 });
          });
        });
        player.step++;
        player.next += stepDur;
      }
    }, 40);
  }

  /* ---------- 효과음 ---------- */
  var VOICE = {  /* 대사가 넘어갈 때 말하는 사람마다 다른 짧은 소리 */
    h: { inst: 'p125', notes: ['A5', 'D6', 'E6'], len: 0.05 },
    w: { inst: 'tri', notes: ['D4', 'E4', 'A3'], len: 0.07 },
    e: { inst: 'p25', notes: ['E5', 'G5', 'A5'], len: 0.05 },
    i: { inst: 'tri', notes: ['A3', 'E3', 'G3'], len: 0.08 },
    g: { inst: 'p50', notes: ['C4', 'Eb4', 'G3'], len: 0.06 },
    n: { inst: 'p125', notes: ['A6'], len: 0.018, vol: 0.25 }
  };

  var SFX = {
    voice: function (t, who) {
      var v = VOICE[who] || VOICE.n;
      var n = v.notes[Math.floor(Math.random() * v.notes.length)];
      tone(sfxBus, v.inst, freq(n), t, v.len, v.vol || 0.45);
      if (who !== 'n') { tone(sfxBus, v.inst, freq(n) * 1.5, t + v.len, v.len * 0.8, (v.vol || 0.45) * 0.6); }
    },
    select: function (t) {
      tone(sfxBus, 'p25', freq('E5'), t, 0.05, 0.5);
      tone(sfxBus, 'p25', freq('A5'), t + 0.055, 0.09, 0.5);
    },
    clash: function (t) {  /* 칼이 부딪는 소리: 높은 펄스 + 노이즈 */
      drum(sfxBus, 's', t, 1.2);
      tone(sfxBus, 'p125', 2600, t, 0.12, 0.35, { slideTo: 1900 });
      tone(sfxBus, 'p125', 3400, t + 0.01, 0.2, 0.22, { slideTo: 3000, decay: 0.05 });
    },
    flash: function (t) {
      drum(sfxBus, 'h', t, 1.5);
      tone(sfxBus, 'p50', 1200, t, 0.08, 0.3, { slideTo: 600 });
    },
    arrow: function (t) {
      var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = noiseBuf;
      f.type = 'bandpass';
      f.frequency.setValueAtTime(6000, t);
      f.frequency.exponentialRampToValueAtTime(800, t + 0.35);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      src.connect(f); f.connect(g); g.connect(sfxBus);
      src.start(t); src.stop(t + 0.42);
      drum(sfxBus, 'k', t + 0.38, 0.8);
    },
    chime: function (t) {  /* 날짜 자막 */
      ['A4', 'E5', 'A5'].forEach(function (n, i) { tone(sfxBus, 'p25', freq(n), t + i * 0.12, 0.5, 0.35, { decay: 0.2, release: 0.3 }); });
    },
    note: function (t) {
      tone(sfxBus, 'p125', freq('B5'), t, 0.06, 0.35);
      tone(sfxBus, 'p125', freq('E6'), t + 0.07, 0.12, 0.35);
    },
    memory: function (t) {  /* 인연 기억 획득 */
      ['D5', 'F#5', 'A5', 'D6'].forEach(function (n, i) { tone(sfxBus, 'p25', freq(n), t + i * 0.09, i === 3 ? 0.5 : 0.08, 0.45, { vibrato: i === 3, release: 0.2 }); });
      tone(sfxBus, 'tri', freq('D3'), t, 0.6, 0.6);
    },
    ending: function (t, id) {
      var bright = id === 'true' || id === 'someday';
      var seq = id === 'shura' ? ['A3', 'Bb3', 'E4', 'Bb3', 'A3'] : bright ? ['D5', 'E5', 'F#5', 'A5', 'D6'] : ['E5', 'C5', 'B4', 'A4', 'E4'];
      seq.forEach(function (n, i) {
        tone(sfxBus, id === 'shura' ? 'p50' : 'p25', freq(n), t + i * 0.22, i === seq.length - 1 ? 1.4 : 0.22, 0.42, { vibrato: i === seq.length - 1, release: 0.4 });
      });
      tone(sfxBus, 'tri', freq(seq[seq.length - 1]) / 4, t, 2.4, 0.7, { release: 0.8 });
    }
  };

  /* ---------- 바깥에서 쓰는 함수 ---------- */
  var BG_MUSIC = { training: 'day', trainingDawn: 'dawn', temple: 'calm', templeEve: 'eve', templeNight: 'night', night: 'night', dark: 'dark' };
  var TINT_MUSIC = { shura: 'shura', dawn: 'dawn' };

  sw.audio = {
    tracks: TRACKS,
    /* 곡을 바꾼다. 같은 곡이면 이어서 튼다. 소리가 아직 막혀 있으면 기억해 두었다가 첫 입력 때 튼다 */
    music: function (name) {
      player.wanted = name;
      if (!ctx || ctx.state !== 'running') { return; }
      if (player.name === name) { return; }
      if (!name) { stopMusic(1.2); return; }
      startMusic(name);
    },
    musicForBg: function (bg) { if (BG_MUSIC[bg]) { sw.audio.music(BG_MUSIC[bg]); } },
    musicForTint: function (tint) { if (TINT_MUSIC[tint]) { sw.audio.music(TINT_MUSIC[tint]); } },
    sfx: function (name, arg) {
      if (!ctx || ctx.state !== 'running' || muted || !SFX[name]) { return; }
      SFX[name](ctx.currentTime + 0.01, arg);
    },
    unlock: function () {
      if (!init()) { return; }
      var go = function () { if (player.wanted && player.name !== player.wanted) { startMusic(player.wanted); } };
      if (ctx.state !== 'running') { ctx.resume().then(go); } else { go(); }
    },
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = !!m;
      try { localStorage.setItem('sw-mute', muted ? '1' : '0'); } catch (e) { /* 저장소 없음 */ }
      if (master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
      }
    }
  };

  ['pointerdown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, sw.audio.unlock, true);
  });
})();
