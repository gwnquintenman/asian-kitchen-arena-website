// Bouwt de website in de map site/ uit content/ en src/.
//   node build.mjs              -> site/ (voor de echte website)
//   node build.mjs --preview    -> zelfde, maar zoekmachines mogen hem niet opnemen
//   node build.mjs --out map    -> naar een andere map bouwen
//   node build.mjs --url https://... -> ander webadres voor zoekmachines en deel-links
// Geen extra pakketten nodig: alleen Node.js.

import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import gegevens from './content/gegevens.mjs';
import teksten from './content/teksten.mjs';
import { categorieen, extras, dranken } from './content/menu.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const PREVIEW = args.includes('--preview');
const outIndex = args.indexOf('--out');
const OUT = path.resolve(ROOT, outIndex >= 0 ? args[outIndex + 1] : 'site');
// --url: ander webadres gebruiken (bijv. voor de preview op GitHub Pages)
const urlIndex = args.indexOf('--url');
if (urlIndex >= 0) gegevens.websiteUrl = args[urlIndex + 1];
const TALEN = ['nl', 'en'];
const DAGEN = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

// ---------- controle van de inhoud ----------

const fouten = [];
const gezien = new Set();
const alleGerechten = categorieen.flatMap((c) => (c.groepen ? c.groepen.flatMap((g) => g.gerechten) : c.gerechten));
for (const g of alleGerechten) {
  const label = `gerecht ${g.nr ?? '(zonder nummer)'}`;
  if (!g.nr) fouten.push(`${label}: nummer ontbreekt`);
  if (gezien.has(g.nr)) fouten.push(`${label}: nummer komt twee keer voor`);
  gezien.add(g.nr);
  if (typeof g.prijs !== 'number' || !(g.prijs > 0)) fouten.push(`${label}: prijs moet een getal zijn, bijv. 13.5`);
  for (const t of TALEN) if (!g.naam?.[t]) fouten.push(`${label}: naam (${t}) ontbreekt`);
  for (const l of g.labels) if (!teksten.labels[l]) fouten.push(`${label}: onbekend label '${l}'`);
  if (g.foto && !existsSync(path.join(ROOT, 'src/images', g.foto))) fouten.push(`${label}: foto ${g.foto} niet gevonden in src/images`);
  if (g.allergenen) for (const a of g.allergenen) if (!teksten.allergenen[a]) fouten.push(`${label}: onbekend allergeen '${a}'`);
}
for (const x of [...extras.vervangen, ...extras.erbij, ...dranken.items]) {
  if (typeof x.prijs !== 'number' || !(x.prijs > 0)) fouten.push(`${x.naam?.nl}: prijs moet een getal zijn`);
}
for (const regel of gegevens.openingstijden) {
  for (const d of regel.dagen) if (!DAGEN.includes(d)) fouten.push(`openingstijden: onbekende dag '${d}'`);
  if (!/^\d\d:\d\d$/.test(regel.open) || !/^\d\d:\d\d$/.test(regel.dicht)) fouten.push('openingstijden: gebruik uu:mm, bijv. 11:30');
}
if (fouten.length) {
  console.error('\nDe website is NIET gebouwd. Los eerst dit op:\n');
  for (const f of fouten) console.error('  - ' + f);
  console.error('');
  process.exit(1);
}

// ---------- hulpjes ----------

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function prijs(p, taal) {
  const s = p.toFixed(2);
  return taal === 'nl' ? `€\u00a0${s.replace('.', ',')}` : `€${s}`;
}

function vul(tekst, waarden = {}) {
  return tekst.replace(/\{(\w+)\}/g, (m, k) => (k in waarden ? waarden[k] : m));
}

const adresRegel = `${gegevens.adres.straat}, ${gegevens.adres.postcode} ${gegevens.adres.plaats}`;
const vast = {
  telefoon: gegevens.telefoon.weergave,
  internationaal: gegevens.telefoon.internationaal,
  straat: gegevens.adres.straat,
  adres: adresRegel,
};
const T = (obj, taal, extra = {}) => vul(obj[taal], { ...vast, ...extra });

// tekst met het telefoonnummer (gewoon of internationaal) als klikbare link
function metBelLink(tekst) {
  let html = esc(tekst);
  for (const nr of [gegevens.telefoon.weergave, gegevens.telefoon.internationaal].map(esc)) {
    html = html.replace(nr, `<a href="${gegevens.telefoon.link}" class="tel">${nr}</a>`);
  }
  return html;
}

function zoektekst(...delen) {
  return delen
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tijdenPerDag() {
  const perDag = {};
  for (const regel of gegevens.openingstijden) for (const d of regel.dagen) perDag[d] = { open: regel.open, dicht: regel.dicht };
  return perDag;
}

function tijdenKort(taal) {
  return gegevens.openingstijden
    .map((r) => {
      const eerste = teksten.dagen[r.dagen[0]][taal].slice(0, 2).toLowerCase();
      const laatste = teksten.dagen[r.dagen.at(-1)][taal].slice(0, 2).toLowerCase();
      const dagen = r.dagen.length > 1 ? `${eerste}–${laatste}` : eerste;
      return `${dagen} ${r.open}–${r.dicht}`;
    })
    .join(' · ');
}

// ---------- iconen (klein, inline) ----------

const icon = {
  tel: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>',
  pijl: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v14m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  peper: '<svg class="i i--peper" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 6.2c1.6.2 3 1.6 3.1 3.4.3 4.6-5.4 11-13.6 11.9-1 .1-1.2-1.1-.3-1.4 5.3-1.9 7.6-6.3 8.4-10.7.3-1.9 1.1-3.4 2.4-3.2z" fill="currentColor"/><path d="M16 6.3c.1-1.6.9-2.9 2.6-3.5" fill="none" stroke="#2f7a3b" stroke-width="1.8" stroke-linecap="round"/></svg>',
  blad: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C9 4 4 9.5 4 16c0 1.4.3 2.6.8 3.6C7 13 11 10 15 8.5c-4 2.3-7 6-8.6 11.2 1 .5 2.1.8 3.4.8C16.5 20.5 20 14 20 4z" fill="currentColor"/></svg>',
  extern: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// ---------- onderdelen van de pagina ----------

function belKnop(taal, klasse = '') {
  return `<a class="btn btn--bel ${klasse}" href="${gegevens.telefoon.link}">${icon.tel}<span>${esc(T(teksten.belKnop, taal))}</span><span class="btn__nr">${esc(gegevens.telefoon.weergave)}</span></a>`;
}

function tags(g, taal) {
  const uit = g.labels.map((l) => {
    const extra = l === 'vegetarisch' ? icon.blad : '';
    return `<span class="tag tag--${l}">${extra}${esc(teksten.labels[l][taal])}</span>`;
  });
  if (g.peper) {
    const pepers = icon.peper.repeat(g.peper);
    uit.push(`<span class="tag tag--peper">${pepers}${esc(teksten.labels['peper' + g.peper][taal])}</span>`);
  }
  return uit.join('');
}

function gerechtHtml(g, taal) {
  const naam = g.naam[taal];
  const ander = g.naam[taal === 'nl' ? 'en' : 'nl'];
  const inhoud = g.inhoud ? g.inhoud[taal] : '';
  const labelTekst = g.labels.map((l) => teksten.labels[l][taal]).join(' ');
  const zoek = zoektekst(naam, ander, inhoud, labelTekst);
  const foto = g.foto
    ? `<img class="dish__foto" src="images/${g.foto}" alt="${esc(T(teksten.menu.fotoAlt, taal, { nr: g.nr, naam }))}" loading="lazy" decoding="async" width="180" height="150">`
    : '';
  const tagHtml = tags(g, taal);
  return `<li class="dish${g.foto ? ' dish--foto' : ''}" id="nr-${esc(g.nr)}" data-nr="${esc(g.nr)}" data-zoek="${esc(zoek)}">
  <p class="dish__nr"><span class="vh">${esc(teksten.menu.nummer[taal])} </span>${esc(g.nr)}</p>
  <div class="dish__main">
    <h4 class="dish__naam">${esc(naam)}</h4>
    ${inhoud ? `<p class="dish__inhoud">${esc(inhoud)}</p>` : ''}
    ${tagHtml ? `<p class="dish__meta">${tagHtml}</p>` : ''}
  </div>
  <div class="dish__zij">
    <p class="dish__prijs">${prijs(g.prijs, taal)}</p>
    <button type="button" class="dish__allergie js-only" data-nr="${esc(g.nr)}" aria-label="${esc(T(teksten.menu.allergieLabel, taal, { nr: g.nr, naam }))}">${esc(teksten.menu.allergieKnop[taal])}</button>
  </div>
  ${foto}
</li>`;
}

function rijstNotitie(c, taal) {
  if (!c.rijstRuilen) return '';
  const p = prijs(extras.vervangen[0].prijs, taal);
  const tekst = Array.isArray(c.rijstRuilen)
    ? T(teksten.menu.rijstRuilenBij, taal, { nrs: c.rijstRuilen.join(', '), prijs: p })
    : T(teksten.menu.rijstRuilen, taal, { prijs: p });
  return `<p class="cat__ruil">${esc(tekst)} <a href="#extras">${esc(teksten.menu.alleExtras[taal])}</a></p>`;
}

function categorieHtml(c, taal) {
  const lijsten = c.groepen
    ? c.groepen
        .map(
          (gr) => `<div class="cat__groep"><h4 class="cat__sub">${esc(gr.titel[taal])}</h4>
<ul class="dishes">${gr.gerechten.map((g) => gerechtHtml(g, taal)).join('\n')}</ul></div>`,
        )
        .join('\n')
    : `<ul class="dishes">${c.gerechten.map((g) => gerechtHtml(g, taal)).join('\n')}</ul>`;
  return `<section class="cat" id="${c.id}" aria-labelledby="h-${c.id}">
<h3 class="cat__titel" id="h-${c.id}">${esc(c.naam[taal])}</h3>
${c.intro ? `<p class="cat__intro">${esc(c.intro[taal])}</p>` : ''}
${rijstNotitie(c, taal)}
${lijsten}
</section>`;
}

function extrasHtml(taal) {
  const e = teksten.extras;
  const rij = (x, plus) =>
    `<li class="extra" data-zoek="${esc(zoektekst(x.naam.nl, x.naam.en))}"><span class="extra__naam">${esc(x.naam[taal])}</span><span class="extra__prijs">${plus ? '+ ' : ''}${prijs(x.prijs, taal)}</span></li>`;
  const p19 = alleGerechten.find((g) => g.nr === '19').prijs;
  const ruil = extras.vervangen[0].prijs;
  const rijst = extras.erbij.find((x) => x.naam.nl === 'Witte rijst').prijs;
  const voorbeelden = e.voorbeelden[taal].map((v) =>
    vul(v, {
      p19: prijs(p19, taal),
      ruil: prijs(ruil, taal),
      rijst: prijs(rijst, taal),
      som1: prijs(p19 + ruil, taal),
      som2: prijs(p19 + rijst, taal),
    }),
  );
  return `<section class="cat cat--extras" id="${extras.id}" aria-labelledby="h-${extras.id}">
<h3 class="cat__titel" id="h-${extras.id}">${esc(extras.naam[taal])}</h3>
<p class="cat__intro">${esc(e.intro[taal])}</p>
<div class="extras">
  <div class="extras__blok extras__blok--ruil">
    <h4 class="extras__titel">${esc(e.vervangenTitel[taal])}</h4>
    <p class="extras__uitleg">${esc(e.vervangenUitleg[taal])}</p>
    <ul class="extras__lijst">${extras.vervangen.map((x) => rij(x, true)).join('')}</ul>
  </div>
  <div class="extras__blok">
    <h4 class="extras__titel">${esc(e.erbijTitel[taal])}</h4>
    <p class="extras__uitleg">${esc(e.erbijUitleg[taal])}</p>
    <ul class="extras__lijst">${extras.erbij.map((x) => rij(x, true)).join('')}</ul>
  </div>
</div>
<div class="extras__voorbeeld">
  <p class="extras__vtitel">${esc(e.voorbeeldTitel[taal])}</p>
  <ul>${voorbeelden.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
</div>
<p class="cat__noot">${esc(e.twijfel[taal])}</p>
</section>`;
}

function drankenHtml(taal) {
  const rij = (d) =>
    `<li class="extra${d.keuzes ? ' extra--groep' : ''}" data-zoek="${esc(zoektekst(d.naam.nl, d.naam.en, d.keuzes?.nl, d.keuzes?.en))}">
  <span class="extra__naam">${esc(d.naam[taal])}${d.keuzes ? `<span class="extra__keuzes">${esc(d.keuzes[taal])}</span>` : ''}</span>
  <span class="extra__prijs">${prijs(d.prijs, taal)}</span></li>`;
  return `<section class="cat cat--dranken" id="${dranken.id}" aria-labelledby="h-${dranken.id}">
<h3 class="cat__titel" id="h-${dranken.id}">${esc(dranken.naam[taal])}</h3>
<ul class="extras__lijst extras__lijst--dranken">${dranken.items.map(rij).join('\n')}</ul>
<p class="cat__noot">${esc(teksten.dranken.alcohol[taal])}</p>
</section>`;
}

function alleCategorieen() {
  // volgorde van het menu op de site
  const [noedels, kip, rund, garnalen, special, vega, noedelsoep, soep, bites] = categorieen;
  return [noedels, kip, rund, garnalen, special, vega, { id: extras.id, naam: extras.naam, type: 'extras' }, noedelsoep, soep, bites, { id: dranken.id, naam: dranken.naam, type: 'dranken' }];
}

function menuHtml(taal) {
  const m = teksten.menu;
  const volgorde = alleCategorieen();
  const chips = volgorde
    .map((c) => `<li><a class="chip" href="#${c.id}" data-cat="${c.id}">${esc(c.naam[taal])}</a></li>`)
    .join('');
  const secties = volgorde
    .map((c) => (c.type === 'extras' ? extrasHtml(taal) : c.type === 'dranken' ? drankenHtml(taal) : categorieHtml(c, taal)))
    .join('\n');
  const pdfPad = taal === 'nl' ? gegevens.menukaartPdf : `../${gegevens.menukaartPdf}`;
  return `<section class="menu" id="menu" aria-labelledby="h-menu">
<div class="wrap">
  <div class="menu__kop">
    <h2 id="h-menu">${esc(m.titel[taal])}</h2>
    <p class="menu__uitleg">${esc(m.uitleg[taal])}</p>
    <p class="menu__allergie">${esc(m.allergie[taal])} <a href="#allergenen">${esc(m.allergieLink[taal])}</a></p>
    <div class="zoek js-only">
      <label class="zoek__label" for="zoek">${esc(m.zoekLabel[taal])}</label>
      <div class="zoek__veld">
        <input id="zoek" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="${esc(m.zoekHint[taal])}" aria-describedby="zoek-status">
        <button type="button" class="zoek__wis" hidden>${esc(m.zoekWis[taal])}</button>
      </div>
      <p class="zoek__status" id="zoek-status" aria-live="polite"></p>
    </div>
  </div>
  <div class="menu__grid">
    <nav class="cats" aria-label="${esc(m.categorieen[taal])}">
      <ul class="cats__lijst">${chips}</ul>
    </nav>
    <div class="menu__inhoud">
      <div class="zoek__geen" hidden><p class="zoek__geen-tekst"></p>${belKnop(taal, 'btn--stapel')}</div>
      ${secties}
      <p class="menu__pdf"><a href="${pdfPad}">${icon.extern}${esc(m.pdf[taal])} (pdf, 3 MB)</a></p>
    </div>
  </div>
</div>
</section>`;
}

function bestellenHtml(taal) {
  const b = teksten.bestellen;
  const stappen = b.stappen[taal]
    .map(([kop, tekst], i) => {
      const kopHtml = i === 1 ? metBelLink(vul(kop, vast)) : esc(vul(kop, vast));
      return `<li class="stap"><span class="stap__nr" aria-hidden="true">${i + 1}</span><p><strong>${kopHtml}</strong> ${esc(vul(tekst, vast))}</p></li>`;
    })
    .join('');
  const buitenland = b.buitenland[taal] ? `<p class="bestel__noot">${metBelLink(T(b.buitenland, taal))}</p>` : '';
  return `<section class="bestel" id="bestellen" aria-labelledby="h-bestellen">
<div class="wrap">
  <h2 id="h-bestellen">${esc(b.titel[taal])}</h2>
  <ol class="stappen">${stappen}</ol>
  <p class="bestel__noot">${esc(b.niet[taal])}</p>
  ${buitenland}
</div>
</section>`;
}

function allergenenHtml(taal) {
  const a = teksten.allergenenSectie;
  const punten = a.punten[taal]
    .map(([kop, tekst]) => `<li><strong>${esc(kop)}</strong> ${metBelLink(vul(tekst, vast))}</li>`)
    .join('');
  return `<section class="info" id="allergenen" aria-labelledby="h-allergenen">
<div class="wrap wrap--smal">
  <h2 id="h-allergenen">${esc(a.titel[taal])}</h2>
  <ul class="info__lijst">${punten}</ul>
  <a class="btn btn--rand" href="${gegevens.telefoon.link}">${icon.tel}<span>${esc(a.belKnop[taal])}: ${esc(gegevens.telefoon.weergave)}</span></a>
</div>
</section>`;
}

function tijdenTabel(taal) {
  const perDag = tijdenPerDag();
  const rijen = DAGEN.map((d) => {
    const t = perDag[d];
    const tijd = t ? `${t.open}–${t.dicht}` : '–';
    const noot = d === 'zo' && gegevens.uitzondering ? `<span class="tijden__noot">${esc(gegevens.uitzondering[taal])}</span>` : '';
    return `<tr data-dag="${d}"><th scope="row">${esc(teksten.dagen[d][taal])}<span class="tijden__vandaag"> (${esc(teksten.ophalen.vandaag[taal])})</span></th><td>${tijd}${noot}</td></tr>`;
  }).join('');
  return `<table class="tijden"><caption class="vh">${esc(teksten.ophalen.tijdenTitel[taal])}</caption><tbody>${rijen}</tbody></table>`;
}

function ophalenHtml(taal) {
  const o = teksten.ophalen;
  return `<section class="ophalen" id="ophalen" aria-labelledby="h-ophalen">
<div class="wrap">
  <h2 id="h-ophalen">${esc(o.titel[taal])}</h2>
  <div class="ophalen__grid">
    <div class="ophalen__blok">
      <h3>${esc(o.adresTitel[taal])}</h3>
      <p class="adres">${esc(gegevens.naam)}<br>${esc(gegevens.adres.straat)}<br>${esc(gegevens.adres.postcode)} ${esc(gegevens.adres.plaats)}${gegevens.adres.voorheen ? `<span class="adres__voorheen">(${esc(gegevens.adres.voorheen[taal])})</span>` : ''}</p>
      <a class="btn btn--rand" href="${gegevens.routeLink}" target="_blank" rel="noopener">${icon.pin}<span>${esc(teksten.routeKnopLang[taal])}</span></a>
      <p class="ophalen__noot">${esc(o.evenement[taal])}</p>
    </div>
    <div class="ophalen__blok">
      <h3>${esc(o.tijdenTitel[taal])}</h3>
      ${tijdenTabel(taal)}
    </div>
    <div class="ophalen__blok">
      <h3>${esc(o.belTitel[taal])}</h3>
      <p class="ophalen__tel"><a href="${gegevens.telefoon.link}" class="tel">${esc(gegevens.telefoon.weergave)}</a></p>
      ${taal === 'en' ? `<p class="ophalen__noot">${metBelLink(T(teksten.bestellen.buitenland, taal))}</p>` : ''}
      <p class="ophalen__noot">${esc(teksten.bestellen.niet[taal])}</p>
    </div>
  </div>
</div>
</section>`;
}

function jsonLd(taal) {
  const dagMap = { ma: 'Monday', di: 'Tuesday', wo: 'Wednesday', do: 'Thursday', vr: 'Friday', za: 'Saturday', zo: 'Sunday' };
  const pagina = taal === 'nl' ? gegevens.websiteUrl : `${gegevens.websiteUrl}en/`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: gegevens.naam,
    url: pagina,
    image: `${gegevens.websiteUrl}images/deelafbeelding.jpg`,
    logo: `${gegevens.websiteUrl}images/icon-512.png`,
    telephone: gegevens.telefoon.internationaal,
    address: {
      '@type': 'PostalAddress',
      streetAddress: gegevens.adres.straat,
      postalCode: gegevens.adres.postcode,
      addressLocality: gegevens.adres.plaats,
      addressCountry: 'NL',
    },
    servesCuisine: ['Asian', 'Chinese'],
    priceRange: '€',
    acceptsReservations: false,
    hasMenu: `${pagina}#menu`,
    openingHoursSpecification: gegevens.openingstijden.map((r) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: r.dagen.map((d) => dagMap[d]),
      opens: r.open,
      closes: r.dicht,
    })),
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function paginaData(taal) {
  // klein beetje data voor app.js: tijden en de allergie-info per gerecht
  const gerechten = {};
  for (const g of alleGerechten) {
    gerechten[g.nr] = { naam: g.naam[taal], allergenen: g.allergenen ? g.allergenen.map((a) => teksten.allergenen[a][taal]) : null };
  }
  const d = teksten.dialoog;
  return JSON.stringify({
    taal,
    tijden: tijdenPerDag(),
    gerechten,
    tekst: {
      onbekend: d.onbekend[taal],
      bekend: d.bekend[taal],
      nummer: taal === 'nl' ? 'Nr.' : 'No.',
      zoekAantal: teksten.menu.zoekAantal[taal],
      zoekEen: teksten.menu.zoekEen[taal],
      zoekGeen: T(teksten.menu.zoekGeen, taal),
      vandaagOpen: teksten.intro.vandaag[taal],
      dicht: taal === 'nl' ? 'gesloten' : 'closed',
    },
  }).replace(/</g, '\\u003c');
}

function pagina(taal) {
  const pre = taal === 'nl' ? '' : '../';
  const anderPad = taal === 'nl' ? 'en/' : '../';
  const ander = taal === 'nl' ? 'en' : 'nl';
  const url = taal === 'nl' ? gegevens.websiteUrl : `${gegevens.websiteUrl}en/`;
  const intro = teksten.intro;
  const feiten = intro.feiten[taal].map((f) => `<li>${esc(f)}</li>`).join('');
  const d = teksten.dialoog;

  return `<!doctype html>
<html lang="${taal}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(teksten.meta.titel[taal])}</title>
<meta name="description" content="${esc(T(teksten.meta.beschrijving, taal))}">
${PREVIEW ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="nl" href="${gegevens.websiteUrl}">
<link rel="alternate" hreflang="en" href="${gegevens.websiteUrl}en/">
<link rel="alternate" hreflang="x-default" href="${gegevens.websiteUrl}">
<meta name="theme-color" content="#cf0a10">
<meta property="og:type" content="restaurant">
<meta property="og:title" content="${esc(gegevens.naam)}">
<meta property="og:description" content="${esc(T(teksten.meta.beschrijving, taal))}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${gegevens.websiteUrl}images/deelafbeelding.jpg">
<meta property="og:locale" content="${taal === 'nl' ? 'nl_NL' : 'en_GB'}">
<link rel="icon" type="image/png" sizes="48x48" href="${pre}images/favicon-48.png">
<link rel="apple-touch-icon" href="${pre}images/apple-touch-icon.png">
<link rel="preload" href="${pre}fonts/barlow-condensed-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${pre}assets/styles.css?v=${versie}">
<script>document.documentElement.classList.replace('no-js','js')</script>
<script type="application/ld+json">${jsonLd(taal)}</script>
</head>
<body>
<a class="overslaan" href="#menu">${esc(teksten.overslaan[taal])}</a>
<header class="kop">
  <div class="wrap kop__in">
    <a class="merk" href="./" aria-label="${esc(gegevens.naam)}">
      <img src="${pre}images/logo-licht.png" alt="" width="66" height="72">
      <span class="merk__naam">Asian Kitchen <span>Arena</span></span>
    </a>
    <nav class="kop__nav" aria-label="${esc(teksten.nav.label[taal])}">
      <a href="#menu">${esc(teksten.nav.menu[taal])}</a>
      <a href="#bestellen">${esc(teksten.nav.bestellen[taal])}</a>
      <a href="#allergenen">${esc(teksten.nav.allergenen[taal])}</a>
      <a href="#ophalen">${esc(teksten.nav.ophalen[taal])}</a>
    </nav>
    <a class="taal" href="${anderPad}" hreflang="${ander}" lang="${ander}" title="${esc(teksten.taalWissel[taal])}"><span class="vh">${esc(teksten.taalWissel[taal])}: </span>${ander.toUpperCase()}</a>
    <a class="kop__bel" href="${gegevens.telefoon.link}">${icon.tel}<span>${esc(gegevens.telefoon.weergave)}</span></a>
  </div>
</header>

<main>
<section class="intro" aria-labelledby="h-intro">
  <div class="wrap intro__in">
    <div class="intro__tekst">
      <h1 id="h-intro">${esc(intro.titel[taal])}</h1>
      <p class="intro__lead">${esc(intro.lead[taal])}</p>
      <div class="intro__knoppen">
        ${belKnop(taal, 'js-belknop')}
        <a class="btn btn--rand" href="#menu"><span>${esc(teksten.menuKnop[taal])}</span>${icon.pijl}</a>
      </div>
      <ul class="intro__feiten">${feiten}</ul>
      <p class="intro__info">
        <span class="intro__tijd" data-vandaag>${esc(tijdenKort(taal))}</span>
        <span class="intro__adres">${esc(gegevens.adres.straat)}, ${esc(gegevens.adres.plaats)} <span class="intro__route">· <a href="${gegevens.routeLink}" target="_blank" rel="noopener">${esc(teksten.routeKnop[taal])}</a></span></span>
      </p>
    </div>
    <img class="intro__foto" src="${pre}images/afhaalbox-760.webp" srcset="${pre}images/afhaalbox-440.webp 440w, ${pre}images/afhaalbox-760.webp 760w" sizes="(min-width: 900px) 380px, 46vw" width="760" height="731" alt="${esc(intro.fotoAlt[taal])}" fetchpriority="high">
  </div>
</section>

${bestellenHtml(taal)}

${menuHtml(taal).replaceAll('src="images/', `src="${pre}images/`)}

${allergenenHtml(taal)}

${ophalenHtml(taal)}
</main>

<footer class="voet">
  <div class="wrap voet__in">
    <img src="${pre}images/logo-donker.png" alt="Asian Kitchen" width="99" height="108" loading="lazy">
    <div class="voet__tekst">
      <p><strong>${esc(gegevens.naam)}</strong><br>${esc(adresRegel)}<br><a href="${gegevens.telefoon.link}" class="tel">${esc(gegevens.telefoon.weergave)}</a></p>
      <p>${esc(tijdenKort(taal))}<br>${esc(gegevens.uitzondering[taal])}</p>
      <p><a href="${pre}${gegevens.menukaartPdf}">${esc(teksten.footer.menukaart[taal])}</a> · <a href="${anderPad}" hreflang="${ander}" lang="${ander}">${esc(teksten.taalNaam[ander])}</a></p>
    </div>
  </div>
</footer>

<div class="belbalk">
  <a href="${gegevens.telefoon.link}">${icon.tel}<span>${esc(teksten.belKnop[taal])}</span><span class="belbalk__nr">${esc(gegevens.telefoon.weergave)}</span></a>
</div>

<dialog class="dialoog" id="allergie-dialoog" aria-labelledby="dialoog-titel">
  <div class="dialoog__in">
    <p class="dialoog__label">${esc(d.titel[taal])}</p>
    <h2 class="dialoog__titel" id="dialoog-titel"></h2>
    <p class="dialoog__status"></p>
    <ul class="dialoog__lijst" hidden></ul>
    <p>${esc(d.advies[taal])}</p>
    <p>${esc(d.kruis[taal])}</p>
    <div class="dialoog__knoppen">
      <a class="btn btn--bel btn--stapel" href="${gegevens.telefoon.link}">${icon.tel}<span>${esc(teksten.allergenenSectie.belKnop[taal])}</span><span class="btn__nr">${esc(gegevens.telefoon.weergave)}</span></a>
      <button type="button" class="btn btn--rand dialoog__sluit">${esc(d.sluiten[taal])}</button>
    </div>
  </div>
</dialog>

<script type="application/json" id="pagina-data">${paginaData(taal)}</script>
<script src="${pre}assets/app.js?v=${versie}" defer></script>
</body>
</html>
`;
}

// ---------- schrijven ----------

const versie = Date.now().toString(36);

await rm(OUT, { recursive: true, force: true });
await mkdir(path.join(OUT, 'en'), { recursive: true });
await mkdir(path.join(OUT, 'assets'), { recursive: true });

await cp(path.join(ROOT, 'src/images'), path.join(OUT, 'images'), { recursive: true });
await cp(path.join(ROOT, 'src/fonts'), path.join(OUT, 'fonts'), { recursive: true });
await cp(path.join(ROOT, 'src/styles.css'), path.join(OUT, 'assets/styles.css'));
await cp(path.join(ROOT, 'src/app.js'), path.join(OUT, 'assets/app.js'));
await cp(path.join(ROOT, 'bron/menukaart-origineel.pdf'), path.join(OUT, gegevens.menukaartPdf));

await writeFile(path.join(OUT, 'index.html'), pagina('nl'));
await writeFile(path.join(OUT, 'en/index.html'), pagina('en'));

await writeFile(
  path.join(OUT, 'robots.txt'),
  PREVIEW ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${gegevens.websiteUrl}sitemap.xml\n`,
);
await writeFile(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${gegevens.websiteUrl}</loc></url>
  <url><loc>${gegevens.websiteUrl}en/</loc></url>
</urlset>
`,
);

const bestanden = await readdir(OUT, { recursive: true });
console.log(`Klaar: ${alleGerechten.length} gerechten, ${extras.vervangen.length + extras.erbij.length} extra's, ${dranken.items.length} drankregels.`);
console.log(`${bestanden.length} bestanden in ${path.relative(ROOT, OUT) || '.'}${PREVIEW ? ' (preview: niet indexeren)' : ''}`);
