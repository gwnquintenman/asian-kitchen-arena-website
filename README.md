# Website Asian Kitchen Arena

Informatiewebsite voor Asian Kitchen Arena (Johan Cruijff Boulevard 81, Amsterdam): menu,
afhalen, openingstijden, adres en "goed om te weten". In het Nederlands en Engels.
Eerst ontworpen voor de telefoon, daarna voor tablet en computer.

- **Preview:** https://gwnquintenman.github.io/asian-kitchen-arena-website/
  (alleen om te bekijken; komt niet in Google)
- **Kant-en-klare website:** de map `site/`. Dit is wat op de hosting moet.
- **Downloadpakketten** (map `pakket/`): `upload-naar-hosting-Arena.zip` (alleen de website) en
  `asian-kitchen-arena-website-bronbestanden.zip` (alles, ook de bronbestanden).

Het is een gewone informatiesite. Er is geen online bestellen, winkelmandje, betalen, bezorgen,
reserveren, inloggen, contactformulier of menukaart-download. Wie wil bestellen, belt
(`tel:+31203657971`) en haalt het eten op.

## Opbouw van de pagina

1. **Bovenkant** (donker, zoals de zwarte menukaart): wat je er haalt, belknop, "vandaag open",
   uitgesneden gerechtfoto's met de rode Nr.-stippen van de menukaart.
2. **Menu** in tabbladen. Noedels & nasi en de wokgerechten staan in een raster: zoek je saus op
   en kijk in de kolom van kip, rundvlees of garnalen voor het nummer.
3. **Bestellen en afhalen**: in vier stappen, geen bezorging.
4. **Openingstijden en adres**, met de dag van vandaag gemarkeerd en een routeknop.
5. **Goed om te weten**: bezorgen, reserveren, halal, allergie, vegetarisch, pepers, voetbal, betalen.

## Waar pas je wat aan?

| Wat | Bestand |
|---|---|
| Gerechten, nummers, prijzen, beschrijvingen, labels (halal kip, vegetarisch, varkensvlees, pepers) | `content/menu.mjs` |
| Extra's en dranken | onderaan `content/menu.mjs` |
| Telefoonnummer, adres, openingstijden, routeknop | `content/gegevens.mjs` |
| Alle andere teksten (NL en EN naast elkaar), ook de vragen bij "Goed om te weten" | `content/teksten.mjs` |
| Allergenen per gerecht (zodra de keuken ze heeft gecontroleerd) | `content/menu.mjs`, veld `allergenen` |
| Foto's | `src/images/` (originelen in `bron/foto-origineel/`) |
| Kleuren en opmaak | `src/styles.css` |

Voorbeelden (let op: een punt, geen komma):
- Prijs van nr. 15 naar € 20,00: zoek `gerecht('15', 19.5,` en maak er `gerecht('15', 20.0,` van.
- Alle wokgerechten met kip naar € 14,00: zoek bij `id: 'kip'` het stukje `prijs: 13.5` en maak er
  `prijs: 14.0` van. In het raster geldt de prijs per kolom (kip, rundvlees, garnalen).

**Na elke aanpassing:** dubbelklik `bouw.cmd`. Dat maakt de map `site/` opnieuw en controleert
het menu tegen de pdf. Staat er "Alles klopt.", dan is het goed. Als de menukaart zelf verandert
(nieuwe prijzen), pas dan ook de controlelijst bovenaan `tools/controleer-menu.mjs` aan.
Je kunt dit ook aan Claude vragen.

Nodig: Node.js (staat al op deze computer). Er hoeft verder niets geïnstalleerd te worden.

## Op de bestaande hosting zetten

Doe dit pas als de preview is goedgekeurd.

1. Maak eerst een back-up: download de huidige map `/Arena/` van de hosting (via FTP of het
   beheerpaneel van de hosting) en bewaar die.
2. Upload de **inhoud** van de map `site/` naar `/Arena/` op de hosting (dus `index.html`,
   `en/`, `assets/`, `images/`, `fonts/`, `robots.txt` en `sitemap.xml`).
3. **Hernoem de oude `index.php`** in `/Arena/` naar bijvoorbeeld `index-oud.php`. De huidige site
   draait op dat bestand (Apache met PHP); blijft het staan, dan kan de server de oude pagina
   blijven tonen in plaats van de nieuwe `index.html`.
4. Laat de map `images/` staan: daar staan dan oude en nieuwe plaatjes naast elkaar. De oude
   mappen `css/` en `js/` mogen later weg.
5. Open https://www.asiankitchen.nl/Arena/ op je telefoon en controleer: menu, belknop,
   routeknop, taalwissel. Ging er iets mis, zet dan de back-up terug en hernoem
   `index-oud.php` weer naar `index.php`.

Komt de site op een ander adres dan `https://www.asiankitchen.nl/Arena/`? Pas dan
`websiteUrl` aan in `content/gegevens.mjs` en dubbelklik `bouw.cmd` voordat je uploadt.

## Hoe het gebouwd is (kort)

- Gewone statische website: HTML, CSS en een klein beetje JavaScript (tabbladen in het menu,
  "vandaag open", een vraag openklappen vanuit een link). Zonder JavaScript staat het hele menu
  gewoon onder elkaar. Bij printen komt ook het hele menu op papier.
- `build.mjs` maakt de pagina's uit `content/`. Alleen een vaste lijst bestanden gaat naar `site/`.
- `tools/controleer-menu.mjs` vergelijkt alle nummers, prijzen, pepers, labels, extra's, dranken,
  tel-links, adres en openingstijden met een losse overtypelijst van de pdf, en controleert dat
  er geen formulieren, downloads of onbevestigde beweringen op de site staan.
- `tools/preview-publiceren.mjs` zet een nieuwe versie op de previewlink (GitHub Pages,
  branch `gh-pages`, met 'niet indexeren'). De echte website verandert daar niet door.
- `tools/maak-afbeeldingen.py` maakt de webfoto's en het woordmerk uit de originelen (alleen nodig
  bij nieuwe foto's; vraagt Python met Pillow).
- Lettertypen: Barlow Condensed (koppen) en Barlow (tekst), vrije licentie (`src/fonts/OFL.txt`),
  op de eigen server; er wordt niets bij Google of andere diensten opgehaald.
- Foto's: uit de eigen menukaart-pdf (nr. 11, 13, 14, 22, 39, 40 en het logo) en de rode
  afhaalbox. Geen stockfoto's en geen gegenereerde beelden.
- Vormgeving volgens de Website Kit in de AK-vault: geen AI-trucs (geen telcijfers, verlopen,
  glaseffecten, icoontjeskaarten of slogans), alleen beweging waar die iets doet, en
  `prefers-reduced-motion` wordt gerespecteerd.

## Nog te bevestigen

1. **Allergenen per gerecht.** Er is geen gecontroleerde lijst. De site zegt dat eerlijk (bij
   "Goed om te weten") en vraagt klanten het bij het bellen te melden. Het concept van de oude
   website staat in `bron/allergenen-oude-website.md` (onvolledig: o.a. oestersaus en Gong Bao).
2. **Frisdrankprijs.** Op de pdf staat € 3,50 alleen naast Coca-Cola, met Sprite tot en met Spa
   eronder. De site toont de hele groep voor € 3,50.
3. **Overige voorgerechten.** Alleen de 5 bites van de pdf staan erop (9, 11, 12, 13, 14).
4. **Beschrijvingen** van 7, 15, 17, 18 en 41 (wonton met varkensvlees, saus van de chef,
   char siu en garnalen) komen van de oude website. Even nalezen of het nog klopt.
5. **Niet overgenomen** omdat het niet in jullie opdracht of de pdf staat: open keuken, hier eten,
   open op feestdagen, wokbakjes die warm houden, aangepaste tijden bij wedstrijden behalve de
   zondag-regel. Klopt iets daarvan en wil je het erop, zeg het dan.
6. **Kleine details:** zit er saus bij de saté en loempia's; welk merk bier; glas of fles wijn.
7. **Foto's.** Er zijn 6 echte gerechtfoto's. Meer eigen foto's maken het nog herkenbaarder.
