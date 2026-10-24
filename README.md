# Website Asian Kitchen Arena

Nieuwe website voor Asian Kitchen Arena (Arena Boulevard 81, Amsterdam): menu, telefonisch
bestellen, afhalen, allergenen, adres en openingstijden. In het Nederlands en Engels.
Werkt eerst op de telefoon, daarna ook op tablet en computer.

- **Preview:** https://gwnquintenman.github.io/asian-kitchen-arena-website/
  (alleen om te bekijken; komt niet in Google)
- **Kant-en-klare website:** de map `site/`. Dit is wat op de hosting moet.

Er is geen online bestellen, winkelmandje, betalen, bezorgen, reserveren of inloggen.
Bestellen gaat met de knop **Bel om te bestellen** (`tel:+31203657971`).

## Waar pas je wat aan?

| Wat | Bestand |
|---|---|
| Prijzen, gerechten, beschrijvingen, labels (halal kip, vegetarisch, varkensvlees, pepers) | `content/menu.mjs` |
| Extra's en dranken | onderaan `content/menu.mjs` |
| Telefoonnummer, adres, openingstijden, routeknop | `content/gegevens.mjs` |
| Alle andere teksten (NL en EN naast elkaar) | `content/teksten.mjs` |
| Allergenen per gerecht (zodra de keuken ze heeft gecontroleerd) | `content/menu.mjs`, veld `allergenen` |
| Foto's | `src/images/` (originelen in `bron/foto-origineel/`) |
| Kleuren en opmaak | `src/styles.css` |

Voorbeeld: de prijs van nr. 22 veranderen naar € 14,00. Zoek in `content/menu.mjs` de regel
met `gerecht('22', 13.5, ...` en maak er `gerecht('22', 14.0, ...` van. Let op: een punt, geen komma.

**Na elke aanpassing:** dubbelklik `bouw.cmd`. Dat maakt de map `site/` opnieuw en controleert
het menu tegen de pdf. Staat er "Alles klopt.", dan is het goed. Als je de menukaart zelf
verandert (nieuwe prijzen), pas dan ook de controlelijst bovenaan `tools/controleer-menu.mjs` aan.
Je kunt dit ook aan Claude vragen.

Nodig: Node.js (staat al op deze computer). Er hoeft verder niets geïnstalleerd te worden.

## Op de bestaande hosting zetten

Doe dit pas als de preview is goedgekeurd.

1. Maak eerst een back-up: download de huidige map `/Arena/` van de hosting (via FTP of het
   beheerpaneel van de hosting) en bewaar die.
2. Upload de **inhoud** van de map `site/` naar `/Arena/` op de hosting (dus `index.html`,
   `en/`, `assets/`, `images/`, `fonts/`, de pdf, `robots.txt` en `sitemap.xml`).
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

- Gewone statische website: HTML, CSS en een klein beetje JavaScript (zoeken, allergenenvenster,
  "vandaag open"). Zonder JavaScript werkt alles behalve zoeken en het venster.
- `build.mjs` maakt de pagina's uit `content/`. Geen extra pakketten of abonnementen.
- `tools/controleer-menu.mjs` vergelijkt alle nummers, prijzen, pepers, extra's, dranken,
  tel-links, adres en openingstijden met een losse overtypelijst van de pdf.
- `tools/preview-publiceren.mjs` zet een nieuwe versie op de previewlink (GitHub Pages,
  branch `gh-pages`, met 'niet indexeren'). De echte website verandert daar niet door.
- `tools/maak-afbeeldingen.py` maakt de webfoto's uit de originelen (alleen nodig bij nieuwe foto's;
  vraagt Python met Pillow).
- Lettertype: Barlow Condensed (vrije licentie, `src/fonts/OFL.txt`), staat op de eigen server;
  er wordt niets bij Google of andere diensten opgehaald.
- Foto's: uit de eigen menukaart-pdf (nr. 11, 13, 14, 22, 39, 40 en het logo) en de rode
  afhaalbox van de oude website.

## Nog te bevestigen

1. **Straatnaam.** De Arena Boulevard heet sinds ongeveer 2020 officieel Johan Cruijff Boulevard,
   en Google Maps kent de zaak als "Johan Cruijff Boulevard 81, 1101 DL". De site gebruikt nu
   "Arena Boulevard 81" zoals opgegeven. De routeknop vindt de zaak wel goed. Kies welke naam
   op de site moet (aanpassen in `content/gegevens.mjs`).
2. **Allergenen per gerecht.** Er is geen gecontroleerde lijst. De site zegt daarom per gerecht
   dat de lijst nog niet gecontroleerd is, met een belknop. Het concept van de oude website
   staat in `bron/allergenen-oude-website.md` (onvolledig: o.a. oestersaus en Gong Bao nalopen).
3. **Frisdrankprijs.** Op de pdf staat € 3,50 alleen naast Coca-Cola, met Sprite tot en met Spa
   eronder. De site toont de hele groep voor € 3,50 (zoals de oude site: "frisdrank € 3,50").
4. **Overige voorgerechten.** Alleen de 5 bites van de pdf staan erop (9, 11, 12, 13, 14).
   Zijn er meer voorgerechten, lever ze dan aan.
5. **Beschrijvingen** van 7, 15, 17, 18 en 41 (wonton met varkensvlees, saus van de chef,
   char siu en garnalen) komen van de oude website. Even nalezen of het nog klopt.
6. **Kleine details:** zit er saus bij de saté en loempia's; welk merk bier; glas of fles wijn;
   mag het mobiele nummer of e-mailadres van de oude site erop (nu bewust weggelaten).
7. **Foto's.** Er zijn 6 echte gerechtfoto's. Meer eigen foto's (en een recente foto van de
   gevel) maken het nog herkenbaarder.
