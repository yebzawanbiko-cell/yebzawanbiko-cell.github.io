(function () {
  'use strict';

  var intro = document.getElementById('intro');
  var screens = document.querySelectorAll('[data-screen]');
  var tabs = document.querySelectorAll('[data-tab]');
  var platformButtons = document.querySelectorAll('[data-platform]');
  var cards = document.querySelectorAll('[data-card]');
  var replayButton = document.getElementById('replay');

  /* ---------- Bottom tabs ---------- */
  function showScreen(name) {
    screens.forEach(function (screen) {
      screen.hidden = screen.getAttribute('data-screen') !== name;
    });
    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-tab') === name;
      tab.classList.toggle('is-active', active);
      if (active) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      showScreen(tab.getAttribute('data-tab'));
    });
  });

  /* ---------- Channels: pick a platform ---------- */
  function showPlatform(name) {
    platformButtons.forEach(function (button) {
      var active = button.getAttribute('data-platform') === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    cards.forEach(function (card) {
      card.hidden = card.getAttribute('data-card') !== name;
    });
  }

  platformButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      showPlatform(button.getAttribute('data-platform'));
    });
  });

  /* ---------- Splash / intro ---------- */
  // When the splash has slid off the screen, remove it from the page.
  intro.addEventListener('animationend', function (event) {
    if (event.target === intro && event.animationName === 'introOut') {
      intro.hidden = true;
    }
  });

  function playIntro() {
    showScreen('home');
    showPlatform('telegram');
    intro.hidden = false;
    intro.classList.remove('play');
    void intro.offsetWidth; // restart the CSS animations
    intro.classList.add('play');
  }

  replayButton.addEventListener('click', playIntro);

  /* ---------- Open the native app when it is installed ---------- */
  // On Android, an "intent" link opens the installed app and automatically
  // falls back to the website when the app is not installed.
  // On iPhone and iPad, the normal https links are "universal links":
  // iOS opens the app by itself when it is installed, and the website otherwise.
  // On computers the website opens as usual.
  var ANDROID_INTENTS = {
    telegram:
      'intent://resolve?domain=HUfellow#Intent;scheme=tg;package=org.telegram.messenger;' +
      'S.browser_fallback_url=' + encodeURIComponent('https://t.me/HUfellow') + ';end',
    instagram:
      'intent://instagram.com/_u/hufellow/#Intent;scheme=https;package=com.instagram.android;' +
      'S.browser_fallback_url=' + encodeURIComponent('https://www.instagram.com/hufellow/') + ';end',
    youtube:
      'intent://www.youtube.com/@hufellow#Intent;scheme=https;package=com.google.android.youtube;' +
      'S.browser_fallback_url=' + encodeURIComponent('https://www.youtube.com/@hufellow') + ';end',
    tiktok:
      'intent://www.tiktok.com/@hufellow#Intent;scheme=https;package=com.zhiliaoapp.musically;' +
      'S.browser_fallback_url=' + encodeURIComponent('https://www.tiktok.com/@hufellow') + ';end'
  };

  var isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    document.querySelectorAll('a[data-app]').forEach(function (link) {
      var intent = ANDROID_INTENTS[link.getAttribute('data-app')];
      if (!intent) { return; }
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = intent;
      });
    });
  }
})();
