// Controleert de gebouwde website (site/) tegen de menukaart-pdf.
//   node tools/controleer-menu.mjs            (controleert site/)
//   node tools/controleer-menu.mjs --map _preview
// De lijst hieronder is rechtstreeks van de pdf overgetypt (bron/menukaart-origineel.pdf),
// los van content/menu.mjs. Verandert de menukaart? Pas dan BEIDE aan.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// --map: een andere gebouwde map controleren dan site/
const mapIndex = process.argv.indexOf('--map');
const SITE = path.resolve(ROOT, mapIndex >= 0 ? process.argv[mapIndex + 1] : 'site');

// nummer: [prijs, pepers, vegetarisch-blad op de pdf]
const PDF = {
  '2a': [13.0], '3a': [14.0], '4a': [15.0],
  '2b': [13.0], '3b': [14.0], '4b': [15.0],
  '37': [14.5, 0, true], '39': [12.5, 0, true], '40': [12.5, 0, true], '46': [16.0, 0, true],
  '5': [5.5], '6': [5.5, 0, true], '7': [6.5],
  '9': [6.0], '11': [6.0], '12': [6.0], '13': [5.0, 0, true], '14': [5.5],
  '15': [19.5], '16': [17.5], '16a': [18.5], '17': [16.0], '18': [16.0],
  '41': [14.5], '43': [17.5], '44': [19.5],
  '19': [13.5, 1], '20': [13.5, 1], '21': [13.5], '22': [13.5, 2], '23': [13.5, 1], '24': [13.5],
  '25': [15.5, 1], '26': [15.5, 1], '27': [15.5], '28': [15.5, 2], '29': [15.5, 1], '30': [15.5],
  '31': [17.5, 1], '32': [17.5, 1], '33': [17.5], '34': [17.5, 2], '35': [17.5, 1], '36': [17.5],
};
// "Add-ons for main dishes"
const PDF_EXTRAS = [2.5, 2.5, 3.5, 5.5, 5.5, 4.0, 4.5, 4.5, 4.0, 2.5];
// Dranken in volgorde; frisdrankgroep (Coca-Cola t/m Spa) als één regel van € 3,50
const PDF_DRANKEN = [3.5, 4.5, 4.5, 4.5, 8.0, 4.5, 5.5, 5.5, 3.5, 3.5];
const TIJDEN = { ma: '11:30–21:15', di: '11:30–21:15', wo: '11:30–21:15', do: '11:30–21:15', vr: '11:30–21:15', za: '11:30–21:15', zo: '13:00–20:45' };

// controlepunten uit de opdracht
const CONTROLE = { '2a': 13.0, '2b': 13.0, '3a': 14.0, '3b': 14.0, '4a': 15.0, '4b': 15.0, '19': 13.5, '25': 15.5, '31': 17.5, '16a': 18.5 };

const fouten = [];
const ok = [];
const fout = (m) => fouten.push(m);

function prijsUit(tekst) {
  const m = tekst.replace(/\u00a0/g, ' ').match(/€\s?(\d+)[,.](\d{2})/);
  return m ? Number(`${m[1]}.${m[2]}`) : NaN;
}

for (const taal of ['nl', 'en']) {
  const bestand = path.join(SITE, taal === 'nl' ? 'index.html' : 'en/index.html');
  const html = await readFile(bestand, 'utf8');

  // gerechten
  const gerechten = {};
  for (const m of html.matchAll(/<li class="dish[^"]*" id="nr-([^"]+)"[\s\S]*?<\/li>/g)) {
    const blok = m[0];
    const prijs = prijsUit(blok.match(/class="dish__prijs">([^<]+)</)[1]);
    const pepers = (blok.match(/class="i i--peper"/g) || []).length;
    const vega = blok.includes('tag--vegetarisch');
    gerechten[m[1]] = { prijs, pepers, vega, halal: blok.includes('tag--halal-kip'), varken: blok.includes('tag--varkensvlees') };
  }
  const nrsSite = Object.keys(gerechten);
  const nrsPdf = Object.keys(PDF);
  for (const nr of nrsPdf) if (!gerechten[nr]) fout(`[${taal}] nr. ${nr} staat op de pdf maar niet op de site`);
  for (const nr of nrsSite) if (!PDF[nr]) fout(`[${taal}] nr. ${nr} staat op de site maar niet op de pdf`);
  for (const [nr, [prijs, pepers = 0, vega = false]] of Object.entries(PDF)) {
    const g = gerechten[nr];
    if (!g) continue;
    if (g.prijs !== prijs) fout(`[${taal}] nr. ${nr}: prijs ${g.prijs} op site, ${prijs} op pdf`);
    if (g.pepers !== pepers) fout(`[${taal}] nr. ${nr}: ${g.pepers} pepers op site, ${pepers} op pdf`);
    if (g.vega !== vega) fout(`[${taal}] nr. ${nr}: vegetarisch-label klopt niet met de pdf`);
  }
  for (const [nr, prijs] of Object.entries(CONTROLE)) {
    if (gerechten[nr]?.prijs !== prijs) fout(`[${taal}] controlepunt nr. ${nr} (${prijs}) klopt niet`);
  }
  // halal alleen bij kip, nooit samen met varkensvlees
  for (const [nr, g] of Object.entries(gerechten)) {
    if (g.halal && g.varken) fout(`[${taal}] nr. ${nr}: halal-kip en varkensvlees tegelijk`);
  }
  ok.push(`[${taal}] ${nrsSite.length} gerechten, nummers en prijzen gelijk aan de pdf`);

  // extra's
  const extrasBlok = html.match(/<section class="cat cat--extras"[\s\S]*?<\/section>/)[0];
  const extras = [...extrasBlok.matchAll(/class="extra__prijs">([^<]+)</g)].map((m) => prijsUit(m[1]));
  if (JSON.stringify(extras) !== JSON.stringify(PDF_EXTRAS)) fout(`[${taal}] extra's: ${extras} ≠ pdf ${PDF_EXTRAS}`);
  const ruilBlok = extrasBlok.match(/extras__blok--ruil[\s\S]*?<\/div>/)[0];
  if (!/\+ €\s?2[,.]50/.test(ruilBlok.replace(/\u00a0/g, ' '))) fout(`[${taal}] ruilen: + € 2,50 ontbreekt`);
  ok.push(`[${taal}] ${extras.length} extra's gelijk aan de pdf (ruilen + € 2,50 apart)`);

  // dranken
  const drankBlok = html.match(/<section class="cat cat--dranken"[\s\S]*?<\/section>/)[0];
  const dranken = [...drankBlok.matchAll(/class="extra__prijs">([^<]+)</g)].map((m) => prijsUit(m[1]));
  if (JSON.stringify(dranken) !== JSON.stringify(PDF_DRANKEN)) fout(`[${taal}] dranken: ${dranken} ≠ pdf ${PDF_DRANKEN}`);
  ok.push(`[${taal}] ${dranken.length} drankregels gelijk aan de pdf`);

  // contact en tijden
  const tel = [...html.matchAll(/href="tel:([^"]+)"/g)].map((m) => m[1]);
  if (!tel.length || tel.some((t) => t !== '+31203657971')) fout(`[${taal}] verkeerde tel-link: ${[...new Set(tel)]}`);
  if (!html.includes('020 365 7971')) fout(`[${taal}] telefoonnummer 020 365 7971 ontbreekt`);
  if (!html.includes('Johan Cruijff Boulevard 81') || !html.includes('1101 DL')) fout(`[${taal}] adres ontbreekt`);
  const route = html.match(/href="(https:\/\/www\.google\.com\/maps\/dir\/[^"]+)"/);
  if (!route || !decodeURIComponent(route[1].replace(/\+/g, ' ')).includes('Johan Cruijff Boulevard 81, 1101 DL Amsterdam')) fout(`[${taal}] routelink klopt niet`);
  for (const [dag, tijd] of Object.entries(TIJDEN)) {
    const rij = html.match(new RegExp(`<tr data-dag="${dag}">[\\s\\S]*?</tr>`));
    if (!rij || !rij[0].includes(tijd)) fout(`[${taal}] openingstijd ${dag} is niet ${tijd}`);
  }
  if (!html.includes('12:00')) fout(`[${taal}] uitzondering voetbal zondag 12:00 ontbreekt`);
  if (html.includes('21:00')) fout(`[${taal}] oude sluitingstijd 21:00 staat nog op de site`);
  ok.push(`[${taal}] ${tel.length} tel-links naar +31203657971, adres, routelink en openingstijden kloppen`);

  // verboden onderdelen
  for (const woord of ['winkelmand', 'shopping cart', 'checkout', 'inloggen', 'log in', 'bezorgkosten']) {
    if (html.toLowerCase().includes(woord)) fout(`[${taal}] bevat '${woord}'`);
  }
}

// kruiscontrole met de eerdere import in Asian Kitchen OS (als die op deze computer staat)
const OS = process.env.AK_OS_MENU_DATA || path.resolve(ROOT, '../AK/asian-kitchen-os/packages/database/src/seed/menu-data.ts');
if (existsSync(OS)) {
  const ts = await readFile(OS, 'utf8');
  let n = 0;
  for (const m of ts.matchAll(/number: '([^']+)',[\s\S]*?priceCents: (\d+)/g)) {
    if (!PDF[m[1]]) continue;
    n++;
    if (PDF[m[1]][0] * 100 !== Number(m[2])) fout(`kruiscontrole: nr. ${m[1]} is ${m[2]} cent in Asian Kitchen OS`);
  }
  ok.push(`kruiscontrole met Asian Kitchen OS: ${n} gerechten vergeleken`);
}

for (const m of ok) console.log('OK   ' + m);
for (const m of fouten) console.log('FOUT ' + m);
console.log(fouten.length ? `\n${fouten.length} fout(en) gevonden.` : '\nAlles klopt.');
process.exit(fouten.length ? 1 : 0);
