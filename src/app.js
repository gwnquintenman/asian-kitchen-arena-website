// Asian Kitchen Arena – kleine verbeteringen bovenop de gewone pagina.
// Zonder JavaScript werkt alles ook: dan staat het hele menu onder elkaar.
(function () {
  'use strict';

  var data = JSON.parse(document.getElementById('pagina-data').textContent);

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

  // ---------- vloeiend scrollen naar een onderdeel van de pagina ----------
  var minderBeweging = window.matchMedia('(prefers-reduced-motion: reduce)');

  // cubic-bezier(0.77, 0, 0.175, 1): de ease-in-out uit de Website Kit voor beweging over het scherm
  function bezier(x1, y1, x2, y2) {
    function punt(t, p1, p2) {
      return 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
    }
    return function (x) {
      var laag = 0;
      var hoog = 1;
      var t = x;
      for (var i = 0; i < 24; i++) {
        t = (laag + hoog) / 2;
        if (punt(t, x1, x2) < x) laag = t;
        else hoog = t;
      }
      return punt(t, y1, y2);
    };
  }
  var vloeiend = bezier(0.77, 0, 0.175, 1);
  var scrollAnim = null;

  function stopScroll() {
    if (scrollAnim) cancelAnimationFrame(scrollAnim);
    scrollAnim = null;
  }
  // wie zelf gaat scrollen, neemt het over
  ['wheel', 'touchstart', 'keydown'].forEach(function (type) {
    window.addEventListener(type, stopScroll, { passive: true });
  });

  function scrollNaar(doel) {
    stopScroll();
    var marge = parseFloat(getComputedStyle(doel).scrollMarginTop) || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var eind = Math.max(0, Math.min(max, doel.getBoundingClientRect().top + window.scrollY - marge));
    var start = window.scrollY;
    var afstand = eind - start;
    if (minderBeweging.matches || Math.abs(afstand) < 2) {
      window.scrollTo(0, eind);
      return;
    }
    var duur = Math.min(1200, Math.max(650, Math.abs(afstand) * 0.5));
    var begin = null;
    function stap(nu) {
      if (begin === null) begin = nu;
      var p = Math.min(1, (nu - begin) / duur);
      window.scrollTo(0, start + afstand * vloeiend(p));
      scrollAnim = p < 1 ? requestAnimationFrame(stap) : null;
    }
    scrollAnim = requestAnimationFrame(stap);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href');
    var doel = hash.length > 1 && document.getElementById(hash.slice(1));
    if (!doel) return;
    if (doel.closest('.paneel') || doel.tagName === 'DETAILS') {
      e.preventDefault();
      history.pushState(null, '', hash);
      volgHash(hash, true);
    } else if (doel.matches('main > section') && !a.classList.contains('overslaan')) {
      // hele onderdelen (menu, afhalen, tijden, goed om te weten): vloeiend naar beneden
      e.preventDefault();
      history.pushState(null, '', hash);
      doel.setAttribute('tabindex', '-1');
      doel.focus({ preventScroll: true });
      scrollNaar(doel);
    }
  });
  window.addEventListener('hashchange', function () {
    volgHash(location.hash, true);
  });
  volgHash(location.hash, true);

  // ---------- foto's bewegen mee met het scrollen ----------
  // Bovenaan waaieren de gerechten uit elkaar: nr. 40 (boven) gaat het snelst omhoog, het bord (midden) minder,
  // nr. 39 (onder) het minst. Zo wordt de ruimte ertussen groter in plaats van dat ze over elkaar schuiven.
  // Het bord draait langzaam. We meten de houder (die zelf niet beweegt) en zetten alleen 'transform'.
  // px / draai = verschuiving en graden per schermhoogte gescrold. Bij het laden staat alles op 0.
  var lagen = [];
  var heroFotos = document.querySelector('.hero__fotos');
  if (heroFotos) {
    [
      // selector, px (breed scherm), px (smal scherm), draai, draai van alleen de foto (het bord draait, het
      // Nr.-rondje niet). Op een smal scherm staan de foto's ONDER de tekst: daar gaat niets omhoog
      // (dan zou het over de tekst schuiven); het bord en nr. 39 blijven juist iets achter, ook uit elkaar.
      ['.hf--40', 150, 0, -5, 0],
      ['.hf--22', 85, -12, 0, 18],
      ['.hf--39', 25, -35, 5, 0],
    ].forEach(function (l) {
      var el = heroFotos.querySelector(l[0]);
      if (el) lagen.push({ el: el, houder: heroFotos, px: l[1], pxSmal: l[2], draai: l[3], img: l[4] ? el.querySelector('img') : null, imgDraai: l[4] });
    });
  }

  // positie van een houder t.o.v. het midden van het scherm: 0 = midden, 1 = onderkant, -1 = bovenkant
  function stand(r, vh) {
    return (r.top + r.height / 2 - vh / 2) / vh;
  }
  function beginStand() {
    // waar elke houder stond toen de pagina bovenaan stond (dan is de verschuiving 0)
    var vh = window.innerHeight;
    lagen.forEach(function (l) {
      var r = l.houder.getBoundingClientRect();
      l.d0 = Math.min(1, stand({ top: r.top + window.scrollY, height: r.height }, vh));
    });
  }

  // Afhalen: het bakje schuift tijdens het scrollen van links (buiten beeld) naar zijn plek, licht gekanteld,
  // en staat recht zodra het midden in beeld is. Terug scrollen = terug naar links.
  var bakje = document.querySelector('.afhalen__foto');
  function paginaBoven(el) {
    // positie op de pagina zonder transform (offsetTop telt een transform niet mee)
    var y = 0;
    for (var e = el; e; e = e.offsetParent) y += e.offsetTop;
    return y;
  }
  function paginaLinks(el) {
    var x = 0;
    for (var e = el; e; e = e.offsetParent) x += e.offsetLeft;
    return x;
  }

  var gepland = false;
  function beweeg() {
    gepland = false;
    if (minderBeweging.matches) return;
    var vh = window.innerHeight;
    var smal = window.innerWidth < 900; // zelfde grens als in styles.css: daaronder staan de foto's onder de tekst
    // eerst alles meten, daarna alles zetten (geen heen-en-weer tussen lezen en schrijven)
    var maten = lagen.map(function (l) {
      return l.houder.getBoundingClientRect();
    });
    var bakjeBoven = bakje ? paginaBoven(bakje) - window.scrollY : 0;
    var bakjeHoog = bakje ? bakje.offsetHeight : 0;
    var bakjeAfstand = bakje ? paginaLinks(bakje) + bakje.offsetWidth + 40 : 0;

    lagen.forEach(function (l, i) {
      var r = maten[i];
      if (r.bottom < -300 || r.top > vh + 300) return;
      var delta = Math.max(-1.5, Math.min(1, stand(r, vh))) - l.d0;
      l.el.style.transform =
        'translate3d(0,' + (delta * (smal ? l.pxSmal : l.px)).toFixed(1) + 'px,0) rotate(' + (delta * l.draai).toFixed(2) + 'deg)';
      if (l.img) l.img.style.transform = 'rotate(' + (delta * l.imgDraai).toFixed(2) + 'deg)';
    });

    if (bakje && bakjeBoven < vh + 100 && bakjeBoven + bakjeHoog > -100) {
      // 0 = bovenkant van het bakje komt net onderin beeld, 1 = midden van het bakje op 35 % van de schermhoogte.
      // Een lange scrollafstand en een zachte curve: het bakje schuift rustig binnen.
      var start = vh;
      var eind = vh * 0.35 - bakjeHoog / 2;
      var p = Math.max(0, Math.min(1, (start - bakjeBoven) / (start - eind)));
      var rest = (1 - p) * (1 - p); // zachte ease-out
      bakje.style.transform =
        'translate3d(' + (-rest * bakjeAfstand).toFixed(1) + 'px,0,0) rotate(' + (-rest * 10).toFixed(2) + 'deg)';
    }
  }
  function plan() {
    if (!gepland) {
      gepland = true;
      requestAnimationFrame(beweeg);
    }
  }
  if (lagen.length || bakje) {
    beginStand();
    window.addEventListener('scroll', plan, { passive: true });
    window.addEventListener('resize', function () {
      beginStand();
      plan();
    });
    // een ander menutabblad maakt de pagina langer of korter: dan staat het bakje ergens anders
    tabs.forEach(function (tab) {
      tab.addEventListener('click', plan);
    });
    beweeg();
  }
  minderBeweging.addEventListener('change', function () {
    if (minderBeweging.matches) {
      lagen.forEach(function (l) {
        l.el.style.transform = '';
        if (l.img) l.img.style.transform = '';
      });
      if (bakje) bakje.style.transform = '';
    } else {
      beweeg();
    }
  });

  // ---------- taalwissel: blijf op dezelfde plek ----------
  document.querySelectorAll('a[hreflang]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (location.hash) a.href = a.href.split('#')[0] + location.hash;
    });
  });
})();
