// Asian Kitchen Arena – kleine verbeteringen bovenop de gewone pagina.
// Zonder JavaScript werkt alles ook; dan ontbreken alleen zoeken en het allergie-venster.
(function () {
  'use strict';

  var data = JSON.parse(document.getElementById('pagina-data').textContent);
  var tekst = data.tekst;
  var DAGEN = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

  // ---------- vandaag (in Amsterdamse tijd) ----------
  function vandaag() {
    try {
      var kort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Amsterdam' }).format(new Date());
      return { Sun: 'zo', Mon: 'ma', Tue: 'di', Wed: 'wo', Thu: 'do', Fri: 'vr', Sat: 'za' }[kort];
    } catch (e) {
      return DAGEN[new Date().getDay()];
    }
  }
  var dag = vandaag();
  var rij = document.querySelector('.tijden tr[data-dag="' + dag + '"]');
  if (rij) rij.classList.add('is-vandaag');
  var vandaagEl = document.querySelector('[data-vandaag]');
  if (vandaagEl) {
    var t = data.tijden[dag];
    vandaagEl.textContent = tekst.vandaagOpen + ': ' + (t ? t.open + '–' + t.dicht : tekst.dicht);
  }

  // ---------- belbalk: verbergen zolang de grote belknop in beeld is ----------
  var belbalk = document.querySelector('.belbalk');
  var belknop = document.querySelector('.js-belknop');
  if (belbalk && belknop && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      belbalk.classList.toggle('is-verborgen', entries[0].isIntersecting);
    }).observe(belknop);
  }

  // ---------- taalwissel: blijf op dezelfde plek ----------
  document.querySelectorAll('a[hreflang]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (location.hash) a.href = a.href.split('#')[0] + location.hash;
    });
  });

  // ---------- categorie-navigatie ----------
  var cats = document.querySelector('.cats');
  var catLijst = document.querySelector('.cats__lijst');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var secties = Array.prototype.slice.call(document.querySelectorAll('.cat'));

  function zetHoogte() {
    var vast = cats && getComputedStyle(cats).position === 'sticky' && cats.offsetWidth > 0 && window.innerWidth < 900;
    document.documentElement.style.setProperty('--cats-hoogte', vast ? cats.offsetHeight + 'px' : '0px');
  }
  zetHoogte();
  window.addEventListener('resize', zetHoogte);

  function markeer(id) {
    chips.forEach(function (c) {
      var aan = c.getAttribute('data-cat') === id;
      if (aan) {
        c.setAttribute('aria-current', 'true');
        if (catLijst.scrollWidth > catLijst.clientWidth) {
          var doel = c.offsetLeft - (catLijst.clientWidth - c.offsetWidth) / 2;
          catLijst.scrollTo({ left: Math.max(0, doel), behavior: 'auto' });
        }
      } else {
        c.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var zichtbaar = {};
    var spion = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          zichtbaar[e.target.id] = e.isIntersecting;
        });
        for (var i = 0; i < secties.length; i++) {
          if (zichtbaar[secties[i].id] && !secties[i].hidden) {
            markeer(secties[i].id);
            return;
          }
        }
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    secties.forEach(function (s) {
      spion.observe(s);
    });
  }

  // ---------- zoeken ----------
  var zoek = document.getElementById('zoek');
  var wis = document.querySelector('.zoek__wis');
  var status = document.getElementById('zoek-status');
  var geen = document.querySelector('.zoek__geen');
  var menuInhoud = document.querySelector('.menu__inhoud');
  var rijen = Array.prototype.slice.call(document.querySelectorAll('.menu [data-zoek]'));

  function normaal(s) {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function past(el, q, woorden, alleenNummer) {
    var nr = el.getAttribute('data-nr');
    if (alleenNummer) return !!nr && nr.indexOf(q) === 0;
    var hooi = el.getAttribute('data-zoek') + (nr ? ' ' + nr : '');
    return woorden.every(function (w) {
      return hooi.indexOf(w) !== -1;
    });
  }

  function filter() {
    var q = normaal(zoek.value).replace(/^(nr|no|nummer|number)\s*/, '');
    var actief = q.length > 0;
    var alleenNummer = /^\d+[a-z]?$/.test(q);
    var woorden = q.split(' ');
    var aantal = 0;

    rijen.forEach(function (el) {
      var ok = !actief || past(el, q, woorden, alleenNummer);
      el.hidden = !ok;
      if (ok && actief) aantal++;
    });
    // lege groepen en categorieën verbergen
    document.querySelectorAll('.cat__groep, .extras__blok').forEach(function (g) {
      g.hidden = actief && !g.querySelector('[data-zoek]:not([hidden])');
    });
    secties.forEach(function (s) {
      var leeg = actief && !s.querySelector('[data-zoek]:not([hidden])');
      s.hidden = leeg;
      var chip = document.querySelector('.chip[data-cat="' + s.id + '"]');
      if (chip) chip.parentNode.hidden = leeg;
    });
    menuInhoud.classList.toggle('zoekt', actief);
    wis.hidden = !actief;

    if (!actief) {
      status.textContent = '';
      geen.hidden = true;
    } else if (aantal === 0) {
      status.textContent = '';
      geen.querySelector('.zoek__geen-tekst').textContent = tekst.zoekGeen.replace('{q}', zoek.value.trim());
      geen.hidden = false;
    } else {
      status.textContent = aantal === 1 ? tekst.zoekEen : tekst.zoekAantal.replace('{n}', aantal);
      geen.hidden = true;
    }
  }

  if (zoek) {
    zoek.addEventListener('input', filter);
    zoek.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && zoek.value) {
        e.preventDefault();
        zoek.value = '';
        filter();
      }
    });
    wis.addEventListener('click', function () {
      zoek.value = '';
      filter();
      zoek.focus();
    });
    if (zoek.value) filter();
  }

  // ---------- allergie-venster ----------
  var dialoog = document.getElementById('allergie-dialoog');
  var laatsteKnop = null;

  function openAllergie(nr, knop) {
    var g = data.gerechten[nr];
    if (!g || !dialoog) return;
    dialoog.querySelector('.dialoog__titel').textContent = tekst.nummer + ' ' + nr + ' · ' + g.naam;
    var statusEl = dialoog.querySelector('.dialoog__status');
    var lijst = dialoog.querySelector('.dialoog__lijst');
    lijst.innerHTML = '';
    if (g.allergenen && g.allergenen.length) {
      statusEl.textContent = tekst.bekend;
      g.allergenen.forEach(function (a) {
        var li = document.createElement('li');
        li.textContent = a;
        lijst.appendChild(li);
      });
      lijst.hidden = false;
    } else {
      statusEl.textContent = tekst.onbekend;
      lijst.hidden = true;
    }
    laatsteKnop = knop;
    if (typeof dialoog.showModal === 'function') {
      dialoog.showModal();
      dialoog.querySelector('.dialoog__sluit').focus();
    } else {
      // heel oude browsers: val terug op de uitleg verderop de pagina
      location.hash = '#allergenen';
    }
  }

  document.addEventListener('click', function (e) {
    var knop = e.target.closest('.dish__allergie');
    if (knop) openAllergie(knop.getAttribute('data-nr'), knop);
  });

  if (dialoog) {
    dialoog.querySelector('.dialoog__sluit').addEventListener('click', function () {
      dialoog.close();
    });
    // klik op de donkere achtergrond sluit het venster
    dialoog.addEventListener('click', function (e) {
      if (e.target === dialoog) dialoog.close();
    });
    dialoog.addEventListener('close', function () {
      if (laatsteKnop) laatsteKnop.focus();
    });
  }
})();
