// Alle vaste teksten van de website, in het Nederlands (nl) en Engels (en).
// {telefoon}, {internationaal}, {straat} en {adres} worden automatisch ingevuld uit gegevens.mjs.
// Schrijfregels: kort en feitelijk, geen slogans, geen beloftes die de zaak niet heeft bevestigd.

export default {
  meta: {
    titel: {
      nl: 'Asian Kitchen Arena | Afhalen aan de Johan Cruijff Boulevard',
      en: 'Asian Kitchen Arena | Takeaway on Johan Cruijff Boulevard',
    },
    beschrijving: {
      nl: 'Wokgerechten, noedels, nasi en soep, vers bereid. Bekijk het menu, bel {telefoon} om te bestellen en haal je eten op aan de {straat}.',
      en: 'Wok dishes, noodles, fried rice and soup, made fresh. See the menu, call {telefoon} to order and pick up at {straat}, Amsterdam.',
    },
  },

  overslaan: { nl: 'Direct naar het menu', en: 'Skip to the menu' },
  taalNaam: { nl: 'Nederlands', en: 'English' },
  taalWissel: { nl: 'Read this page in English', en: 'Lees deze pagina in het Nederlands' },
  nav: {
    label: { nl: 'Hoofdmenu', en: 'Main menu' },
    menu: { nl: 'Menu', en: 'Menu' },
    afhalen: { nl: 'Afhalen', en: 'Pick-up' },
    tijden: { nl: 'Openingstijden', en: 'Opening hours' },
    weten: { nl: 'Goed om te weten', en: 'Good to know' },
  },
  belKort: { nl: 'Bel', en: 'Call' },

  hero: {
    plaats: { nl: '{straat} · Amsterdam', en: '{straat} · Amsterdam' },
    titel: { nl: 'Wokgerechten, noedels en soep', en: 'Wok dishes, noodles and soup' },
    lead: {
      nl: 'Vers bereid met veel groenten en snel klaar. Bel je bestelling door en haal je eten op bij Asian Kitchen Arena, ook vlak voor een concert of wedstrijd.',
      en: 'Made fresh with plenty of vegetables and ready fast. Call in your order and pick it up at Asian Kitchen Arena, also right before a concert or match.',
    },
    menuKnop: { nl: 'Bekijk het menu', en: 'See the menu' },
    belKnop: { nl: 'Bel {telefoon}', en: 'Call {telefoon}' },
    feiten: {
      nl: ['Alle kip is halal', 'Telefonisch bestellen, zelf ophalen', 'Geen bezorging'],
      en: ['All our chicken is halal', 'Order by phone, pick up yourself', 'No delivery'],
    },
    vandaag: { nl: 'Vandaag open', en: 'Open today' },
    vandaagDicht: { nl: 'Vandaag gesloten', en: 'Closed today' },
    route: { nl: 'Route', en: 'Directions' },
    fotoAlt: {
      nl: 'Drie gerechten van Asian Kitchen: nr. 22 kip Szechuan met rijst, nr. 40 noedels met groenten en nr. 39 nasi met groenten',
      en: 'Three Asian Kitchen dishes: no. 22 chicken Szechuan with rice, no. 40 noodles with vegetables and no. 39 fried rice with vegetables',
    },
  },

  menu: {
    titel: { nl: 'Menu', en: 'Menu' },
    uitleg: {
      nl: 'Noem het nummer als je belt. Prijzen in euro, zoals op onze menukaart.',
      en: 'Mention the number when you call. Prices in euros, as on our printed menu.',
    },
    allergie: { nl: 'Allergie? Zeg het altijd als je belt.', en: 'Allergy? Always tell us when you call.' },
    allergieLink: { nl: 'Meer over allergenen', en: 'More about allergens' },
    tabsLabel: { nl: 'Menucategorieën', en: 'Menu categories' },
    nummer: { nl: 'Nr.', en: 'No.' },
    rijstRuilen: {
      nl: 'Liever eiernoedels of nasi in plaats van witte rijst? Dat kan voor + {prijs}.',
      en: 'Egg noodles or egg fried rice instead of white rice? That is + {prijs}.',
    },
    rijstRuilenBij: {
      nl: 'Bij nr. {nrs}: eiernoedels of nasi in plaats van witte rijst kan voor + {prijs}.',
      en: 'For no. {nrs}: egg noodles or egg fried rice instead of white rice is + {prijs}.',
    },
    alleExtras: { nl: "Alle extra's", en: 'All add-ons' },
    fotoAlt: { nl: 'Foto van nr. {nr}, {naam}', en: 'Photo of no. {nr}, {naam}' },
    allergenenLabel: { nl: 'Allergenen', en: 'Allergens' },
    legenda: {
      titel: { nl: 'Uitleg van de labels', en: 'What the labels mean' },
      halal: { nl: 'Alle kip die we gebruiken is halal.', en: 'All the chicken we use is halal.' },
      vegetarisch: { nl: 'Vegetarisch volgens onze menukaart, niet automatisch veganistisch.', en: 'Vegetarian according to our menu, not automatically vegan.' },
      pittig: { nl: 'Het aantal pepers op onze menukaart.', en: 'The number of peppers on our printed menu.' },
      varkensvlees: { nl: 'Dit gerecht bevat varkensvlees.', en: 'This dish contains pork.' },
    },
  },

  labels: {
    'halal-kip': { nl: 'Kip is halal', en: 'Halal chicken' },
    vegetarisch: { nl: 'Vegetarisch', en: 'Vegetarian' },
    varkensvlees: { nl: 'Met varkensvlees', en: 'Contains pork' },
    peper1: { nl: 'Pittig', en: 'Spicy' },
    peper2: { nl: 'Extra pittig', en: 'Extra spicy' },
  },

  extras: {
    intro: {
      nl: 'Voor hoofdgerechten. Geef ze door als je belt.',
      en: 'For main dishes. Just mention them when you call.',
    },
    vervangenTitel: { nl: 'Ruilen', en: 'Swap' },
    vervangenUitleg: {
      nl: 'Je krijgt dit in plaats van de witte rijst, niet erbij.',
      en: 'You get this instead of the white rice, not on top of it.',
    },
    erbijTitel: { nl: 'Extra portie erbij', en: 'Extra portion' },
    erbijUitleg: { nl: 'Een extra portie bovenop je gerecht.', en: 'An extra portion on top of your dish.' },
    voorbeeldTitel: { nl: 'Zo reken je het uit', en: 'How it adds up' },
    voorbeelden: {
      nl: [
        'Nr. 19 met nasi in plaats van witte rijst: {p19} + {ruil} = {som1}',
        'Nr. 19 met een extra portie witte rijst: {p19} + {rijst} = {som2}',
      ],
      en: [
        'No. 19 with egg fried rice instead of white rice: {p19} + {ruil} = {som1}',
        'No. 19 with an extra portion of white rice: {p19} + {rijst} = {som2}',
      ],
    },
    twijfel: {
      nl: 'Twijfel je of iets kan bij jouw gerecht? Vraag het als je belt.',
      en: 'Not sure if something works with your dish? Ask us when you call.',
    },
  },

  dranken: {
    alcohol: {
      nl: 'Alcohol alleen vanaf 18 jaar. We kunnen om je ID vragen.',
      en: 'Alcohol is only sold to people aged 18 and over. We may ask for ID.',
    },
  },

  afhalen: {
    titel: { nl: 'Bestellen en afhalen', en: 'Ordering and pick-up' },
    intro: {
      nl: 'We bezorgen niet en online bestellen kan niet. Bellen en ophalen gaat zo:',
      en: "We don't deliver and there is no online ordering. Calling in and picking up works like this:",
    },
    stappen: {
      nl: [
        'Kies je gerechten op het menu en onthoud de nummers.',
        'Bel {telefoon} en geef je bestelling door. Noem ook je allergieën.',
        'Spreek samen een afhaaltijd af.',
        'Haal je eten op aan de {straat}. Je betaalt bij het ophalen.',
      ],
      en: [
        'Choose your dishes from the menu and note the numbers.',
        'Call {telefoon} and place your order. Mention any allergies.',
        'Agree on a pick-up time together.',
        'Pick up your food at {straat}. You pay when you pick up.',
      ],
    },
    evenement: {
      nl: 'Ga je naar een concert of wedstrijd? Bel dan op tijd.',
      en: 'Going to a concert or match? Call in good time.',
    },
    buitenland: { nl: '', en: 'Calling from a foreign number? Dial {internationaal}.' },
    belKnop: { nl: 'Bel {telefoon}', en: 'Call {telefoon}' },
    fotoAlt: {
      nl: 'Noedels met groenten in een rode Asian Kitchen-afhaalbox',
      en: 'Noodles with vegetables in a red Asian Kitchen takeaway box',
    },
  },

  tijden: {
    titel: { nl: 'Openingstijden en adres', en: 'Opening hours and address' },
    tijdenTitel: { nl: 'Openingstijden', en: 'Opening hours' },
    adresTitel: { nl: 'Hier vind je ons', en: 'Where to find us' },
    routeKnop: { nl: 'Route plannen', en: 'Get directions' },
    belTitel: { nl: 'Bellen', en: 'Phone' },
    vandaag: { nl: 'vandaag', en: 'today' },
  },

  weten: {
    titel: { nl: 'Goed om te weten', en: 'Good to know' },
    vragen: {
      nl: [
        ['Bezorgen jullie?', 'Nee. Je bestelt telefonisch via {telefoon} en haalt je eten zelf bij ons op. Online bestellen kan ook niet.'],
        ['Kan ik reserveren?', 'Nee, reserveren is niet mogelijk.'],
        ['Hoe snel is mijn bestelling klaar?', 'We maken alles vers en het is snel klaar. Als je belt, spreken we samen een afhaaltijd af.'],
        ['Is het eten halal?', 'Alle kip die we gebruiken is halal. Dat geldt niet voor het hele menu: er staan ook varkensvlees, rundvlees, eend en garnalen op.'],
        ['Ik heb een allergie. Waar moet ik op letten?', 'Zeg het altijd als je belt. Er staat nog geen gecontroleerde allergenenlijst per gerecht op deze site, maar de keuken kan je vertellen wat er in een gerecht, de saus en de bouillon zit. Ook extra\'s kunnen allergenen bevatten. Kruisbesmetting kan voorkomen, dus we kunnen niet garanderen dat een gerecht vrij is van een allergeen.'],
        ['Wat is er vegetarisch?', 'Nr. 6, 13, 37, 39, 40 en 46 zijn vegetarisch volgens onze menukaart. Vegetarisch is niet automatisch veganistisch: 39 en 40 zijn bijvoorbeeld met ei.'],
        ['Wat betekenen de pepers?', 'Het aantal pepers komt van onze menukaart. Eén peper is pittig, twee pepers is extra pittig.'],
        ['Zijn jullie open als er een voetbalwedstrijd is?', 'Op zondag met een voetbalwedstrijd zijn we open vanaf 12:00. De andere tijden staan bij de openingstijden.'],
        ['Hoe betaal ik?', 'Je betaalt bij het ophalen.'],
      ],
      en: [
        ['Do you deliver?', 'No. You order by phone on {telefoon} and pick up your food from us. There is no online ordering either.'],
        ['Can I book a table?', 'No, reservations are not possible.'],
        ['How soon is my order ready?', 'We make everything fresh and it is ready fast. When you call, we agree on a pick-up time together.'],
        ['Is the food halal?', 'All the chicken we use is halal. That does not apply to the whole menu: it also has pork, beef, duck and shrimp.'],
        ['I have an allergy. What should I know?', 'Always tell us when you call. This site does not yet have a checked allergen list per dish, but the kitchen can tell you what is in a dish, its sauce and its broth. Add-ons can contain allergens too. Cross-contamination can happen, so we cannot guarantee that a dish is free from any allergen.'],
        ['What is vegetarian?', 'No. 6, 13, 37, 39, 40 and 46 are vegetarian according to our menu. Vegetarian is not automatically vegan: 39 and 40 contain egg, for example.'],
        ['What do the peppers mean?', 'The number of peppers comes from our printed menu. One pepper is spicy, two peppers is extra spicy.'],
        ['Are you open when there is a football match?', 'On Sundays with a football match we open at 12:00. The other times are listed under opening hours.'],
        ['How do I pay?', 'You pay when you pick up.'],
      ],
    },
  },

  dagen: {
    ma: { nl: 'Maandag', en: 'Monday' },
    di: { nl: 'Dinsdag', en: 'Tuesday' },
    wo: { nl: 'Woensdag', en: 'Wednesday' },
    do: { nl: 'Donderdag', en: 'Thursday' },
    vr: { nl: 'Vrijdag', en: 'Friday' },
    za: { nl: 'Zaterdag', en: 'Saturday' },
    zo: { nl: 'Zondag', en: 'Sunday' },
  },

  // De 14 allergenen die in de EU verplicht vermeld moeten worden.
  allergenen: {
    gluten: { nl: 'gluten', en: 'gluten' },
    schaaldieren: { nl: 'schaaldieren', en: 'crustaceans' },
    ei: { nl: 'ei', en: 'egg' },
    vis: { nl: 'vis', en: 'fish' },
    pinda: { nl: "pinda's", en: 'peanuts' },
    soja: { nl: 'soja', en: 'soy' },
    melk: { nl: 'melk', en: 'milk' },
    noten: { nl: 'noten', en: 'tree nuts' },
    selderij: { nl: 'selderij', en: 'celery' },
    mosterd: { nl: 'mosterd', en: 'mustard' },
    sesam: { nl: 'sesam', en: 'sesame' },
    sulfiet: { nl: 'sulfiet', en: 'sulphites' },
    lupine: { nl: 'lupine', en: 'lupin' },
    weekdieren: { nl: 'weekdieren', en: 'molluscs' },
  },
};
