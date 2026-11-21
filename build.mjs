// Bouwt de website in de map site/ uit content/ en src/.
//   node build.mjs                    -> site/ (voor de echte website)
//   node build.mjs --preview          -> zelfde, maar zoekmachines mogen hem niet opnemen
//   node build.mjs --out map          -> naar een andere map bouwen
//   node build.mjs --url https://...  -> ander webadres voor zoekmachines en deel-links
// Geen extra pakketten nodig: alleen Node.js.

import { writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import gegevens from './content/gegevens.mjs';
import teksten from './content/teksten.mjs';
import { categorieen, alleGerechten } from './content/menu.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const PREVIEW = args.includes('--preview');
const argWaarde = (naam) => (args.includes(naam) ? args[args.indexOf(naam) + 1] : null);
const OUT = path.resolve(ROOT, argWaarde('--out') ?? 'site');
if (argWaarde('--url')) gegevens.websiteUrl = argWaarde('--url');
const TALEN = ['nl', 'en'];
const DAGEN = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

// ---------- controle van de inhoud ----------

const fouten = [];
const gezien = new Set();
for (const g of alleGerechten('nl')) {
  const label = `gerecht ${g.nr ?? '(zonder nummer)'}`;
  if (!g.nr) fouten.push(`${label}: nummer ontbreekt`);
  if (gezien.has(g.nr)) fouten.push(`${label}: nummer komt twee keer voor`);
  gezien.add(g.nr);
  if (typeof g.prijs !== 'number' || !(g.prijs > 0)) fouten.push(`${label}: prijs moet een getal zijn, bijv. 13.5`);
  for (const l of g.labels) if (!teksten.labels[l]) fouten.push(`${label}: onbekend label '${l}'`);
  if (g.foto && !existsSync(path.join(ROOT, 'src/images', g.foto))) fouten.push(`${label}: foto ${g.foto} niet gevonden`);
  if (g.allergenen) for (const a of g.allergenen) if (!teksten.allergenen[a]) fouten.push(`${label}: onbekend allergeen '${a}'`);
}
for (const c of categorieen) {
  for (const t of TALEN) if (!c.naam?.[t]) fouten.push(`categorie ${c.id}: naam (${t}) ontbreekt`);
  const prijzen = c.soort === 'extras' ? [...c.vervangen, ...c.erbij] : c.soort === 'dranken' ? c.items : [];
  for (const x of prijzen) if (typeof x.prijs !== 'number' || !(x.prijs > 0)) fouten.push(`${c.id} / ${x.naam?.nl}: prijs moet een getal zijn`);
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

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function prijs(p, taal) {
  const s = p.toFixed(2);
  return taal === 'nl' ? `€\u00a0${s.replace('.', ',')}` : `€${s}`;
}

const vul = (tekst, waarden = {}) => tekst.replace(/\{(\w+)\}/g, (m, k) => (k in waarden ? waarden[k] : m));

const adresRegel = `${gegevens.adres.straat}, ${gegevens.adres.postcode} ${gegevens.adres.plaats}`;
const vast = {
  telefoon: gegevens.telefoon.weergave,
  internationaal: gegevens.telefoon.internationaal,
  straat: gegevens.adres.straat,
  adres: adresRegel,
};
const T = (obj, taal, extra = {}) => vul(obj[taal], { ...vast, ...extra });

// tekst (al ingevuld) met het telefoonnummer als klikbare link
function metBelLink(tekst) {
  let html = esc(tekst);
  for (const nr of [gegevens.telefoon.weergave, gegevens.telefoon.internationaal].map(esc)) {
    html = html.replace(nr, `<a href="${gegevens.telefoon.link}" class="tel">${nr}</a>`);
  }
  return html;
}

function tijdenPerDag() {
  const perDag = {};
  for (const regel of gegevens.openingstijden) for (const d of regel.dagen) perDag[d] = { open: regel.open, dicht: regel.dicht };
  return perDag;
}

function tijdenKort(taal) {
  return gegevens.openingstijden
    .map((r) => {
      const kort = (d) => teksten.dagen[d][taal].slice(0, 2).toLowerCase();
      const dagen = r.dagen.length > 1 ? `${kort(r.dagen[0])}–${kort(r.dagen.at(-1))}` : kort(r.dagen[0]);
      return `${dagen} ${r.open}–${r.dicht}`;
    })
    .join(' · ');
}

// ---------- iconen (klein, inline, één stijl) ----------

const icon = {
  tel: '<svg class="i i--tel" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>',
  pin: '<svg class="i i--pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>',
  pijl: '<svg class="i i--pijl" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v14m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  peper: '<svg class="i i--peper" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 6.2c1.6.2 3 1.6 3.1 3.4.3 4.6-5.4 11-13.6 11.9-1 .1-1.2-1.1-.3-1.4 5.3-1.9 7.6-6.3 8.4-10.7.3-1.9 1.1-3.4 2.4-3.2z" fill="currentColor"/><path d="M16 6.3c.1-1.6.9-2.9 2.6-3.5" fill="none" stroke="#2f7a3b" stroke-width="1.8" stroke-linecap="round"/></svg>',
  blad: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C9 4 4 9.5 4 16c0 1.4.3 2.6.8 3.6C7 13 11 10 15 8.5c-4 2.3-7 6-8.6 11.2 1 .5 2.1.8 3.4.8C16.5 20.5 20 14 20 4z" fill="currentColor"/></svg>',
  halal: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="m8 12.3 2.6 2.6L16.2 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg class="i i--plus"viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
};

// label = tekst + eigen kleur + eigen icoon (nooit alleen kleur)
const labelIcoon = { 'halal-kip': () => icon.halal, vegetarisch: () => icon.blad, varkensvlees: () => '' };

function tag(l, taal) {
  return `<span class="tag tag--${l}">${labelIcoon[l]()}${esc(teksten.labels[l][taal])}</span>`;
}
function pepertag(n, taal) {
  return `<span class="tag tag--peper">${icon.peper.repeat(n)}${esc(teksten.labels['peper' + n][taal])}</span>`;
}

function tags(labels, peper, taal) {
  const uit = labels.map((l) => tag(l, taal));
  if (peper) uit.push(pepertag(peper, taal));
  return uit.join('');
}

// uitleg van de labels, boven het menu
function legendaHtml(taal) {
  const L = teksten.menu.legenda;
  const items = [
    [tag('halal-kip', taal), L.halal[taal]],
    [tag('vegetarisch', taal), L.vegetarisch[taal]],
    [pepertag(1, taal) + ' ' + pepertag(2, taal), L.pittig[taal]],
    [tag('varkensvlees', taal), L.varkensvlees[taal]],
  ];
  return `<ul class="legenda" aria-label="${esc(L.titel[taal])}">${items
    .map(([t, uitleg]) => `<li><span class="legenda__tags">${t}</span><span class="legenda__uitleg">${esc(uitleg)}</span></li>`)
    .join('')}</ul>`;
}

// ---------- menu: onderdelen ----------

function rijstNotitie(c, taal) {
  if (!c.rijstRuilen) return '';
  const extras = categorieen.find((x) => x.id === 'extras');
  const p = prijs(extras.vervangen[0].prijs, taal);
  const tekst = Array.isArray(c.rijstRuilen)
    ? T(teksten.menu.rijstRuilenBij, taal, { nrs: c.rijstRuilen.join(', '), prijs: p })
    : T(teksten.menu.rijstRuilen, taal, { prijs: p });
  return `<p class="paneel__noot">${esc(tekst)} <a href="#paneel-extras" data-naar-paneel="extras">${esc(teksten.menu.alleExtras[taal])}</a></p>`;
}

function foto(bestand, nr, naam, taal, klasse = '') {
  return `<figure class="gerechtfoto ${klasse}">
  <img src="images/${bestand}" alt="${esc(T(teksten.menu.fotoAlt, taal, { nr, naam }))}" loading="lazy" decoding="async" width="360" height="300">
  <span class="badge" aria-hidden="true"><small>${esc(teksten.menu.nummer[taal])}</small>${esc(nr)}</span>
</figure>`;
}

function rijHtml(g, taal) {
  const naam = g.naam[taal];
  const inhoud = g.inhoud ? `<p class="rij__inhoud">${esc(g.inhoud[taal])}</p>` : '';
  const tagHtml = tags(g.labels, g.peper, taal);
  const allergenen = g.allergenen
    ? `<p class="rij__allergenen">${esc(teksten.menu.allergenenLabel[taal])}: ${g.allergenen.map((a) => esc(teksten.allergenen[a][taal])).join(', ')}</p>`
    : '';
  const fotoHtml = g.foto ? foto(g.foto, g.nr, naam, taal, 'gerechtfoto--rij') : '';
  return `<li class="gerecht rij${g.foto ? ' rij--foto' : ''}" id="nr-${esc(g.nr)}" data-nr="${esc(g.nr)}" data-prijs="${g.prijs}" data-peper="${g.peper}" data-labels="${g.labels.join(' ')}">
  <span class="rij__nr"><span class="vh">${esc(teksten.menu.nummer[taal])} </span>${esc(g.nr)}</span>
  <div class="rij__tekst">
    <p class="rij__kop"><span class="rij__naam">${esc(naam)}</span><span class="rij__stip" aria-hidden="true"></span><span class="rij__prijs">${prijs(g.prijs, taal)}</span></p>
    ${inhoud}${tagHtml ? `<p class="rij__tags">${tagHtml}</p>` : ''}${allergenen}
  </div>
  ${fotoHtml}
</li>`;
}

function lijstHtml(c, taal) {
  if (c.groepen) {
    return c.groepen
      .map(
        (gr) => `<div class="groep">
<h4 class="groep__titel">${esc(gr.titel[taal])}</h4>
<ul class="lijst">${gr.gerechten.map((g) => rijHtml(g, taal)).join('\n')}</ul>
${gr.noot ? `<p class="paneel__noot">${esc(gr.noot[taal])}</p>` : ''}
</div>`,
      )
      .join('\n');
  }
  return `<ul class="lijst">${c.gerechten.map((g) => rijHtml(g, taal)).join('\n')}</ul>`;
}

function extrasHtml(c, taal) {
  const e = teksten.extras;
  const rij = (x) =>
    `<li class="extra"><span class="extra__naam">${esc(x.naam[taal])}</span><span class="rij__stip" aria-hidden="true"></span><span class="extra__prijs">+ ${prijs(x.prijs, taal)}</span></li>`;
  const p19 = alleGerechten(taal).find((g) => g.nr === '19').prijs;
  const ruil = c.vervangen[0].prijs;
  const rijst = c.erbij.find((x) => x.sleutel === 'witte-rijst').prijs;
  const voorbeelden = e.voorbeelden[taal].map((v) =>
    vul(v, {
      p19: prijs(p19, taal),
      ruil: prijs(ruil, taal),
      rijst: prijs(rijst, taal),
      som1: prijs(p19 + ruil, taal),
      som2: prijs(p19 + rijst, taal),
    }),
  );
  return `<p class="paneel__intro">${esc(e.intro[taal])}</p>
<div class="extras">
  <div class="extras__blok extras__blok--ruil">
    <h4 class="extras__titel">${esc(e.vervangenTitel[taal])}</h4>
    <p class="extras__uitleg">${esc(e.vervangenUitleg[taal])}</p>
    <ul class="extras__lijst">${c.vervangen.map(rij).join('')}</ul>
  </div>
  <div class="extras__blok">
    <h4 class="extras__titel">${esc(e.erbijTitel[taal])}</h4>
    <p class="extras__uitleg">${esc(e.erbijUitleg[taal])}</p>
    <ul class="extras__lijst">${c.erbij.map(rij).join('')}</ul>
  </div>
</div>
<div class="som">
  <p class="som__titel">${esc(e.voorbeeldTitel[taal])}</p>
  <ul>${voorbeelden.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
</div>
<p class="paneel__noot">${esc(e.twijfel[taal])}</p>`;
}

function drankenHtml(c, taal) {
  const rij = (d) => `<li class="extra${d.keuzes ? ' extra--groep' : ''}">
  <span class="extra__naam">${esc(d.naam[taal])}${d.keuzes ? `<span class="extra__keuzes">${esc(d.keuzes[taal])}</span>` : ''}</span>
  <span class="rij__stip" aria-hidden="true"></span><span class="extra__prijs">${prijs(d.prijs, taal)}</span></li>`;
  return `<ul class="extras__lijst extras__lijst--dranken">${c.items.map(rij).join('\n')}</ul>
<p class="paneel__noot">${esc(teksten.dranken.alcohol[taal])}</p>`;
}

function paneelHtml(c, taal, i) {
  const inhoud =
    c.soort === 'lijst' ? lijstHtml(c, taal) : c.soort === 'extras' ? extrasHtml(c, taal) : drankenHtml(c, taal);
  const intro = c.intro ? `<p class="paneel__intro">${esc(c.intro[taal])}</p>` : '';
  return `<section class="paneel paneel--${c.soort}" id="paneel-${c.id}" data-paneel="${c.id}" aria-labelledby="titel-${c.id}"${i === 0 ? '' : ' data-start-verborgen'}>
<h3 class="paneel__titel" id="titel-${c.id}">${esc(c.naam[taal])}</h3>
${intro}
${rijstNotitie(c, taal)}
${inhoud}
</section>`;
}

// ---------- secties ----------

function heroHtml(taal) {
  const h = teksten.hero;
  const feiten = h.feiten[taal].map((f) => `<li>${esc(f)}</li>`).join('');
  const fotos = [
    ['40', 'nr-40-groot.webp', 661, 526],
    ['22', 'nr-22-groot.webp', 637, 652],
    ['39', 'nr-39-groot.webp', 768, 465],
  ]
    .map(
      ([nr, bestand, w, hgt]) => `<figure class="hf hf--${nr}">
  <img src="images/${bestand}" alt="" width="${w}" height="${hgt}" decoding="async"${nr === '22' ? ' fetchpriority="high"' : ''}>
  <span class="badge" aria-hidden="true"><small>${esc(teksten.menu.nummer[taal])}</small>${nr}</span>
</figure>`,
    )
    .join('\n');
  return `<section class="hero" aria-labelledby="h-hero">
<div class="wrap hero__in">
  <div class="hero__tekst">
    <p class="hero__plaats">${esc(T(h.plaats, taal))}</p>
    <h1 id="h-hero">${esc(h.titel[taal])}</h1>
    <p class="hero__lead">${esc(h.lead[taal])}</p>
    <div class="knoppen">
      <a class="knop veeg knop--rood" href="#menu">${esc(h.menuKnop[taal])}${icon.pijl}</a>
      <a class="knop veeg knop--lijn" href="${gegevens.telefoon.link}">${icon.tel}${esc(T(h.belKnop, taal))}</a>
    </div>
    <ul class="hero__feiten">${feiten}</ul>
    <p class="hero__vandaag"><span data-vandaag>${esc(tijdenKort(taal))}</span> <span class="hero__route">· <a href="${gegevens.routeLink}" target="_blank" rel="noopener">${esc(h.route[taal])}</a></span></p>
  </div>
  <div class="hero__fotos" role="img" aria-label="${esc(h.fotoAlt[taal])}">
${fotos}
  </div>
</div>
</section>`;
}

function menuHtml(taal) {
  const m = teksten.menu;
  const tabs = categorieen
    .map(
      (c, i) =>
        `<button type="button" class="tab" role="tab" id="tab-${c.id}" aria-controls="paneel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(c.naam[taal])}</button>`,
    )
    .join('');
  return `<section class="menu" id="menu" aria-labelledby="h-menu">
<div class="wrap">
  <div class="sectiekop">
    <h2 id="h-menu">${esc(m.titel[taal])}</h2>
    <p class="sectiekop__tekst">${esc(m.uitleg[taal])}</p>
    <p class="menu__meta">${esc(m.allergie[taal])} <a href="#vraag-allergie">${esc(m.allergieLink[taal])}</a></p>
    ${legendaHtml(taal)}
  </div>
  <div class="tabs js-only" role="tablist" aria-label="${esc(m.tabsLabel[taal])}">${tabs}</div>
  <div class="panelen">
${categorieen.map((c, i) => paneelHtml(c, taal, i)).join('\n')}
  </div>
</div>
</section>`;
}

function afhalenHtml(taal) {
  const a = teksten.afhalen;
  const stappen = a.stappen[taal].map((s, i) => `<li><span class="stap__nr" aria-hidden="true">${i + 1}</span><p>${metBelLink(vul(s, vast))}</p></li>`).join('');
  const buitenland = a.buitenland[taal] ? `<p class="afhalen__noot">${metBelLink(T(a.buitenland, taal))}</p>` : '';
  return `<section class="afhalen" id="afhalen" aria-labelledby="h-afhalen">
<div class="wrap afhalen__in">
  <img class="afhalen__foto" src="images/afhaalbox-760.webp" srcset="images/afhaalbox-440.webp 440w, images/afhaalbox-760.webp 760w" sizes="(min-width: 900px) 420px, 80vw" width="760" height="731" alt="${esc(a.fotoAlt[taal])}" loading="lazy" decoding="async">
  <div class="afhalen__tekst">
    <h2 id="h-afhalen">${esc(a.titel[taal])}</h2>
    <p class="sectiekop__tekst">${esc(a.intro[taal])}</p>
    <ol class="stappen">${stappen}</ol>
    <p class="afhalen__noot">${esc(a.evenement[taal])}</p>
    ${buitenland}
    <a class="knop veeg knop--rood" href="${gegevens.telefoon.link}">${icon.tel}${esc(T(a.belKnop, taal))}</a>
  </div>
</div>
</section>`;
}

function tijdenHtml(taal) {
  const t = teksten.tijden;
  const perDag = tijdenPerDag();
  const rijen = DAGEN.map((d) => {
    const x = perDag[d];
    const noot = d === 'zo' && gegevens.uitzondering ? `<span class="tijden__noot">${esc(gegevens.uitzondering[taal])}</span>` : '';
    return `<tr data-dag="${d}"><th scope="row">${esc(teksten.dagen[d][taal])}<span class="tijden__vandaag"> · ${esc(t.vandaag[taal])}</span></th><td>${x ? `${x.open}–${x.dicht}` : '–'}${noot}</td></tr>`;
  }).join('');
  const voorheen = gegevens.adres.voorheen ? `<span class="adres__voorheen">(${esc(gegevens.adres.voorheen[taal])})</span>` : '';
  return `<section class="tijden" id="tijden" aria-labelledby="h-tijden">
<div class="wrap">
  <h2 id="h-tijden">${esc(t.titel[taal])}</h2>
  <div class="tijden__grid">
    <div>
      <h3>${esc(t.tijdenTitel[taal])}</h3>
      <table class="tijden__tabel"><caption class="vh">${esc(t.tijdenTitel[taal])}</caption><tbody>${rijen}</tbody></table>
    </div>
    <div class="tijden__adres">
      <h3>${esc(t.adresTitel[taal])}</h3>
      <p class="adres">${esc(gegevens.naam)}<br>${esc(gegevens.adres.straat)}<br>${esc(gegevens.adres.postcode)} ${esc(gegevens.adres.plaats)}${voorheen}</p>
      <a class="knop veeg knop--lijn" href="${gegevens.routeLink}" target="_blank" rel="noopener">${icon.pin}${esc(t.routeKnop[taal])}</a>
      <h3 class="tijden__belkop">${esc(t.belTitel[taal])}</h3>
      <p class="tijden__tel"><a href="${gegevens.telefoon.link}" class="tel">${esc(gegevens.telefoon.weergave)}</a></p>
      ${taal === 'en' ? `<p class="tijden__noot">${metBelLink(T(teksten.afhalen.buitenland, taal))}</p>` : ''}
    </div>
  </div>
</div>
</section>`;
}

function wetenHtml(taal) {
  const w = teksten.weten;
  const ids = ['bezorgen', 'reserveren', 'snel', 'halal', 'allergie', 'vegetarisch', 'pepers', 'voetbal', 'betalen'];
  const vragen = w.vragen[taal]
    .map(([v, a], i) => `<details class="vraag" id="vraag-${ids[i]}"><summary>${esc(v)}${icon.plus}</summary><p>${metBelLink(vul(a, vast))}</p></details>`)
    .join('\n');
  return `<section class="weten" id="goed-om-te-weten" aria-labelledby="h-weten">
<div class="wrap weten__in">
  <h2 id="h-weten">${esc(w.titel[taal])}</h2>
  <div class="vragen">
${vragen}
  </div>
</div>
</section>`;
}

function jsonLd(taal) {
  const dagMap = { ma: 'Monday', di: 'Tuesday', wo: 'Wednesday', do: 'Thursday', vr: 'Friday', za: 'Saturday', zo: 'Sunday' };
  const pagina = taal === 'nl' ? gegevens.websiteUrl : `${gegevens.websiteUrl}en/`;
  const gerechten = alleGerechten(taal);
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
    openingHoursSpecification: gegevens.openingstijden.map((r) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: r.dagen.map((d) => dagMap[d]),
      opens: r.open,
      closes: r.dicht,
    })),
    hasMenu: {
      '@type': 'Menu',
      url: `${pagina}#menu`,
      hasMenuSection: categorieen
        .filter((c) => c.soort === 'lijst')
        .map((c) => ({
          '@type': 'MenuSection',
          name: c.naam[taal],
          hasMenuItem: gerechten
            .filter((g) => g.categorie === c.id)
            .map((g) => ({
              '@type': 'MenuItem',
              name: `${g.nr}. ${g.naam}`,
              offers: { '@type': 'Offer', price: g.prijs.toFixed(2), priceCurrency: 'EUR' },
            })),
        })),
    },
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function paginaData(taal) {
  return JSON.stringify({
    tijden: tijdenPerDag(),
    tekst: {
      vandaagOpen: teksten.hero.vandaag[taal],
      vandaagDicht: teksten.hero.vandaagDicht[taal],
    },
  }).replace(/</g, '\\u003c');
}

function pagina(taal) {
  const pre = taal === 'nl' ? '' : '../';
  const anderPad = taal === 'nl' ? 'en/' : '../';
  const ander = taal === 'nl' ? 'en' : 'nl';
  const url = taal === 'nl' ? gegevens.websiteUrl : `${gegevens.websiteUrl}en/`;
  const n = teksten.nav;

  const main = [heroHtml(taal), menuHtml(taal), afhalenHtml(taal), tijdenHtml(taal), wetenHtml(taal)]
    .join('\n\n')
    .replaceAll('src="images/', `src="${pre}images/`)
    .replaceAll(', images/', `, ${pre}images/`)
    .replaceAll('srcset="images/', `srcset="${pre}images/`);

  return `<!doctype html>
<html lang="${taal}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(teksten.meta.titel[taal])}</title>
<meta name="description" content="${esc(T(teksten.meta.beschrijving, taal))}">
${PREVIEW ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="nl" href="${gegevens.websiteUrl}">
<link rel="alternate" hreflang="en" href="${gegevens.websiteUrl}en/">
<link rel="alternate" hreflang="x-default" href="${gegevens.websiteUrl}">
<meta name="theme-color" content="#141110">
<meta property="og:type" content="restaurant">
<meta property="og:title" content="${esc(gegevens.naam)}">
<meta property="og:description" content="${esc(T(teksten.meta.beschrijving, taal))}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${gegevens.websiteUrl}images/deelafbeelding.jpg">
<meta property="og:locale" content="${taal === 'nl' ? 'nl_NL' : 'en_GB'}">
<link rel="icon" type="image/png" sizes="48x48" href="${pre}images/favicon-48.png">
<link rel="apple-touch-icon" href="${pre}images/apple-touch-icon.png">
<link rel="preload" href="${pre}fonts/barlow-condensed-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${pre}fonts/barlow-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${pre}assets/styles.css?v=${versie}">
<script>document.documentElement.classList.replace('no-js','js')</script>
<script type="application/ld+json">${jsonLd(taal)}</script>
</head>
<body>
<a class="overslaan" href="#menu">${esc(teksten.overslaan[taal])}</a>
<header class="kop">
  <div class="wrap kop__in">
    <a class="merk" href="./"><img src="${pre}images/woordmerk.png" alt="Asian Kitchen" width="414" height="75"><span class="merk__arena">Arena</span></a>
    <nav class="kop__nav" aria-label="${esc(n.label[taal])}">
      <a href="#menu">${esc(n.menu[taal])}</a>
      <a href="#afhalen">${esc(n.afhalen[taal])}</a>
      <a href="#tijden">${esc(n.tijden[taal])}</a>
      <a href="#goed-om-te-weten">${esc(n.weten[taal])}</a>
    </nav>
    <a class="kop__taal" href="${anderPad}" hreflang="${ander}" lang="${ander}"><span class="vh">${esc(teksten.taalWissel[taal])}: </span>${ander.toUpperCase()}</a>
    <a class="kop__bel veeg" href="${gegevens.telefoon.link}">${icon.tel}<span class="kop__bel-woord">${esc(teksten.belKort[taal])}</span><span class="kop__bel-nr">${esc(gegevens.telefoon.weergave)}</span></a>
  </div>
</header>

<main>
${main}
</main>

<footer class="voet">
  <div class="wrap voet__in">
    <img class="voet__logo" src="${pre}images/logo-donker.png" alt="Asian Kitchen" width="110" height="120" loading="lazy">
    <div class="voet__kol">
      <p class="voet__naam">${esc(gegevens.naam)}</p>
      <p>${esc(adresRegel)}<br><a href="${gegevens.telefoon.link}" class="tel">${esc(gegevens.telefoon.weergave)}</a></p>
    </div>
    <div class="voet__kol">
      <p>${esc(tijdenKort(taal))}<br>${esc(gegevens.uitzondering[taal])}</p>
    </div>
    <div class="voet__kol">
      <p><a href="#menu">${esc(teksten.nav.menu[taal])}</a><br><a href="${anderPad}" hreflang="${ander}" lang="${ander}">${esc(teksten.taalNaam[ander])}</a></p>
    </div>
  </div>
</footer>

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

// Alleen deze bestanden gaan naar de site (vaste lijst, geen overblijfselen).
const AFBEELDINGEN = [
  'woordmerk.png', 'logo-donker.png', 'favicon-48.png', 'apple-touch-icon.png', 'icon-512.png', 'deelafbeelding.jpg',
  'nr-22-groot.webp', 'nr-40-groot.webp', 'nr-39-groot.webp',
  'afhaalbox-440.webp', 'afhaalbox-760.webp',
];
const LETTERS = ['barlow-condensed-700.woff2', 'barlow-400.woff2', 'barlow-600.woff2', 'OFL.txt'];
await mkdir(path.join(OUT, 'images'));
await mkdir(path.join(OUT, 'fonts'));
await Promise.all([
  ...AFBEELDINGEN.map((f) => cp(path.join(ROOT, 'src/images', f), path.join(OUT, 'images', f))),
  ...LETTERS.map((f) => cp(path.join(ROOT, 'src/fonts', f), path.join(OUT, 'fonts', f))),
  cp(path.join(ROOT, 'src/styles.css'), path.join(OUT, 'assets/styles.css')),
  cp(path.join(ROOT, 'src/app.js'), path.join(OUT, 'assets/app.js')),
  writeFile(path.join(OUT, 'index.html'), pagina('nl')),
  writeFile(path.join(OUT, 'en/index.html'), pagina('en')),
  writeFile(
    path.join(OUT, 'robots.txt'),
    PREVIEW ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${gegevens.websiteUrl}sitemap.xml\n`,
  ),
  writeFile(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${gegevens.websiteUrl}</loc></url>
  <url><loc>${gegevens.websiteUrl}en/</loc></url>
</urlset>
`,
  ),
]);

const bestanden = await readdir(OUT, { recursive: true });
const g = alleGerechten('nl');
const extras = categorieen.find((c) => c.id === 'extras');
const dranken = categorieen.find((c) => c.id === 'dranken');
console.log(`Klaar: ${g.length} gerechten, ${extras.vervangen.length + extras.erbij.length} extra's, ${dranken.items.length} drankregels.`);
console.log(`${bestanden.length} bestanden in ${path.relative(ROOT, OUT) || '.'}${PREVIEW ? ' (preview: niet indexeren)' : ''}`);
