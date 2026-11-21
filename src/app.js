// Asian Kitchen Arena – kleine verbeteringen bovenop de gewone pagina.
// Zonder JavaScript werkt alles ook: dan staat het hele menu onder elkaar.
(function () {
  'use strict';

  var data = JSON.parse(document.getElementById('pagina-data').textContent);

  // ---------- foto's bovenaan: één keer rustig binnenkomen ----------
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.documentElement.classList.add('is-klaar');
    });
  });

  // ---------- vandaag (in Amsterdamse tijd) ----------
  var dag;
  try {
    var kort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Amsterdam' }).format(new Date());
    dag = { Sun: 'zo', Mon: 'ma', Tue: 'di', Wed: 'wo', Thu: 'do', Fri: 'vr', Sat: 'za' }[kort];
  } catch (e) {
    dag = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'][new Date().getDay()];
  }
  var rij = document.querySelector('.tijden__tabel tr[data-dag="' + dag + '"]');
  if (rij) rij.classList.add('is-vandaag');
  var vandaagEl = document.querySelector('[data-vandaag]');
  var t = data.tijden[dag];
  if (vandaagEl) vandaagEl.textContent = t ? data.tekst.vandaagOpen + ' ' + t.open + '–' + t.dicht : data.tekst.vandaagDicht;

  // ---------- menu in tabbladen ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panelen = Array.prototype.slice.call(document.querySelectorAll('.paneel'));

  panelen.forEach(function (p) {
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', 'tab-' + p.getAttribute('data-paneel'));
    p.setAttribute('tabindex', '0');
    p.hidden = p.hasAttribute('data-start-verborgen');
  });

  function kies(id, focus) {
    var gevonden = false;
    tabs.forEach(function (tab) {
      var aan = tab.id === 'tab-' + id;
      if (aan) gevonden = true;
      tab.setAttribute('aria-selected', aan ? 'true' : 'false');
      tab.tabIndex = aan ? 0 : -1;
      if (aan && focus) tab.focus();
      if (aan) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    if (!gevonden) return false;
    panelen.forEach(function (p) {
      p.hidden = p.getAttribute('data-paneel') !== id;
    });
    return true;
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      kies(tab.id.replace('tab-', ''));
    });
    tab.addEventListener('keydown', function (e) {
      var doel = null;
      if (e.key === 'ArrowRight') doel = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') doel = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') doel = tabs[0];
      else if (e.key === 'End') doel = tabs[tabs.length - 1];
      if (doel) {
        e.preventDefault();
        kies(doel.id.replace('tab-', ''), true);
      }
    });
  });

  // ---------- links naar een categorie, gerecht of vraag ----------
  function volgHash(hash, scroll) {
    if (!hash || hash.length < 2) return;
    var doel = document.getElementById(hash.slice(1));
    if (!doel) return;
    var paneel = doel.closest('.paneel');
    if (paneel) {
      kies(paneel.getAttribute('data-paneel'));
      if (scroll) (doel === paneel ? document.querySelector('.tabs') : doel).scrollIntoView({ block: 'start' });
    }
    if (doel.tagName === 'DETAILS') {
      doel.open = true;
      if (scroll) doel.scrollIntoView({ block: 'start' });
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href');
    var doel = hash.length > 1 && document.getElementById(hash.slice(1));
    if (doel && (doel.closest('.paneel') || doel.tagName === 'DETAILS')) {
      e.preventDefault();
      history.pushState(null, '', hash);
      volgHash(hash, true);
    }
  });
  window.addEventListener('hashchange', function () {
    volgHash(location.hash, true);
  });
  volgHash(location.hash, true);

  // ---------- taalwissel: blijf op dezelfde plek ----------
  document.querySelectorAll('a[hreflang]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (location.hash) a.href = a.href.split('#')[0] + location.hash;
    });
  });
})();
