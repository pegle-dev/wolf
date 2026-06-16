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

  function getSceneBgClass(passageName) {
    var name = String(passageName || '');

    if (/^Intro/.test(name)) {
      return 'bg-black';
    }
    if (/^Hanbei/.test(name)) {
      return 'bg-training';
    }
    if (/^NightPatrol/.test(name)) {
      return 'bg-nightpatrol';
    }
    if (/^Kuro/.test(name)) {
      return 'bg-room';
    }
    if (/^Genichiro/.test(name)) {
      return 'bg-ashina';
    }

    return 'bg-temple';
  }

  function getSceneBgAlias(bgClass) {
    switch (bgClass) {
      case 'bg-black':
        return 'bg-intro';
      case 'bg-nightpatrol':
        return 'bg-night-patrol';
      case 'bg-ashina':
        return 'bg-ashina-tower';
      default:
        return bgClass;
    }
  }

  function markLayout(stage, text) {
    var hasTalk = text.querySelector('.talk-row') !== null;
    var hasChoice = text.querySelector('.choice-box') !== null;

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
      if (links.length === 1 && links[0].textContent.trim() === '계속') {
        el.classList.add('next-only');
        el.classList.add('wolf-next-button');
      }
    });
  }

  if (Macro.has('page')) {
    Macro.delete('page');
  }
  if (Macro.has('talk')) {
    Macro.delete('talk');
  }

  Macro.add('page', {
    tags : null,
    handler : function () {
      var passageName = (this.passageObj && this.passageObj.title) || State.passage || '';
      var bgClass = getSceneBgClass(passageName);
      var bgAlias = getSceneBgAlias(bgClass);
      var stage = makeEl('div', 'stage page-stage wolf-page ' + bgClass + ' ' + bgAlias);
      var box = makeEl('div', 'page-box');
      var text = makeEl('div', 'page-text wolf-content');
      var sameBg = setup.wolfLastBgClass === bgClass;
      var transitionClass = sameBg ? 'same-bg' : 'changed-bg';

      stage.classList.add(transitionClass);
      if (!sameBg) {
        stage.classList.add('bg-changed');
      }
      setup.wolfLastBgClass = bgClass;

      stage.appendChild(box);
      box.appendChild(text);

      wikiInto(text, this.payload[0].contents);
      markLayout(stage, text);

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
      var portrait = this.args.length > 0 ? String(this.args[0] || '') : '';
      var speaker = this.args.length > 1 ? String(this.args[1] || '') : '';

      var row = makeEl('div', 'talk-row ' + (portrait ? 'has-portrait' : 'no-portrait'));

      if (portrait) {
        var portraitBox = makeEl('div', 'talk-portrait-box');
        var img = document.createElement('img');
        img.className = 'portrait';
        img.src = 'assets/portraits/' + portrait + '.png';
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
}());


UIBar.stow();

Config.passages.transitionOut = 0;
Config.history.controls = false;

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

if (Macro.has('clampStats')) {
  Macro.delete('clampStats');
}

Macro.add('clampStats', {
  handler : function () {
    wolfClampStats();
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
  var BUTTON_SOUND_VOLUME = 0.45;
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
  applyStoredStatusHidden();

  var canGoBack = State.length > 1 && State.passage !== 'Start';
  $('.outer-back-button')
    .toggleClass('is-disabled', !canGoBack)
    .attr('aria-disabled', canGoBack ? 'false' : 'true');

  $('.outer-passage-name').text(State.passage || '');

  var vars = State.variables || {};
  var keys = [
    'currentRoute',
    'hanbeiProgress',
    'hanbeiLove',
    'kuroProgress',
    'kuroLove',
    'genichiroProgress',
    'genichiroLove',
    'sculptorProgress',
    'sculptorLove',
    'isshinProgress',
    'isshinLove',
    'isolation',
    'danger',
    'shura',
    'anyEndingSeen',
    'secondLoopUnlocked',
    'shuraUnlocked'
  ];

  if (!keys.length) {
    $('.outer-vars-list').html('<div class="outer-var-empty">변수 없음</div>');
    return;
  }

  var html = keys.map(function (key) {
    return '<div class="outer-var-row">' +
      '<span class="outer-var-key">$' + wolfEscapeHtml(key) + '</span>' +
      '<span class="outer-var-value">' + wolfEscapeHtml(wolfFormatValue(vars[key])) + '</span>' +
    '</div>';
  }).join('');

  $('.outer-vars-list').html(html);

  var jumps = [
    { label : 'SKIP: Temple_Return', passage : 'Temple_Return' },
    { label : 'SKIP: Temple', passage : 'Temple' },
    { label : 'TEST: Hanbei', passage : 'Go_Hanbei' },
    { label : 'TEST: NightPatrol', passage : 'NightPatrol' },
    { label : 'SKIP: EndingRouter', passage : 'EndingRouter' }
  ];

  var jumpHtml = '<div class="outer-dev-jumps-title">DEV PANEL</div>' +
    jumps.map(function (jump) {
      var disabled = wolfHasPassage(jump.passage) ? '' : ' is-disabled';
      return '<button type="button" class="outer-dev-jump' + disabled + '" data-dev-jump="' +
        wolfEscapeHtml(jump.passage) + '">' + wolfEscapeHtml(jump.label) + '</button>';
    }).join('');

  $('.outer-dev-jumps').html(jumpHtml);
}

$(document).on(':passagerender :passageend', function () {
  wolfClampStats();
  wolfUpdateOuterUI();
  applyStoredStatusHidden();
});

$(document).ready(function () {
  wolfClampStats();
  wolfUpdateOuterUI();
  applyStoredStatusHidden();
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
