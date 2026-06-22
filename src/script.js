/* Wolf UI macros: JS로 직접 정의해서 widget/_contents 꼬임을 피한다. */
(function () {
  'use strict';

  function wikiInto(element, source) {
    jQuery(element).wiki(source || '');
  }

  function makeEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (text !== undefined && text !== null && text !== '') {
      el.textContent = String(text);
    }
    return el;
  }

  setup.i18n = setup.i18n || {
    ko: {
      continue: '계속.',
      journal: '기록장',
      journalButton: '기록장',
      journalSubtitle: '남겨진 결말과 흔적을 살핀다.',
      endings: '엔딩',
      dreams: '꿈',
      bonds: '인연',
      traces: '흔적',
      close: '닫는다',
      daySuffix: '일째',
      day: '낮',
      evening: '저녁',
      night: '밤',
      recordNewEnding: '기록장에 새로운 결말이 남았다.',
      recordNewTrace: '기록장에 새로운 흔적이 남았다.',
      recordNewDream: '기록장에 새로운 꿈이 남았다.',
      recordNewBond: '기록장에 새로운 인연이 남았다.',
      recordSomethingRemains: '기록장에 무언가가 남아 있다.',
      dangerNotice: '늑대는 위험한 예감을 느낀다…',
      isolationNotice: '늑대는 고독을 느낀다…',
      shuraNotice: '늑대의 손이 먼저 검을 찾는다…',
      bondNotice: '누군가의 목소리가 늑대를 붙잡는다…',
      lockedEnding: '아직 남지 않은 결말이다.',
      lockedDream: '아직 남지 않은 꿈이다.',
      lockedBond: '아직 남지 않은 기억이다.',
      lockedTrace: '아직 남지 않은 흔적이다.'
    },
    ja: {
      continue: '続ける',
      journal: '記録帳',
      journalButton: '記録帳',
      journalSubtitle: '残された結末と痕跡をたどる。',
      endings: '結末',
      dreams: '夢',
      bonds: '縁',
      traces: '痕跡',
      close: '閉じる',
      daySuffix: '日目',
      day: '昼',
      evening: '夕',
      night: '夜',
      recordNewEnding: '記録帳に新しい結末が残った。',
      recordNewTrace: '記録帳に新しい痕跡が残った。',
      recordNewDream: '記録帳に新しい夢が残った。',
      recordNewBond: '記録帳に新しい縁が残った。',
      recordSomethingRemains: '記録帳に何かが残っている。',
      dangerNotice: '狼は危うい気配を感じる…',
      isolationNotice: '狼は孤独を感じる…',
      shuraNotice: '狼の手が先に刀を探す…',
      bondNotice: '誰かの声が狼をつなぎ止める…',
      lockedEnding: 'まだ残されていない結末だ。',
      lockedDream: 'まだ残されていない夢だ。',
      lockedBond: 'まだ残されていない記憶だ。',
      lockedTrace: 'まだ残されていない痕跡だ。'
    },
    en: {
      continue: 'Continue',
      journal: 'Journal',
      journalButton: 'Journal',
      journalSubtitle: 'Review the endings and traces left behind.',
      endings: 'Endings',
      dreams: 'Dreams',
      bonds: 'Bonds',
      traces: 'Traces',
      close: 'Close',
      daySuffix: 'day',
      day: 'Day',
      evening: 'Evening',
      night: 'Night',
      recordNewEnding: 'A new ending has been recorded.',
      recordNewTrace: 'A new trace has been recorded.',
      recordNewDream: 'A new dream has been recorded.',
      recordNewBond: 'A new bond has been recorded.',
      recordSomethingRemains: 'Something remains in the journal.',
      dangerNotice: 'Wolf senses danger…',
      isolationNotice: 'Wolf feels solitude…',
      shuraNotice: "Wolf's hand reaches for the blade first…",
      bondNotice: "Someone's voice holds Wolf back…",
      lockedEnding: 'An ending not yet recorded.',
      lockedDream: 'A dream not yet remembered.',
      lockedBond: 'A memory not yet formed.',
      lockedTrace: 'A trace not yet left behind.'
    },
    zhHans: {
      continue: '继续',
      journal: '记录簿',
      journalButton: '记录簿',
      journalSubtitle: '查看留下的结局与痕迹。',
      endings: '结局',
      dreams: '梦',
      bonds: '缘',
      traces: '痕迹',
      close: '关闭',
      daySuffix: '日',
      day: '白昼',
      evening: '傍晚',
      night: '夜晚',
      recordNewEnding: '记录簿中留下了新的结局。',
      recordNewTrace: '记录簿中留下了新的痕迹。',
      recordNewDream: '记录簿中留下了新的梦。',
      recordNewBond: '记录簿中留下了新的缘。',
      recordSomethingRemains: '记录簿中似乎留下了什么。',
      dangerNotice: '狼感到危险的预兆…',
      isolationNotice: '狼感到孤独…',
      shuraNotice: '狼的手先一步寻找刀柄…',
      bondNotice: '某人的声音拉住了狼…',
      lockedEnding: '尚未留下的结局。',
      lockedDream: '尚未留下的梦。',
      lockedBond: '尚未留下的记忆。',
      lockedTrace: '尚未留下的痕迹。'
    },
    zhHant: {
      continue: '繼續',
      journal: '記錄簿',
      journalButton: '記錄簿',
      journalSubtitle: '查看留下的結局與痕跡。',
      endings: '結局',
      dreams: '夢',
      bonds: '緣',
      traces: '痕跡',
      close: '關閉',
      daySuffix: '日',
      day: '白晝',
      evening: '傍晚',
      night: '夜晚',
      recordNewEnding: '記錄簿中留下了新的結局。',
      recordNewTrace: '記錄簿中留下了新的痕跡。',
      recordNewDream: '記錄簿中留下了新的夢。',
      recordNewBond: '記錄簿中留下了新的緣。',
      recordSomethingRemains: '記錄簿中似乎留下了什麼。',
      dangerNotice: '狼感到危險的預兆…',
      isolationNotice: '狼感到孤獨…',
      shuraNotice: '狼的手先一步尋找刀柄…',
      bondNotice: '某人的聲音拉住了狼…',
      lockedEnding: '尚未留下的結局。',
      lockedDream: '尚未留下的夢。',
      lockedBond: '尚未留下的記憶。',
      lockedTrace: '尚未留下的痕跡。'
    }
  };

  setup.t = function (key) {
    var variables = State.variables || {};
    var lang = variables.language || 'ko';
    var table = setup.i18n[lang] || setup.i18n.ko || {};
    var fallback = setup.i18n.ko || {};

    return table[key] || fallback[key] || key;
  };

  setup.getDayLabel = function () {
    var variables = State.variables || {};
    var day = Number(variables.day);
    var displayDay = isFinite(day) && day > 0 ? day : 1;
    var time = String(variables.timeOfDay || 'day');
    var timeKey = time === 'night' || time === '밤' ? 'night' : (time === 'evening' || time === '저녁' ? 'evening' : 'day');
    var lang = variables.language || 'ko';

    if (lang === 'en') {
      return setup.t(timeKey) + ' ' + displayDay;
    }

    return displayDay + setup.t('daySuffix') + ' / ' + setup.t(timeKey);
  };

  function getSceneBgClass(passageName) {
    var name = String(passageName || '');

    if (/^Intro/.test(name)) {
      return 'bg-black';
    }
    if (/^Dream/.test(name)) {
      return 'bg-black';
    }
    if (isNightInterludePassage(name)) {
      return 'bg-night';
    }
    if (/^Temple_AfterNight$/.test(name)) {
      return 'bg-dawn';
    }
    if (/^Hidden_Rebirth_FinalField/.test(name)) {
      return 'bg-true';
    }
    if (/^Hidden_Rebirth_Temple/.test(name)) {
      return 'bg-black';
    }
    if (/^(Ending_|BadEnd_|Hidden_Rebirth_Voices|Ending_Hidden_Rebirth)/.test(name) || name === 'Hanbei_End_QuietDay') {
      return 'bg-black';
    }
    if (/^Hanbei/.test(name)) {
      return 'bg-training';
    }
    if (/^NightPatrol01_/.test(name)) {
      return 'bg-nightpatrol-01';
    }
    if (/^NightPatrol02_/.test(name)) {
      return 'bg-nightpatrol-02';
    }
    if (/^NightPatrol03_/.test(name)) {
      return 'bg-nightpatrol-03';
    }
    if (/^NightPatrol04_/.test(name)) {
      return 'bg-nightpatrol-04';
    }
    if (/^NightPatrol05_/.test(name)) {
      return 'bg-nightpatrol-05';
    }
    if (/^NightPatrol/.test(name)) {
      return 'bg-nightpatrol';
    }
    if (/^Kuro/.test(name)) {
      return 'bg-room';
    }
    if (/^(Genichiro_01_Gate|Genichiro_Arrow)/.test(name)) {
      return 'bg-ashina-gate';
    }
    if (/^Genichiro/.test(name)) {
      return 'bg-ashina';
    }

    return 'bg-temple';
  }

  function getSceneLocationName(passageName, bgClass) {
    var name = String(passageName || '');

    if (/^Intro/.test(name)) {
      return '';
    }
    if (/^Hidden_Rebirth_Temple/.test(name)) {
      return '';
    }
    if (/^(TrueEnd_Sculptor|TrueEnding_Sculptor|EndingTrue_Sculptor)/.test(name)) {
      return '';
    }
    if (/^(Ending_|BadEnd_|Hidden_Rebirth_Voices|Ending_Hidden_Rebirth|Dream)/.test(name) || name === 'Hanbei_End_QuietDay') {
      return '';
    }

    switch (bgClass) {
      case 'bg-training':
        return '낡은 훈련장';
      case 'bg-nightpatrol':
      case 'bg-nightpatrol-01':
        return '무너진 골목';
      case 'bg-nightpatrol-02':
        return '빈집 골목';
      case 'bg-nightpatrol-03':
        return '성 밑 뒷골목';
      case 'bg-nightpatrol-04':
        return '밤숲';
      case 'bg-nightpatrol-05':
        return '성 아래 거리';
      case 'bg-night':
        return '밤의 길';
      case 'bg-room':
        return '낡은 서고';
      case 'bg-ashina-gate':
        return '아시나 성문';
      case 'bg-ashina':
        return '천수각 망루';
      case 'bg-temple':
        return '황폐한 절';
      default:
        return '';
    }
  }

  function getTimeOfDayLabel(timeOfDay) {
    switch (String(timeOfDay || 'day')) {
      case 'night':
        return '밤';
      case 'evening':
        return '저녁';
      case 'day':
      default:
        return '낮';
    }
  }

  function shouldShowDayDisplay(passageName) {
    var name = String(passageName || '');

    return !(/^(Intro|Ending_|BadEnd_|Hidden_Rebirth|Debug_)/.test(name) || name === 'Hanbei_End_QuietDay');
  }

  function isRecordBookHiddenPassage(passageName) {
    var name = String(passageName || '');

    return (
      /^Intro_Dream/.test(name) ||
      name === 'Intro_Wake' ||
      /^Intro/.test(name) ||
      /^BadEnd_/.test(name) ||
      /^Ending_/.test(name) ||
      name === 'Hanbei_End_QuietDay' ||
      /^Hidden_Rebirth/.test(name) ||
      /^Debug/.test(name) ||
      name === 'Start' ||
      name.indexOf('RecordBook') !== -1
    );
  }

  setup.isRecordBookHiddenPassage = function () {
    return isRecordBookHiddenPassage(State.passage || '');
  };

  setup.ensureRecordBookVariables = function () {
    var variables = State.variables || {};
    var defaults = {
      recordBookOpen: false,
      recordBookTab: 'endings',
      recordBookUnlocked: false,
      recordBookFirstOpened: false,
      recordBookNewEnding: false,
      recordBookNewTrace: false,
      recordBookNewDream: false,
      recordBookNewBond: false,
      language: 'ko',
      dreamNoSwordSeen: false,
      dreamCordSeen: false,
      dreamNoNameSeen: false,
      dreamNoSwordUnlocked: false,
      dreamCordUnlocked: false,
      dreamNoNameUnlocked: false,
      returnEventPending: false,
      hanbeiJustVisitedSeen: false,
      hanbeiSakeSeen: false,
      endingHanbeiQuietDaySeen: false,
      genichiroArrowEventSeen: false,
      badEndGenichiroArrowSeen: false,
      traceNightArrowSeen: false,
      traceNightCordSeen: false,
      traceNightHandMovesSeen: false,
      traceNightWrongNameSeen: false,
      traceNightBloodScentSeen: false,
      traceFirstDream: false
    };

    Object.keys(defaults).forEach(function (key) {
      if (typeof variables[key] === 'undefined' || variables[key] === null) {
        variables[key] = defaults[key];
      }
    });
  };

  function hasNewRecordBookEntry() {
    var variables = State.variables || {};

    return (
      variables.recordBookNewEnding === true ||
      variables.recordBookNewTrace === true ||
      variables.recordBookNewDream === true ||
      variables.recordBookNewBond === true
    );
  }

  function canAccessRecordBook() {
    var variables = State.variables || {};

    return variables.recordBookUnlocked === true || variables.debugMode === true;
  }

  function clearRecordBookNewFlags() {
    var variables = State.variables || {};

    variables.recordBookNewEnding = false;
    variables.recordBookNewTrace = false;
    variables.recordBookNewDream = false;
    variables.recordBookNewBond = false;
  }

  function refreshRecordBookOpenButtons() {
    var label = hasNewRecordBookEntry() ? setup.t('journalButton') + ' *' : setup.t('journalButton');

    document.querySelectorAll('.recordbook-open-button a').forEach(function (link) {
      link.textContent = label;
    });
  }

  function makeRecordBookOpenButton() {
    var wrapper = makeEl('div', 'recordbook-open-button');
    var link = makeEl('a', '', hasNewRecordBookEntry() ? setup.t('journalButton') + ' *' : setup.t('journalButton'));

    link.href = '#';
    link.addEventListener('click', function (event) {
      event.preventDefault();
      setup.openRecordBookOverlay('endings');
    });

    wrapper.appendChild(link);
    return wrapper;
  }

  function removeRecordBookOverlay() {
    document.querySelectorAll('.recordbook-dim, .recordbook-panel').forEach(function (el) {
      el.remove();
    });
  }

  function renderRecordBookOverlay() {
    var stage = document.querySelector('.wolf-page');

    setup.ensureRecordBookVariables();
    removeRecordBookOverlay();

    if (!stage || !(State.variables && State.variables.recordBookOpen === true)) {
      return;
    }

    wikiInto(stage, '<<include "RecordBookOverlay">>');
  }

  setup.openRecordBookOverlay = function (tab) {
    setup.ensureRecordBookVariables();

    if (isRecordBookHiddenPassage(State.passage || '')) {
      return;
    }
    if (!canAccessRecordBook()) {
      return;
    }

    State.variables.recordBookOpen = true;
    State.variables.recordBookTab = tab || State.variables.recordBookTab || 'endings';
    State.variables.recordBookFirstOpened = true;
    clearRecordBookNewFlags();
    if (setup.clearToasts) {
      setup.clearToasts();
    }
    refreshRecordBookOpenButtons();
    renderRecordBookOverlay();
  };

  setup.closeRecordBookOverlay = function () {
    setup.ensureRecordBookVariables();
    State.variables.recordBookOpen = false;
    removeRecordBookOverlay();
  };

  setup.switchRecordBookTab = function (tab) {
    setup.ensureRecordBookVariables();
    if (!canAccessRecordBook()) {
      return;
    }

    State.variables.recordBookOpen = true;
    State.variables.recordBookTab = tab || 'endings';
    renderRecordBookOverlay();
  };

  setup.ensureToastLayer = function () {
    var layer = document.getElementById('wolf-toast-layer');
    var root = setup.getGameRoot ? setup.getGameRoot() : (document.querySelector('#passages > .passage:last-child') || document.querySelector('#passages') || document.body);

    if (!layer) {
      layer = makeEl('div', 'wolf-toast-layer');
      layer.id = 'wolf-toast-layer';
    }

    (root || document.body).appendChild(layer);
    return layer;
  };

  setup.clearToasts = function () {
    document.querySelectorAll('.wolf-toast-layer').forEach(function (layer) {
      layer.textContent = '';
    });
  };

  setup.showToast = function (message, type) {
    var variables = State.variables || {};

    if (!message || variables.recordBookOpen === true) {
      return;
    }

    window.setTimeout(function () {
      var currentVariables = State.variables || {};
      var layer;
      var item;

      if (currentVariables.recordBookOpen === true) {
        return;
      }

      layer = setup.ensureToastLayer();
      item = makeEl('div', 'wolf-toast', message);

      if (type) {
        item.classList.add('wolf-toast-' + String(type));
      }

      layer.appendChild(item);

      window.setTimeout(function () {
        item.classList.add('is-leaving');
      }, 1800);

      window.setTimeout(function () {
        if (item && item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, 2600);
    }, 0);
  };

  function makeDayDisplay() {
    var wrapper = makeEl('div', 'day-display');

    wrapper.appendChild(makeEl('div', 'day-display-day', setup.getDayLabel()));

    return wrapper;
  }

  function isNightInterludePassage(passageName) {
    return /^(Temple_Return_Hub|Temple_Return_Bad|Temple_Sleep)$/.test(String(passageName || ''));
  }

  function isTempleHubPassage(passageName) {
    return /^(Temple|Temple_Return|Temple_Return_Hub)$/.test(String(passageName || ''));
  }

  function isStoryChoicePassage(passageName) {
    var name = String(passageName || '');

    if (!/^(Hanbei|Kuro|Genichiro|Sculptor|Isshin|Emma)/.test(name)) {
      return false;
    }
    if (/_Result$/.test(name)) {
      return false;
    }

    return /_(Choice|Choices)$/.test(name) || /_FinalChoice$/.test(name);
  }

  function getVisibleChoiceLinks(choiceBox) {
    return Array.prototype.filter.call(choiceBox.querySelectorAll('a'), function (link) {
      return link.textContent.trim() !== '';
    });
  }

  function markStoryChoiceLayer(text, passageName) {
    if (!isStoryChoicePassage(passageName)) {
      return;
    }

    Array.prototype.forEach.call(text.querySelectorAll('.route-choice-screen'), function (layer) {
      layer.classList.add('story-choice-layer');
      Array.prototype.forEach.call(layer.querySelectorAll('.route-choice-box'), function (box) {
        box.classList.add('story-choice-box');
      });
    });

    if (text.querySelector('.route-choice-screen')) {
      return;
    }

    Array.prototype.forEach.call(text.querySelectorAll('.choice-box'), function (choiceBox) {
      var links = getVisibleChoiceLinks(choiceBox);

      if (choiceBox.classList.contains('intro-continue') ||
        choiceBox.classList.contains('temple-hub-choices') ||
        choiceBox.classList.contains('continue-row') ||
        choiceBox.closest('.debug-endings') ||
        choiceBox.closest('.ending-return-screen') ||
        links.length < 2
      ) {
        return;
      }

      var layer = makeEl('div', 'route-choice-screen story-choice-layer');
      choiceBox.parentNode.insertBefore(layer, choiceBox);
      choiceBox.classList.add('route-choice-box', 'story-choice-box');
      layer.appendChild(choiceBox);
    });
  }

  function getSceneBgAlias(bgClass) {
    switch (bgClass) {
      case 'bg-black':
        return 'bg-intro';
      case 'bg-nightpatrol':
      case 'bg-nightpatrol-01':
        return 'bg-night-patrol';
      case 'bg-nightpatrol-02':
        return 'bg-night-patrol-02';
      case 'bg-nightpatrol-03':
        return 'bg-night-patrol-03';
      case 'bg-nightpatrol-04':
        return 'bg-night-patrol-04';
      case 'bg-nightpatrol-05':
        return 'bg-night-patrol-05';
      case 'bg-night':
        return 'bg-night';
      case 'bg-ashina-gate':
        return 'bg-ashina-gate';
      case 'bg-ashina':
        return 'bg-ashina-tower';
      case 'bg-dawn':
        return 'bg-dawn';
      case 'bg-true':
        return 'bg-true';
      default:
        return bgClass;
    }
  }

  function getSequenceClasses(passageName) {
    var name = String(passageName || '');
    var classes = [];

    if (/^Intro_Dream/.test(name) || name === 'Intro_Wake') {
      classes.push('intro-dream-screen');
    }
    else if (/^Intro/.test(name)) {
      classes.push('intro-screen', 'intro-sequence-page', 'sequence-accumulate');
    }
    if (name === 'Ending_ReturnToStart') {
      classes.push('ending-return-stage');
    }
    else if (/^BadEnd_/.test(name)) {
      classes.push('ending-screen', 'bad-ending-sequence', 'sequence-vanish', 'sequence-cut');
    }
    else if (/^Ending_Hidden_Rebirth/.test(name)) {
      classes.push('ending-screen', 'hidden-ending-sequence', 'final-still-sequence');
    }
    else if (/^Ending_/.test(name) || name === 'Hanbei_End_QuietDay') {
      classes.push('ending-screen', 'ending-sequence', 'sequence-vanish');
    }
    else if (/^Hidden_Rebirth_Voices/.test(name)) {
      classes.push('ending-screen', 'hidden-voice-sequence', 'sequence-vanish');
    }
    else if (/^Hidden_Rebirth_(Temple|ExitTemple)/.test(name)) {
      classes.push('hidden-return-sequence', 'sequence-accumulate');
    }
    else if (/^Hidden_Rebirth_FinalField/.test(name)) {
      classes.push('hidden-final-sequence', 'final-still-sequence');
    }

    return classes;
  }

  function markLayout(stage, text) {
    var hasTalk = text.querySelector('.talk-row') !== null;
    var hasChoice = text.querySelector('.choice-box') !== null;
    var isSequenceScreen = (
      stage.classList.contains('intro-screen') ||
      stage.classList.contains('ending-screen') ||
      stage.classList.contains('ending-return-stage')
    );
    var isHubScreen = stage.classList.contains('temple-hub');

    stage.classList.add(hasTalk ? 'has-talk' : 'no-talk');
    stage.classList.add(hasTalk ? 'dialogue-page' : 'narration-only');
    if (hasChoice) {
      stage.classList.add('has-choice');
    }

    Array.prototype.forEach.call(text.querySelectorAll('.narration'), function (el) {
      el.classList.add(hasTalk ? 'narration-over-talk' : 'narration-full');
    });

    Array.prototype.forEach.call(text.querySelectorAll('.choice-box'), function (el) {
      el.classList.add(hasTalk ? 'after-talk' : 'narration-choice');

      var links = Array.prototype.filter.call(el.querySelectorAll('a'), function (link) {
        return link.textContent.trim() !== '';
      });
      if (links.length === 1 && /^(계속|계속\.)$/.test(links[0].textContent.trim())) {
        el.classList.add('next-only');
        el.classList.add('wolf-next-button');
        if (
          !isSequenceScreen &&
          !isHubScreen &&
          !el.classList.contains('intro-continue') &&
          !el.classList.contains('route-choice-box') &&
          !el.closest('.route-choice-screen')
        ) {
          el.classList.add('continue-row');
        }
      }
    });
  }

  function trimNarrationWhitespace(root) {
    var scope = root || document;

    Array.prototype.forEach.call(scope.querySelectorAll('.narration'), function (el) {
      if (
        el.closest('.intro-screen') ||
        el.closest('.ending-screen') ||
        el.closest('.ending-return-stage')
      ) {
        return;
      }

      el.innerHTML = el.innerHTML
        .replace(/^[\s\u00a0\ufeff]+/, '')
        .replace(/[\s\u00a0\ufeff]+$/, '');
    });
  }

  function applyIntroSequenceTiming(stage, text) {
    if (!stage.classList.contains('intro-screen')) {
      return;
    }
    if (stage.classList.contains('intro-dream-screen')) {
      return;
    }

    var lines = Array.prototype.slice.call(text.querySelectorAll('.intro-sequence .intro-line'));
    var lineStep = 900;
    var firstDelay = 300;
    var choiceDelay = firstDelay + (lines.length * lineStep) + 450;

    lines.forEach(function (line, index) {
      line.style.animationDelay = (firstDelay + (index * lineStep)) + 'ms';
    });

    Array.prototype.forEach.call(text.querySelectorAll('.choice-box.intro-continue'), function (choice) {
      choice.style.animationDelay = choiceDelay + 'ms';
    });

    Array.prototype.forEach.call(text.querySelectorAll('.global-continue-layer'), function (choice) {
      choice.style.animationDelay = choiceDelay + 'ms';
    });
  }

  if (Macro.has('page')) {
    Macro.delete('page');
  }
  if (Macro.has('talk')) {
    Macro.delete('talk');
  }
  if (Macro.has('beat')) {
    Macro.delete('beat');
  }

  var WOLF_PORTRAIT_FILES = {
    emma : 'assets/portraits/emma.png',
    genichiro : 'assets/portraits/genichiro.png',
    genichiro_bad : 'assets/portraits/genichiro_bad.png',
    genichiro_like : 'assets/portraits/genichiro_like.png',
    hanbei : 'assets/portraits/hanbei.png',
    hanbei_bad : 'assets/portraits/hanbei_bad.png',
    hanbei_like : 'assets/portraits/hanbei_like.png',
    isshin : 'assets/portraits/isshin.png',
    isshin_bad : 'assets/portraits/isshin_bad.png',
    isshin_like : 'assets/portraits/isshin_like.png',
    kuro : 'assets/portraits/kuro.png',
    kuro_bad : 'assets/portraits/kuro_bad.png',
    kuro_like : 'assets/portraits/kuro_like.png',
    sculptor : 'assets/portraits/sculptor.png',
    sculptor_bad : 'assets/portraits/sculptor_bad.png',
    sculptor_like : 'assets/portraits/sculptor_like.png',
    wolf : 'assets/portraits/wolf.png',
    wolf_bad : 'assets/portraits/wolf_bad.png',
    wolf_danger : 'assets/portraits/wolf_danger.png',
    wolf_isolation : 'assets/portraits/wolf_isolation.png',
    wolf_shura_end : 'assets/portraits/wolf_shura_end.png',
    wolf_shura_on : 'assets/portraits/wolf_shura_on.png',
    wolf_true : 'assets/portraits/wolf_true.png'
  };

  var WOLF_BASE_PORTRAITS = {
    wolf : true,
    hanbei : true,
    kuro : true,
    genichiro : true,
    sculptor : true,
    isshin : true,
    emma : true
  };

  var WOLF_PORTRAIT_ALIASES = {
    늑대 : 'wolf',
    Wolf : 'wolf',
    wolf : 'wolf',
    hanbei_01 : 'hanbei',
    hanbei_02 : 'hanbei_like',
    hanbei_03 : 'hanbei_bad',
    hanbei_04 : 'hanbei_bad',
    Hanbei : 'hanbei',
    hanbei : 'hanbei',
    한베 : 'hanbei',
    kuro_01 : 'kuro',
    kuro_02 : 'kuro_like',
    Kuro : 'kuro',
    kuro : 'kuro',
    쿠로 : 'kuro',
    genichiro_02 : 'genichiro_like',
    genichiro_03 : 'genichiro_bad',
    Genichiro : 'genichiro',
    genichiro : 'genichiro',
    겐이치로 : 'genichiro',
    Sculptor : 'sculptor',
    sculptor : 'sculptor',
    조각가 : 'sculptor',
    isshin_02 : 'isshin_like',
    Isshin : 'isshin',
    isshin : 'isshin',
    잇신 : 'isshin',
    Emma : 'emma',
    emma : 'emma',
    엠마 : 'emma',
    shura : 'wolf_shura_on',
    wolf_shura : 'wolf_shura_on',
    wolf_shura_on : 'wolf_shura_on',
    wolf_shura_end : 'wolf_shura_end',
    wolf_true : 'wolf_true'
  };

  var WOLF_CHARACTER_LOVE_VARS = {
    hanbei : 'hanbeiLove',
    kuro : 'kuroLove',
    genichiro : 'genichiroLove',
    sculptor : 'sculptorLove',
    isshin : 'isshinLove'
  };

  var WOLF_CHARACTER_BAD_FLAGS = {
    hanbei : ['hanbeiBadPortrait', 'hanbeiRouteBad', 'hanbeiBadEndingSeen', 'hanbeiMercyEndingSeen', 'hanbeiSwordBadEndingSeen'],
    kuro : ['kuroBadPortrait', 'kuroRouteBad', 'kuroBadLastOrderSeen', 'kuroBadTeahouseSeen'],
    genichiro : ['genichiroBadPortrait', 'genichiroRouteBad', 'genichiroBadEndingSeen'],
    sculptor : ['sculptorBadPortrait', 'sculptorRouteBad', 'sculptorBadEndingSeen'],
    isshin : ['isshinBadPortrait', 'isshinRouteBad', 'isshinBadEndingSeen']
  };

  var WOLF_CHARACTER_PASSAGE_PREFIXES = {
    hanbei : 'Hanbei',
    kuro : 'Kuro',
    genichiro : 'Genichiro',
    sculptor : 'Sculptor',
    isshin : 'Isshin'
  };

  function getStoryVariables() {
    return (window.State && State.variables) || {};
  }

  function getCurrentPassageName() {
    return String(setup.wolfRenderPassageName || (window.State && State.passage) || '');
  }

  function getNumberVariable(name) {
    var value = Number(getStoryVariables()[name]);
    return Number.isFinite(value) ? value : 0;
  }

  function hasAnyFlag(flags) {
    var storyVars = getStoryVariables();
    return flags.some(function (flag) {
      return storyVars[flag] === true;
    });
  }

  function normalizePortraitName(name) {
    var key = String(name || '').trim();
    return WOLF_PORTRAIT_ALIASES[key] || key;
  }

  function getManualVariantKey(baseKey, variant) {
    var normalizedVariant = String(variant || '').trim();

    if (!normalizedVariant || normalizedVariant === 'normal' || normalizedVariant === 'base') {
      return baseKey;
    }

    if (baseKey === 'wolf') {
      if (/^(true|hidden|hiddenEnd|trueEnd)$/i.test(normalizedVariant)) {
        return 'wolf_true';
      }
      if (/^(shuraEnd|shura_end|end)$/i.test(normalizedVariant)) {
        return 'wolf_shura_end';
      }
      if (/^(shura|shuraOn|shura_on)$/i.test(normalizedVariant)) {
        return 'wolf_shura_on';
      }
      if (/^danger$/i.test(normalizedVariant)) {
        return 'wolf_danger';
      }
      if (/^isolation$/i.test(normalizedVariant)) {
        return 'wolf_isolation';
      }
      if (/^bad$/i.test(normalizedVariant)) {
        return 'wolf_bad';
      }
    }

    if (/^(like|bad)$/i.test(normalizedVariant)) {
      return baseKey + '_' + normalizedVariant.toLowerCase();
    }

    return normalizePortraitName(baseKey + '_' + normalizedVariant);
  }

  function isBadEndingPassage(passageName) {
    return /^BadEnd_/.test(String(passageName || ''));
  }

  function isTrueEndingPassage(passageName) {
    return /^(Hidden_Rebirth|Ending_Hidden_Rebirth)/.test(String(passageName || ''));
  }

  function isShuraEndingPassage(passageName) {
    return /^Shura/.test(String(passageName || ''));
  }

  function isCharacterBadContext(characterKey, passageName) {
    var prefix = WOLF_CHARACTER_PASSAGE_PREFIXES[characterKey];
    return !!(prefix && new RegExp('^BadEnd_' + prefix).test(String(passageName || '')));
  }

  function hasPortraitKey(key) {
    return Object.prototype.hasOwnProperty.call(WOLF_PORTRAIT_FILES, key);
  }

  function chooseWolfPortraitKey() {
    var storyVars = getStoryVariables();
    var passageName = getCurrentPassageName();

    if (isTrueEndingPassage(passageName) || storyVars.hiddenRevivalDone === true || storyVars.wolfTruePortrait === true) {
      return 'wolf_true';
    }

    if (isShuraEndingPassage(passageName) || storyVars.shuraDone === true || storyVars.wolfShuraEndPortrait === true) {
      return 'wolf_shura_end';
    }

    if (getNumberVariable('shura') >= 8) {
      return 'wolf_shura_on';
    }

    if (isBadEndingPassage(passageName) || storyVars.wolfBadPortrait === true || storyVars.routeBadPortrait === true) {
      return 'wolf_bad';
    }

    if (getNumberVariable('danger') >= 7) {
      return 'wolf_danger';
    }

    if (getNumberVariable('isolation') >= 7) {
      return 'wolf_isolation';
    }

    return 'wolf';
  }

  function chooseCharacterPortraitKey(characterKey) {
    var loveVar = WOLF_CHARACTER_LOVE_VARS[characterKey];
    var badFlags = WOLF_CHARACTER_BAD_FLAGS[characterKey] || [];
    var passageName = getCurrentPassageName();
    var badKey = characterKey + '_bad';
    var likeKey = characterKey + '_like';

    if (characterKey === 'emma') {
      return 'emma';
    }

    if ((isCharacterBadContext(characterKey, passageName) || hasAnyFlag(badFlags) || getNumberVariable(loveVar) <= -1) && hasPortraitKey(badKey)) {
      return badKey;
    }

    if (getNumberVariable(loveVar) >= 4 && hasPortraitKey(likeKey)) {
      return likeKey;
    }

    return characterKey;
  }

  function resolvePortraitKey(portrait) {
    var requested = String(portrait || '').trim();
    var parts = requested.split(':');
    var baseKey = normalizePortraitName(parts[0]);
    var manualKey = parts.length > 1 ? getManualVariantKey(baseKey, parts.slice(1).join(':')) : '';

    if (manualKey && hasPortraitKey(manualKey)) {
      return manualKey;
    }

    if (hasPortraitKey(baseKey) && !WOLF_BASE_PORTRAITS[baseKey]) {
      return baseKey;
    }

    if (baseKey === 'wolf') {
      return chooseWolfPortraitKey();
    }

    if (WOLF_BASE_PORTRAITS[baseKey]) {
      return chooseCharacterPortraitKey(baseKey);
    }

    return baseKey;
  }

  function getPortraitPath(portraitKey) {
    return WOLF_PORTRAIT_FILES[portraitKey] || '';
  }

  Macro.add('page', {
    tags : null,
    handler : function () {
      var passageName = setup.wolfRenderPassageName || (this.passageObj && this.passageObj.title) || State.passage || '';
      var bgClass = getSceneBgClass(passageName);
      var bgAlias = getSceneBgAlias(bgClass);
      var locationName = getSceneLocationName(passageName, bgClass);
      var stage = makeEl('div', 'stage page-stage wolf-page ' + bgClass + ' ' + bgAlias);
      var location = locationName ? makeEl('div', 'location-label', locationName) : null;
      var dayDisplay = shouldShowDayDisplay(passageName) ? makeDayDisplay() : null;
      var box = makeEl('div', 'page-box');
      var text = makeEl('div', 'page-text wolf-content');
      var sameBg = setup.wolfLastBgClass === bgClass;
      var wasNightInterlude = setup.wolfLastWasNightInterlude === true;
      var isNightInterlude = isNightInterludePassage(passageName);
      var isTempleHub = isTempleHubPassage(passageName);
      var transitionClass = sameBg ? 'same-bg' : 'changed-bg';
      var sequenceClasses = getSequenceClasses(passageName);

      stage.classList.add(transitionClass);
      sequenceClasses.forEach(function (className) {
        stage.classList.add(className);
      });
      if (isNightInterlude) {
        stage.classList.add('night-interlude');
      }
      if (isTempleHub) {
        stage.classList.add('temple-hub');
      }
      if (wasNightInterlude && !isNightInterlude) {
        stage.classList.add('from-night-interlude');
      }
      if (!sameBg) {
        stage.classList.add('bg-changed');
      }
      setup.wolfLastBgClass = bgClass;
      setup.wolfLastWasNightInterlude = isNightInterlude;

      document.documentElement.classList.toggle('wolf-intro-active', stage.classList.contains('intro-screen'));
      document.body.classList.toggle('wolf-intro-active', stage.classList.contains('intro-screen'));

      if (setup.ensureRecordBookVariables) {
        setup.ensureRecordBookVariables();
      }
      stage.appendChild(box);
      if (location) {
        stage.insertBefore(location, box);
      }
      if (dayDisplay) {
        stage.insertBefore(dayDisplay, box);
      }
      if (
        !isRecordBookHiddenPassage(passageName) &&
        State.variables &&
        canAccessRecordBook() &&
        !(State.variables && State.variables.recordBookOpen === true)
      ) {
        stage.appendChild(makeRecordBookOpenButton());
      }
      box.appendChild(text);

      wikiInto(text, this.payload[0].contents);
      trimNarrationWhitespace(text);
      markStoryChoiceLayer(text, passageName);
      markLayout(stage, text);
      applyIntroSequenceTiming(stage, text);
      if (State.variables && State.variables.recordBookOpen === true) {
        wikiInto(stage, '<<include "RecordBookOverlay">>');
      }

      this.output.appendChild(stage);

      var passageEl = stage.closest('.passage');
      if (passageEl) {
        passageEl.classList.remove('wolf-same-bg', 'wolf-changed-bg', 'same-bg', 'bg-changed');
        passageEl.classList.add(sameBg ? 'wolf-same-bg' : 'wolf-changed-bg');
        passageEl.classList.add(sameBg ? 'same-bg' : 'bg-changed');
      }
    }
  });

  Macro.add('talk', {
    tags : null,
    handler : function () {
      var requestedPortrait = this.args.length > 0 ? String(this.args[0] || '') : '';
      var portrait = requestedPortrait ? resolvePortraitKey(requestedPortrait) : '';
      var portraitPath = portrait ? getPortraitPath(portrait) : '';
      var speaker = this.args.length > 1 ? String(this.args[1] || '') : '';

      var row = makeEl('div', 'talk-row ' + (portrait ? 'has-portrait' : 'no-portrait'));
      if (portrait) {
        row.setAttribute('data-portrait-key', portrait);
      }

      if (portrait) {
        var portraitBox = makeEl('div', 'talk-portrait-box');
        var img = document.createElement('img');
        img.className = 'portrait';
        img.src = portraitPath || ('assets/portraits/' + portrait + '.png');
        if (!portraitPath && window.console && console.warn) {
          console.warn('[Wolf] Missing portrait key:', requestedPortrait, 'resolved as:', portrait);
        }
        img.addEventListener('error', function () {
          if (window.console && console.warn) {
            console.warn('[Wolf] Missing portrait asset:', requestedPortrait, 'resolved as:', portrait, img.src);
          }
        }, { once : true });
        portraitBox.appendChild(img);
        row.appendChild(portraitBox);
      }
      else {
        row.appendChild(makeEl('div', 'talk-portrait-box is-empty'));
      }

      var panelWrap = makeEl('div', 'talk-panel-wrap');
      if (speaker) {
        panelWrap.appendChild(makeEl('div', 'talk-nameplate', speaker));
      }

      var panel = makeEl('div', 'textbox-panel');
      var dialogue = makeEl('div', 'dialogue');
      panel.appendChild(dialogue);
      panelWrap.appendChild(panel);
      row.appendChild(panelWrap);

      wikiInto(dialogue, this.payload[0].contents);
      this.output.appendChild(row);
    }
  });

  Macro.add('beat', {
    tags : null,
    handler : function () {
      var row = makeEl('div', 'talk-row beat-row inline-narration');
      var portraitBox = makeEl('div', 'talk-portrait-box beat-portrait-space');
      var panelWrap = makeEl('div', 'talk-panel-wrap beat-panel-wrap');
      var panel = makeEl('div', 'textbox-panel beat-panel');
      var dialogue = makeEl('div', 'dialogue beat-dialogue');

      panel.appendChild(dialogue);
      panelWrap.appendChild(panel);
      row.appendChild(portraitBox);
      row.appendChild(panelWrap);

      wikiInto(dialogue, this.payload[0].contents);
      this.output.appendChild(row);
    }
  });

  window.WolfTrimNarrationWhitespace = trimNarrationWhitespace;
}());


UIBar.stow();

var WOLF_STAT_LIMITS = {
  common : {
    min : 0,
    max : 20,
    keys : ['isolation', 'danger', 'shura']
  },
  love : {
    min : -5,
    max : 10,
    keys : ['hanbeiLove', 'kuroLove', 'genichiroLove', 'sculptorLove', 'isshinLove']
  }
};

function wolfClampNumber(value, min, max) {
  var number = Number(value);
  if (!isFinite(number)) {
    number = 0;
  }
  return Math.max(min, Math.min(max, number));
}

function wolfClampVariableGroup(variables, group) {
  group.keys.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      variables[key] = wolfClampNumber(variables[key], group.min, group.max);
    }
  });
}

function wolfClampStats() {
  var variables = State.variables || {};

  wolfClampVariableGroup(variables, WOLF_STAT_LIMITS.common);
  wolfClampVariableGroup(variables, WOLF_STAT_LIMITS.love);
}

setup.wolfStatLimits = WOLF_STAT_LIMITS;
setup.wolfClampStats = wolfClampStats;
window.WolfClampStats = wolfClampStats;

setup.ensureBondVariables = function () {
  var variables = State.variables || {};
  var defaults = {
    hanbeiAffection : 0,
    hanbeiConflict : 0,
    kuroAffection : 0,
    kuroConflict : 0,
    genichiroAffection : 0,
    genichiroConflict : 0,
    sculptorAffection : 0,
    sculptorConflict : 0,
    isshinAffection : 0,
    isshinConflict : 0,
    emmaAffection : 0,
    emmaConflict : 0
  };

  Object.keys(defaults).forEach(function (key) {
    if (variables[key] === undefined || variables[key] === null) {
      variables[key] = defaults[key];
    }
  });
};

setup.getBond = function (character) {
  var variables = State.variables || {};
  var key = String(character || '');
  var affection = Number(variables[key + 'Affection']) || 0;
  var conflict = Number(variables[key + 'Conflict']) || 0;

  return affection + conflict;
};

setup.getTotalBond = function () {
  return ['hanbei', 'kuro', 'genichiro', 'sculptor', 'isshin', 'emma'].reduce(function (total, character) {
    return total + setup.getBond(character);
  }, 0);
};

setup.ensureDreamRiskVariables = function () {
  if (setup.ensureRecordBookVariables) {
    setup.ensureRecordBookVariables();
  }
};

if (typeof Macro !== 'undefined' && (!Macro.has || !Macro.has('continueTo'))) {
  Macro.add('continueTo', {
    handler: function () {
      var target = this.args[0];
      var marker;

      if (!target || typeof target !== 'string') {
        return this.error('continueTo requires a target passage name.');
      }

      marker = document.createElement('span');
      marker.className = 'continue-marker';
      marker.dataset.continueTarget = target;
      this.output.appendChild(marker);
    }
  });
}

function wolfSetSessionFlag(key) {
  try {
    window.sessionStorage.setItem(key, 'true');
  } catch (error) {
    setup[key] = true;
  }
}

function wolfHasSessionFlag(key) {
  try {
    return window.sessionStorage.getItem(key) === 'true';
  } catch (error) {
    return !!setup[key];
  }
}

function wolfClearSessionFlag(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    setup[key] = false;
  }
}

setup.hasAutosave = function () {
  try {
    if (typeof Save !== 'undefined' &&
        Save.browser &&
        Save.browser.auto &&
        typeof Save.browser.auto.has === 'function') {
      return Save.browser.auto.has(0);
    }
  } catch (error) {
    if (window.console && console.warn) {
      console.warn('[Wolf] autosave check failed:', error);
    }
  }

  return false;
};

setup.deleteAutosave = function () {
  try {
    if (typeof Save !== 'undefined' &&
        Save.browser &&
        Save.browser.auto &&
        typeof Save.browser.auto.delete === 'function') {
      Save.browser.auto.delete(0);
    }
  } catch (error) {
    if (window.console && console.warn) {
      console.warn('[Wolf] autosave delete failed:', error);
    }
  }
};

setup.startNewGame = function () {
  setup.deleteAutosave();
  setup._wolfStartNewGame = true;
  wolfSetSessionFlag('wolf.startNewGame');

  if (typeof Engine !== 'undefined' && Engine.restart) {
    Engine.restart();
    return;
  }

  wolfClearSessionFlag('wolf.startNewGame');
  setup._wolfStartNewGame = false;
  Engine.play('Intro_Dream_01');
};

setup.continueAutosave = function () {
  try {
    if (setup.hasAutosave && setup.hasAutosave() &&
        typeof Save !== 'undefined' &&
        Save.browser &&
        Save.browser.auto &&
        typeof Save.browser.auto.load === 'function') {
      setup._wolfContinuingAutosave = true;
      wolfSetSessionFlag('wolf.continuingAutosave');
      Save.browser.auto.load(0);
      return;
    }
  } catch (error) {
    if (window.console && console.warn) {
      console.warn('[Wolf] autosave load failed:', error);
    }
  }

  setup._wolfContinuingAutosave = false;
  wolfClearSessionFlag('wolf.continuingAutosave');
};

setup.isAutosaveExcludedPassage = function (passageName) {
  var name = String(passageName || '');

  return (
    name === 'Start' ||
    name === 'StoryInit' ||
    name.indexOf('RecordBook') !== -1 ||
    /^Debug/.test(name)
  );
};

setup.saveAutosave = function () {
  var passage = State.passage || '';

  if (setup._wolfForceTitleRedirecting) {
    if (passage === 'Start') {
      setup._wolfForceTitleRedirecting = false;
    }
    return;
  }

  if (setup.isAutosaveExcludedPassage && setup.isAutosaveExcludedPassage(passage)) {
    return;
  }
  if (State.variables && State.variables.recordBookOpen) {
    return;
  }

  try {
    if (typeof Save !== 'undefined' &&
        Save.browser &&
        Save.browser.auto &&
        typeof Save.browser.auto.save === 'function') {
      Save.browser.auto.save('Wolf Autosave');
    }
  } catch (error) {
    if (window.console && console.warn) {
      console.warn('[Wolf] autosave failed:', error);
    }
  }
};

setup.ensureGlobalContinueLayer = function () {
  var layer = document.getElementById('wolf-global-continue-layer');
  var button;
  var root = setup.getGameRoot ? setup.getGameRoot() : (document.querySelector('#passages > .passage:last-child') || document.querySelector('#passages') || document.body);

  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'wolf-global-continue-layer';
    layer.className = 'wolf-global-continue-layer';

    button = document.createElement('button');
    button.type = 'button';
    button.className = 'wolf-global-continue-button';
    button.textContent = setup.t ? setup.t('continue') : '계속.';

    layer.appendChild(button);
  }

  (root || document.body).appendChild(layer);
  return layer;
};

setup.getGameRoot = function () {
  return (
    document.querySelector('#passages > .passage:last-child') ||
    document.querySelector('#passages > .passage') ||
    document.querySelector('#passages') ||
    document.querySelector('#story') ||
    document.body
  );
};

setup.updateGlobalContinue = function () {
  var root = setup.getGameRoot ? setup.getGameRoot() : document;
  var layer = setup.ensureGlobalContinueLayer();
  var button = layer.querySelector('.wolf-global-continue-button');
  var marker = root.querySelector ? root.querySelector('.continue-marker') : document.querySelector('.continue-marker');
  var target = marker ? marker.dataset.continueTarget : '';
  var variables = State.variables || {};

  if (!button) {
    return;
  }

  button.textContent = setup.t ? setup.t('continue') : '계속.';

  if (variables.recordBookOpen || document.querySelector('.recordbook-panel')) {
    layer.classList.remove('is-visible');
    button.onclick = null;
    return;
  }

  if (!target) {
    layer.classList.remove('is-visible');
    button.onclick = null;
    return;
  }

  if (typeof Story !== 'undefined' && Story.has && !Story.has(target)) {
    if (window.console && console.warn) {
      console.warn('[Wolf] Invalid continue target:', target);
    }
    layer.classList.remove('is-visible');
    button.onclick = null;
    return;
  }

  layer.classList.add('is-visible');
  button.onclick = function () {
    Engine.play(target);
  };
};

setup.rollNightRisk = function (threshold) {
  var target = Number(threshold) || 7;
  var bondBonus = Math.min(4, Math.max(0, setup.getTotalBond ? setup.getTotalBond() : 0));
  var roll = Math.floor(Math.random() * 10) + 1 + bondBonus;

  return roll >= target;
};

setup.getBondShape = function (character) {
  var variables = State.variables || {};
  var key = String(character || '');
  var affection = Number(variables[key + 'Affection']) || 0;
  var conflict = Number(variables[key + 'Conflict']) || 0;

  if (affection >= 4 && conflict >= 4) {
    return '깊은 인연';
  }
  if (affection > conflict) {
    return '애정이 앞서는 인연';
  }
  if (conflict > affection) {
    return '갈등이 앞서는 인연';
  }
  if (affection + conflict > 0) {
    return '아직 정해지지 않은 인연';
  }

  return '인연 없음';
};

if (Macro.has('clampStats')) {
  Macro.delete('clampStats');
}

Macro.add('clampStats', {
  handler : function () {
    wolfClampStats();
  }
});

function wolfUpdateRouteUnlocks() {
  var variables = State.variables || {};
  var day = Number(variables.day);

  if (isFinite(day) && day >= 2) {
    variables.nightPatrolUnlocked = true;
  }

  if (variables.qualifiedCharacterEndingSeen === true) {
    variables.secondLoopUnlocked = true;
    variables.secondRoutesUnlocked = true;
    variables.sculptorUnlocked = true;
  }

  if (isFinite(day) && day >= 3 && variables.secondLoopUnlocked === true) {
    variables.emmaEventUnlocked = true;
  }

  if (variables.sculptorDone === true && variables.isshinDone === true) {
    variables.shuraUnlocked = true;
  }

  if (variables.shuraEndingSeen === true || variables.shuraDone === true) {
    variables.hiddenRevivalUnlocked = true;
  }
}

function wolfMarkEndingSeen() {
  var variables = State.variables || {};
  var endingCount = Number(variables.endingCount);

  variables.endingCount = isFinite(endingCount) ? endingCount + 1 : 1;
  variables.anyEndingSeen = true;
  variables.traceFirstEnding = true;

  wolfUpdateRouteUnlocks();
}

function wolfMarkQualifiedCharacterEnding(character) {
  var variables = State.variables || {};
  var key = String(character || '').toLowerCase();
  var flagMap = {
    hanbei: 'hanbeiQualifiedEndingSeen',
    kuro: 'kuroQualifiedEndingSeen',
    genichiro: 'genichiroQualifiedEndingSeen',
    sculptor: 'sculptorQualifiedEndingSeen',
    isshin: 'isshinQualifiedEndingSeen'
  };
  var flag = flagMap[key];
  var count = Number(variables.qualifiedCharacterEndingCount);

  if (!flag) {
    return;
  }

  variables.qualifiedCharacterEndingSeen = true;
  variables.secondLoopUnlocked = true;
  variables.secondRoutesUnlocked = true;
  variables.sculptorUnlocked = true;
  variables.emmaEventUnlocked = true;

  if (variables[flag] !== true) {
    variables[flag] = true;
    variables.qualifiedCharacterEndingCount = isFinite(count) ? count + 1 : 1;
  }

  wolfUpdateRouteUnlocks();
}

setup.wolfUpdateRouteUnlocks = wolfUpdateRouteUnlocks;
setup.wolfMarkEndingSeen = wolfMarkEndingSeen;
setup.wolfMarkQualifiedCharacterEnding = wolfMarkQualifiedCharacterEnding;
window.WolfUpdateRouteUnlocks = wolfUpdateRouteUnlocks;
window.WolfMarkEndingSeen = wolfMarkEndingSeen;
window.WolfMarkQualifiedCharacterEnding = wolfMarkQualifiedCharacterEnding;

if (Macro.has('updateRouteUnlocks')) {
  Macro.delete('updateRouteUnlocks');
}

Macro.add('updateRouteUnlocks', {
  handler : function () {
    wolfUpdateRouteUnlocks();
  }
});

if (Macro.has('markEndingSeen')) {
  Macro.delete('markEndingSeen');
}

Macro.add('markEndingSeen', {
  handler : function () {
    wolfMarkEndingSeen();
  }
});

if (Macro.has('qualifiedCharacterEnding')) {
  Macro.delete('qualifiedCharacterEnding');
}

Macro.add('qualifiedCharacterEnding', {
  handler : function () {
    wolfMarkQualifiedCharacterEnding(this.args[0]);
  }
});

function wolfClearTimedChoice() {
  if (setup.timedChoiceTimer) {
    window.clearInterval(setup.timedChoiceTimer);
    setup.timedChoiceTimer = null;
  }
  if (setup.timedChoiceFrame) {
    window.cancelAnimationFrame(setup.timedChoiceFrame);
    setup.timedChoiceFrame = null;
  }

  setup.timedChoiceTarget = null;
}

function wolfUpdateTimedChoiceCountdown(remaining) {
  var el = document.querySelector('[data-timed-choice-countdown]');

  if (el) {
    el.textContent = String(Math.max(0, remaining));
  }
}

function wolfStartTimedChoice(seconds, targetPassage) {
  var remaining = Number(seconds);
  var target = String(targetPassage || '');

  wolfClearTimedChoice();

  if (!isFinite(remaining) || remaining <= 0 || !target) {
    return;
  }

  remaining = Math.ceil(remaining);
  setup.timedChoiceTarget = target;
  wolfUpdateTimedChoiceCountdown(remaining);

  setup.timedChoiceTimer = window.setInterval(function () {
    remaining -= 1;
    wolfUpdateTimedChoiceCountdown(remaining);

    if (remaining <= 0) {
      wolfClearTimedChoice();
      Engine.play(target);
    }
  }, 1000);
}

function wolfStartTimedChoiceBar(seconds, targetPassage) {
  var totalMs = Number(seconds) * 1000;
  var target = String(targetPassage || '');
  var startTime = 0;

  wolfClearTimedChoice();

  if (!isFinite(totalMs) || totalMs <= 0 || !target) {
    return;
  }

  setup.timedChoiceTarget = target;

  function update(now) {
    var elapsed;
    var remainingRatio;
    var bar;

    if (!startTime) {
      startTime = now;
    }

    elapsed = now - startTime;
    remainingRatio = Math.max(0, 1 - (elapsed / totalMs));
    bar = document.querySelector(
      '[data-timed-choice-bar], ' +
      '.timed-choice-bar-fill, ' +
      '.first-death-tension-fill, ' +
      '.genichiro-arrow-tension-fill, ' +
      '.genichiro-arrow-timer-fill'
    );

    if (bar) {
      bar.style.transform = 'scaleX(' + remainingRatio + ')';
    }

    if (remainingRatio <= 0) {
      wolfClearTimedChoice();
      Engine.play(target);
      return;
    }

    setup.timedChoiceFrame = window.requestAnimationFrame(update);
  }

  setup.timedChoiceFrame = window.requestAnimationFrame(update);
}

setup.startTimedChoice = wolfStartTimedChoice;
setup.startTimedChoiceBar = wolfStartTimedChoiceBar;
setup.clearTimedChoice = wolfClearTimedChoice;
window.WolfClearTimedChoice = wolfClearTimedChoice;

$(document).on(':passageend', function () {
  if (!document.querySelector('[data-timed-choice-countdown]') && !document.querySelector('[data-timed-choice-bar]')) {
    wolfClearTimedChoice();
  }
});

function getStoredStatusHidden() {
  try {
    var stored = localStorage.getItem('wolf.statusHidden');
    return stored === null ? true : stored === 'true';
  } catch (error) {
    return true;
  }
}

function wolfIsDebugMode() {
  return !!(typeof State !== 'undefined' &&
    State &&
    State.variables &&
    State.variables.debugMode === true);
}

function applyStatusHiddenClass(hidden) {
  document.documentElement.classList.toggle('status-hidden', hidden);
  document.body.classList.toggle('status-hidden', hidden);
}

function setStoredStatusHidden(hidden) {
  hidden = !!hidden;
  applyStatusHiddenClass(hidden);

  try {
    localStorage.setItem('wolf.statusHidden', hidden ? 'true' : 'false');
  } catch (error) {
    /* localStorage may be unavailable for local files in some browsers. */
  }
}

function applyStoredStatusHidden() {
  applyStatusHiddenClass(!wolfIsDebugMode() || getStoredStatusHidden());
}

function isTypingTarget(target) {
  if (!target) {
    return false;
  }

  var tagName = String(target.tagName || '').toLowerCase();
  return tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable ||
    !!(target.closest && target.closest('[contenteditable]'));
}

applyStoredStatusHidden();

$(document).on('keydown', function (event) {
  if (isTypingTarget(event.target)) {
    return;
  }

  if (event.key === '[') {
    event.preventDefault();
    document.body.classList.toggle('dev-mode');
  }

  if (event.key === ']') {
    event.preventDefault();
    if (!wolfIsDebugMode()) {
      applyStatusHiddenClass(true);
      return;
    }

    var currentlyHidden = document.documentElement.classList.contains('status-hidden') ||
      document.body.classList.contains('status-hidden');
    setStoredStatusHidden(!currentlyHidden);
  }
});

window.WolfSetStatusHidden = setStoredStatusHidden;
window.WolfApplyStoredStatusHidden = applyStoredStatusHidden;

(function () {
  'use strict';

  var BUTTON_SOUND_SRC = 'assets/sounds/button.mp3';
  var BUTTON_SOUND_VOLUME = 0.1125;
  var buttonSound = null;

  function getButtonSound() {
    if (!buttonSound) {
      buttonSound = new Audio(BUTTON_SOUND_SRC);
      buttonSound.preload = 'auto';
      buttonSound.volume = BUTTON_SOUND_VOLUME;
    }

    return buttonSound;
  }

  function playButtonSound() {
    try {
      var base = getButtonSound();
      var sound = base.cloneNode();
      sound.volume = BUTTON_SOUND_VOLUME;
      sound.currentTime = 0;

      var promise = sound.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    } catch (error) {
      /* SFX must never block navigation. */
    }
  }

  function isButtonLikeClick(target) {
    if (!target || !target.closest) {
      return false;
    }

    return !!target.closest('.choice-box a, .next-only a, a.link-internal, a, button, [data-game-back]');
  }

  document.addEventListener('click', function (event) {
    if (isButtonLikeClick(event.target)) {
      playButtonSound();
    }
  }, true);

  window.WolfPlayButtonSound = playButtonSound;
}());

function wolfEscapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

(function () {
  'use strict';

  function getEndingReturnLink(target) {
    if (!target || !target.closest) {
      return null;
    }

    return target.closest('.ending-return-screen a[data-passage]');
  }

  document.addEventListener('click', function (event) {
    var link = getEndingReturnLink(event.target);

    if (!link) {
      return;
    }

    var screen = link.closest('.ending-return-screen');
    var passage = link.getAttribute('data-passage');

    if (!screen || !passage) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    screen.classList.add('is-leaving');

    setTimeout(function () {
      Engine.play(passage);
    }, 700);
  }, true);
}());

(function () {
  'use strict';

  function getEndingStamp(target) {
    if (!target || !target.closest) {
      return null;
    }

    return target.closest('.ending-stamp[data-next]');
  }

  document.addEventListener('click', function (event) {
    var stamp = getEndingStamp(event.target);

    if (!stamp) {
      var stage = event.target && event.target.closest
        ? event.target.closest('.page-stage.ending-screen')
        : null;

      if (!stage) {
        return;
      }

      stamp = stage.querySelector('.ending-stamp[data-next]');

      if (!stamp) {
        return;
      }
    }

    var passage = stamp.getAttribute('data-next');

    if (!passage) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (window.WolfPlayButtonSound) {
      window.WolfPlayButtonSound();
    }

    Engine.play(passage);
  }, false);
}());

(function () {
  'use strict';

  var ENDING_SWAP_MS = 220;
  var endingSequenceLocked = false;

  function getSequenceLink(target) {
    if (!target || !target.closest) {
      return null;
    }

    return target.closest(
      '.page-stage.sequence-vanish .choice-box a, ' +
      '.page-stage.sequence-vanish .global-continue-button a, ' +
      '.page-stage.final-still-sequence .choice-box a, ' +
      '.page-stage.final-still-sequence .global-continue-button a'
    );
  }

  function shouldLetBrowserHandle(event, link) {
    return event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !link ||
      !link.getAttribute('data-passage');
  }

  function isEndingSequencePassage(passage) {
    return /^(Ending_|BadEnd_|Hidden_Rebirth_Voices)/.test(String(passage || ''));
  }

  function getPassageSource(passage) {
    if (!window.Story || typeof Story.get !== 'function') {
      return null;
    }

    if (typeof Story.has === 'function' && !Story.has(passage)) {
      return null;
    }

    var passageObj = Story.get(passage);
    if (!passageObj) {
      return null;
    }

    if (typeof passageObj.processText === 'function') {
      return passageObj.processText();
    }

    return passageObj.text || '';
  }

  function renderEndingPassage(passage) {
    var source = getPassageSource(passage);
    var container = document.createElement('div');
    var previousBgClass = setup.wolfLastBgClass;
    var previousNightInterlude = setup.wolfLastWasNightInterlude;

    if (!source) {
      return null;
    }

    setup.wolfRenderPassageName = passage;
    try {
      jQuery(container).wiki(source);
    }
    finally {
      delete setup.wolfRenderPassageName;
      setup.wolfLastBgClass = previousBgClass;
      setup.wolfLastWasNightInterlude = previousNightInterlude;
    }

    return container.querySelector('.page-stage.ending-screen');
  }

  function syncEndingStageClasses(stage, renderedStage) {
    var keepExiting = stage.classList.contains('is-sequence-exiting');
    stage.className = renderedStage.className;
    if (keepExiting) {
      stage.classList.add('is-sequence-exiting');
    }
  }

  function commitEndingContent(stage, renderedStage, overlayBox) {
    var currentBox = stage.querySelector('.page-box');
    var nextBox = overlayBox || renderedStage.querySelector('.page-box');

    if (!currentBox || !nextBox) {
      return false;
    }

    syncEndingStageClasses(stage, renderedStage);
    currentBox.replaceChildren.apply(currentBox, Array.prototype.slice.call(nextBox.childNodes));
    stage.classList.remove('is-sequence-exiting', 'is-ending-text-swapping');
    if (overlayBox && overlayBox.parentNode) {
      overlayBox.parentNode.removeChild(overlayBox);
    }
    return true;
  }

  function playEndingSequenceInPlace(stage, passage) {
    var renderedStage;
    var currentBox;
    var nextBox;

    if (endingSequenceLocked) {
      return true;
    }

    if (!stage) {
      return false;
    }

    renderedStage = renderEndingPassage(passage);
    if (!renderedStage) {
      return false;
    }

    currentBox = stage.querySelector('.page-box');
    nextBox = renderedStage.querySelector('.page-box');
    if (!currentBox || !nextBox) {
      return false;
    }

    endingSequenceLocked = true;
    stage.classList.add('is-ending-text-swapping');
    nextBox.classList.add('ending-next-box');
    stage.appendChild(nextBox);

    window.requestAnimationFrame(function () {
      nextBox.classList.add('is-visible');
      window.setTimeout(function () {
        if (!commitEndingContent(stage, renderedStage, nextBox)) {
          Engine.play(passage);
          endingSequenceLocked = false;
          return;
        }

        endingSequenceLocked = false;
      }, ENDING_SWAP_MS);
    });

    return true;
  }

  document.addEventListener('click', function (event) {
    var link = getSequenceLink(event.target);

    if (shouldLetBrowserHandle(event, link)) {
      return;
    }

    var passage = link.getAttribute('data-passage');
    var stage = link.closest('.page-stage');
    var delay = stage && stage.classList.contains('bad-ending-sequence') ? 120 : 220;

    event.preventDefault();
    event.stopPropagation();

    if (isEndingSequencePassage(passage) && playEndingSequenceInPlace(stage, passage)) {
      return;
    }

    if (stage) {
      stage.classList.add('is-sequence-exiting');
    }

    window.setTimeout(function () {
      Engine.play(passage);
    }, delay);
  }, true);
}());

function wolfFormatValue(value) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;

  try {
    var json = JSON.stringify(value);
    if (json.length > 32) {
      return json.slice(0, 29) + '...';
    }
    return json;
  } catch (error) {
    return String(value);
  }
}

function wolfFormatDebugValue(key, value) {
  if (key === 'timeOfDay') {
    switch (value) {
      case 'day':
        return '낮';
      case 'evening':
        return '저녁';
      case 'night':
        return '밤';
      default:
        return wolfFormatValue(value);
    }
  }

  return wolfFormatValue(value);
}

function wolfEnsureOuterUI() {
  if ($('.outer-dev-ui').length) return;

  $('body').append(
    '<div class="outer-dev-ui">' +
      '<a href="#" class="outer-back-button" data-game-back aria-label="앞 화면으로 돌아가기" title="앞 화면으로 돌아가기">◀</a>' +
      '<div class="outer-vars-panel" aria-label="Debug Status Panel">' +
        '<div class="outer-vars-title">DEBUG STATUS</div>' +
        '<div class="outer-passage-name"></div>' +
        '<div class="outer-vars-list"></div>' +
        '<div class="outer-dev-jumps"></div>' +
      '</div>' +
    '</div>'
  );

  applyStoredStatusHidden();
}

function wolfHasPassage(passageName) {
  return !!(passageName &&
    typeof Story !== 'undefined' &&
    Story &&
    typeof Story.has === 'function' &&
    Story.has(passageName));
}

function wolfUpdateOuterUI() {
  wolfEnsureOuterUI();
  wolfClampStats();
  if (setup.ensureBondVariables) {
    setup.ensureBondVariables();
  }
  applyStoredStatusHidden();

  var canGoBack = State.length > 1 && State.passage !== 'Start';
  $('.outer-back-button')
    .toggleClass('is-disabled', !canGoBack)
    .attr('aria-disabled', canGoBack ? 'false' : 'true');

  $('.outer-passage-name').text(State.passage || '');

  var vars = State.variables || {};
  function debugValue(key) {
    if (vars[key] === undefined || vars[key] === null) {
      return 0;
    }
    return vars[key];
  }

  var rows = [
    { key : 'day', value : vars.day },
    { key : 'timeOfDay', value : vars.timeOfDay },
    { key : 'language', value : vars.language || 'ko' },
    { key : 'currentRoute', value : vars.currentRoute },
    { key : 'totalBond', value : setup.getTotalBond ? setup.getTotalBond() : 0 },
    { key : 'hanbeiProgress', value : debugValue('hanbeiProgress') },
    { key : 'hanbeiBond', value : setup.getBond ? setup.getBond('hanbei') : 0 },
    { key : 'hanbeiAffection', value : debugValue('hanbeiAffection') },
    { key : 'hanbeiConflict', value : debugValue('hanbeiConflict') },
    { key : 'hanbeiJustVisitedSeen', value : debugValue('hanbeiJustVisitedSeen') },
    { key : 'hanbeiSakeSeen', value : debugValue('hanbeiSakeSeen') },
    { key : 'endingHanbeiQuietDaySeen', value : debugValue('endingHanbeiQuietDaySeen') },
    { key : 'kuroProgress', value : debugValue('kuroProgress') },
    { key : 'kuroBond', value : setup.getBond ? setup.getBond('kuro') : 0 },
    { key : 'kuroAffection', value : debugValue('kuroAffection') },
    { key : 'kuroConflict', value : debugValue('kuroConflict') },
    { key : 'genichiroProgress', value : debugValue('genichiroProgress') },
    { key : 'genichiroBond', value : setup.getBond ? setup.getBond('genichiro') : 0 },
    { key : 'genichiroAffection', value : debugValue('genichiroAffection') },
    { key : 'genichiroConflict', value : debugValue('genichiroConflict') },
    { key : 'sculptorProgress', value : debugValue('sculptorProgress') },
    { key : 'sculptorBond', value : setup.getBond ? setup.getBond('sculptor') : 0 },
    { key : 'sculptorAffection', value : debugValue('sculptorAffection') },
    { key : 'sculptorConflict', value : debugValue('sculptorConflict') },
    { key : 'isshinProgress', value : debugValue('isshinProgress') },
    { key : 'isshinBond', value : setup.getBond ? setup.getBond('isshin') : 0 },
    { key : 'isshinAffection', value : debugValue('isshinAffection') },
    { key : 'isshinConflict', value : debugValue('isshinConflict') },
    { key : 'emmaBond', value : setup.getBond ? setup.getBond('emma') : 0 },
    { key : 'emmaAffection', value : debugValue('emmaAffection') },
    { key : 'emmaConflict', value : debugValue('emmaConflict') },
    { key : 'isolation', value : vars.isolation },
    { key : 'danger', value : vars.danger },
    { key : 'shura', value : vars.shura },
    { key : 'freedom', value : debugValue('freedom') },
    { key : 'recordBookUnlocked', value : debugValue('recordBookUnlocked') },
    { key : 'anyEndingSeen', value : vars.anyEndingSeen },
    { key : 'qualifiedCharacterEndingSeen', value : debugValue('qualifiedCharacterEndingSeen') },
    { key : 'qualifiedCharacterEndingCount', value : debugValue('qualifiedCharacterEndingCount') },
    { key : 'secondLoopUnlocked', value : vars.secondLoopUnlocked },
    { key : 'sculptorUnlocked', value : debugValue('sculptorUnlocked') },
    { key : 'emmaEventUnlocked', value : debugValue('emmaEventUnlocked') },
    { key : 'isshinUnlocked', value : debugValue('isshinUnlocked') },
    { key : 'shuraUnlocked', value : vars.shuraUnlocked },
    { key : 'recordBookNewBond', value : debugValue('recordBookNewBond') }
  ];

  if (!rows.length) {
    $('.outer-vars-list').html('<div class="outer-var-empty">변수 없음</div>');
    return;
  }

  var html = rows.map(function (row) {
    return '<div class="outer-var-row">' +
      '<span class="outer-var-key">$' + wolfEscapeHtml(row.key) + '</span>' +
      '<span class="outer-var-value">' + wolfEscapeHtml(wolfFormatDebugValue(row.key, row.value)) + '</span>' +
    '</div>';
  }).join('');

  $('.outer-vars-list').html(html);

  var jumps = [
    { label : 'SKIP: Temple_Return', passage : 'Temple_Return' },
    { label : 'SKIP: Temple', passage : 'Temple' },
    { label : 'TEST: Hanbei', passage : 'Go_Hanbei' },
    { label : 'TEST: Sculptor', passage : 'Sculptor_Router' },
    { label : 'TEST: Isshin', passage : 'Isshin_Router' },
    { label : 'TEST: NightPatrol', passage : 'NightPatrol' },
    { label : 'DEBUG: AdvanceDay', passage : 'AdvanceDay' },
    { label : 'SKIP: EndingRouter', passage : 'EndingRouter' },
    { label : '엔딩 테스트', passage : 'Debug_Endings' }
  ];

  var languageButtons = [
    { label: 'KO', lang: 'ko' },
    { label: 'JA', lang: 'ja' },
    { label: 'EN', lang: 'en' },
    { label: '简', lang: 'zhHans' },
    { label: '繁', lang: 'zhHant' }
  ];
  var languageHtml = '<div class="debug-language-switcher"><span>언어:</span>' +
    languageButtons.map(function (item) {
      var active = (vars.language || 'ko') === item.lang ? ' is-active' : '';
      return '<button type="button" class="outer-language-button' + active + '" data-dev-language="' +
        wolfEscapeHtml(item.lang) + '">' + wolfEscapeHtml(item.label) + '</button>';
    }).join('') +
    '</div>';

  var jumpHtml = '<div class="outer-dev-jumps-title">DEV PANEL</div>' +
    languageHtml +
    jumps.map(function (jump) {
      var disabled = wolfHasPassage(jump.passage) ? '' : ' is-disabled';
      return '<button type="button" class="outer-dev-jump' + disabled + '" data-dev-jump="' +
        wolfEscapeHtml(jump.passage) + '">' + wolfEscapeHtml(jump.label) + '</button>';
    }).join('');

  $('.outer-dev-jumps').html(jumpHtml);
}

$(document).one(':passagedisplay', function () {
  if (State.passage !== 'Start' && !wolfHasSessionFlag('wolf.continuingAutosave')) {
    setup._wolfForceTitleRedirecting = true;
    Engine.play('Start');
  }
});

$(document).on(':passagestart', function () {
  if (wolfHasSessionFlag('wolf.continuingAutosave')) {
    if (State.variables) {
      State.variables.recordBookOpen = false;
    }
  }
});

$(document).on(':passagerender :passageend', function (event) {
  if (window.WolfTrimNarrationWhitespace) {
    window.WolfTrimNarrationWhitespace(event && event.content ? event.content : document);
  }
  wolfClampStats();
  wolfUpdateOuterUI();
  applyStoredStatusHidden();
  if (setup.updateGlobalContinue) {
    setup.updateGlobalContinue();
  }
});

$(document).on(':passagedisplay', function () {
  if (wolfHasSessionFlag('wolf.startNewGame') || setup._wolfStartNewGame) {
    wolfClearSessionFlag('wolf.startNewGame');
    setup._wolfStartNewGame = false;
    Engine.play('Intro_Dream_01');
    return;
  }

  if (wolfHasSessionFlag('wolf.continuingAutosave') || setup._wolfContinuingAutosave) {
    wolfClearSessionFlag('wolf.continuingAutosave');
    setup._wolfContinuingAutosave = false;
    if (State.variables) {
      State.variables.recordBookOpen = false;
    }
  }

  if (setup.saveAutosave) {
    setup.saveAutosave();
  }
});

$(document).ready(function () {
  wolfClampStats();
  wolfUpdateOuterUI();
  applyStoredStatusHidden();
  if (setup.updateGlobalContinue) {
    setup.updateGlobalContinue();
  }
});

$(document).on('click', '[data-game-back]', function (event) {
  event.preventDefault();

  if ($(this).hasClass('is-disabled')) return;

  if (State.length > 1) {
    Engine.backward();
  }
});

$(document).on('click', '[data-dev-jump]', function (event) {
  event.preventDefault();

  if (!wolfIsDebugMode() || $(this).hasClass('is-disabled')) return;

  var passage = $(this).attr('data-dev-jump');
  if (wolfHasPassage(passage)) {
    Engine.play(passage);
  }
});

$(document).on('click', '[data-dev-language]', function (event) {
  event.preventDefault();

  if (!wolfIsDebugMode()) return;

  State.variables.language = $(this).attr('data-dev-language') || 'ko';
  Engine.play(State.passage);
});
