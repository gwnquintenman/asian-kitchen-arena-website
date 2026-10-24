// Alle vaste teksten van de website, in het Nederlands (nl) en Engels (en).
// Telefoonnummer, adres en tijden staan in gegevens.mjs en worden automatisch ingevuld
// waar je {telefoon}, {adres} of {straat} ziet.

export default {
  meta: {
    titel: {
      nl: 'Asian Kitchen Arena – Aziatisch eten afhalen aan de Arena Boulevard',
      en: 'Asian Kitchen Arena – Asian takeaway on Arena Boulevard, Amsterdam',
    },
    beschrijving: {
      nl: 'Noedels, nasi, wokgerechten en soep om af te halen aan de Arena Boulevard 81 in Amsterdam. Bekijk het menu en bel {telefoon} om te bestellen.',
      en: 'Noodles, fried rice, wok dishes and soup to take away at Arena Boulevard 81, Amsterdam. See the menu and call {telefoon} to order.',
    },
  },

  overslaan: { nl: 'Direct naar het menu', en: 'Skip to the menu' },
  taalNaam: { nl: 'Nederlands', en: 'English' },
  taalWissel: { nl: 'Read this page in English', en: 'Lees deze pagina in het Nederlands' },
  nav: {
    label: { nl: 'Hoofdmenu', en: 'Main menu' },
    menu: { nl: 'Menu', en: 'Menu' },
    bestellen: { nl: 'Bestellen', en: 'How to order' },
    allergenen: { nl: 'Allergenen', en: 'Allergens' },
    ophalen: { nl: 'Adres & tijden', en: 'Address & hours' },
  },

  belKnop: { nl: 'Bel om te bestellen', en: 'Call to order' },
  belKort: { nl: 'Bel', en: 'Call' },
  menuKnop: { nl: 'Bekijk het menu', en: 'See the menu' },
  routeKnop: { nl: 'Route', en: 'Directions' },
  routeKnopLang: { nl: 'Plan je route', en: 'Get directions' },

  intro: {
    titel: { nl: 'Aziatisch eten om af te halen', en: 'Asian food to take away' },
    lead: {
      nl: 'Noedels, nasi en wokgerechten aan de Arena Boulevard. Vers bereid, met veel groenten, en snel klaar. Handig vóór een concert, wedstrijd of ander evenement.',
      en: 'Noodles, fried rice and wok dishes on Arena Boulevard. Freshly made, with plenty of vegetables, and ready fast. Handy before a concert, match or other event.',
    },
    feiten: {
      nl: ['Telefonisch bestellen, zelf ophalen', 'Alle kip is halal'],
      en: ['Order by phone, pick up yourself', 'All our chicken is halal'],
    },
    vandaag: { nl: 'Vandaag open', en: 'Open today' },
    fotoAlt: {
      nl: 'Noedels met groenten in een rode Asian Kitchen-afhaalbox',
      en: 'Noodles with vegetables in a red Asian Kitchen takeaway box',
    },
  },

  bestellen: {
    titel: { nl: 'Zo bestel je', en: 'How to order' },
    stappen: {
      nl: [
        ['Kies je gerechten.', 'Onthoud de nummers, bijvoorbeeld 22 of 2a.'],
        ['Bel {telefoon}.', 'Geef je bestelling door en noem eventuele allergieën.'],
        ['Spreek een afhaaltijd af.', 'Op weg naar een evenement? Bel op tijd.'],
        ['Haal je eten op.', 'Aan de {straat}. Je betaalt bij het ophalen.'],
      ],
      en: [
        ['Choose your dishes.', 'Note the numbers, for example 22 or 2a.'],
        ['Call {telefoon}.', 'Place your order and mention any allergies.'],
        ['Agree on a pick-up time.', 'Heading to an event? Call in good time.'],
        ['Pick up your food.', 'At {straat}. You pay when you pick up.'],
      ],
    },
    niet: {
      nl: 'We bezorgen niet. Online bestellen, betalen of reserveren kan niet.',
      en: 'We do not deliver. Online ordering, payment and reservations are not possible.',
    },
    buitenland: {
      nl: '',
      en: 'Calling from a foreign number? Dial {internationaal}.',
    },
  },

  menu: {
    titel: { nl: 'Menu', en: 'Menu' },
    uitleg: {
      nl: 'Noem bij het bellen het nummer van het gerecht.',
      en: 'When you call, just mention the number of the dish.',
    },
    allergie: {
      nl: 'Allergie of dieetwens? Zeg het altijd als je belt.',
      en: 'Allergy or dietary need? Always tell us when you call.',
    },
    allergieLink: { nl: 'Over allergenen en dieet', en: 'About allergens and diets' },
    pdf: { nl: 'Menukaart als pdf', en: 'Menu as PDF' },
    zoekLabel: { nl: 'Zoek een gerecht', en: 'Search for a dish' },
    zoekHint: { nl: 'Naam of nummer, bijv. 22 of kip', en: 'Name or number, e.g. 22 or chicken' },
    zoekWis: { nl: 'Wis', en: 'Clear' },
    zoekAantal: { nl: '{n} resultaten', en: '{n} results' },
    zoekEen: { nl: '1 resultaat', en: '1 result' },
    zoekGeen: {
      nl: 'Niets gevonden voor “{q}”. Zoek op naam of nummer, of bel ons en vraag het.',
      en: 'Nothing found for “{q}”. Search by name or number, or call us and ask.',
    },
    categorieen: { nl: 'Menucategorieën', en: 'Menu categories' },
    nummer: { nl: 'Nummer', en: 'Number' },
    allergieKnop: { nl: 'Allergenen', en: 'Allergens' },
    allergieLabel: { nl: 'Allergenen van nr. {nr}, {naam}', en: 'Allergens for no. {nr}, {naam}' },
    rijstRuilen: {
      nl: 'Liever eiernoedels of nasi in plaats van witte rijst? + {prijs}.',
      en: 'Egg noodles or egg fried rice instead of white rice? + {prijs}.',
    },
    rijstRuilenBij: {
      nl: 'Bij nr. {nrs}: eiernoedels of nasi in plaats van witte rijst? + {prijs}.',
      en: 'For no. {nrs}: egg noodles or egg fried rice instead of white rice? + {prijs}.',
    },
    alleExtras: { nl: "Alle extra's", en: 'All add-ons' },
    fotoAlt: { nl: 'Foto van nr. {nr}, {naam}', en: 'Photo of no. {nr}, {naam}' },
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
    erbijUitleg: {
      nl: 'Een extra portie bovenop je gerecht.',
      en: 'An extra portion on top of your dish.',
    },
    voorbeeldTitel: { nl: 'Voorbeeld', en: 'Example' },
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

  allergenenSectie: {
    titel: { nl: 'Allergenen en dieet', en: 'Allergens and diets' },
    punten: {
      nl: [
        ['Heb je een allergie?', 'Zeg het altijd als je belt. Twijfel je over een gerecht, bel dan eerst en vraag het aan de keuken: {telefoon}.'],
        ['Nog geen volledige lijst online.', 'Er staat nog geen gecontroleerde allergenenlijst per gerecht op deze site. De keuken kan je vertellen wat er in een gerecht, de saus en de bouillon zit.'],
        ['Sauzen, bouillon en extra’s', 'kunnen allergenen bevatten die je niet aan de naam van een gerecht ziet.'],
        ['Kruisbesmetting kan voorkomen.', 'Alles wordt in dezelfde keuken bereid. We kunnen daarom niet garanderen dat een gerecht vrij is van een allergeen.'],
        ['Halal:', 'alle kip is halal. Dat geldt niet voor het hele menu: we bereiden ook varkensvlees, rundvlees, eend en garnalen.'],
        ['Vegetarisch', 'betekent hier: vegetarisch volgens onze menukaart. Dat is niet automatisch veganistisch. Nr. 39 en 40 zijn bijvoorbeeld met ei.'],
        ['Pittig:', 'het aantal pepers komt van onze menukaart. Eén peper is pittig, twee pepers is extra pittig.'],
      ],
      en: [
        ['Do you have an allergy?', 'Always tell us when you call. Not sure about a dish? Call first and ask the kitchen: {telefoon}.'],
        ['No complete list online yet.', 'This site does not yet have a checked allergen list per dish. The kitchen can tell you what is in a dish, its sauce and its broth.'],
        ['Sauces, broth and add-ons', 'can contain allergens that you cannot tell from the name of a dish.'],
        ['Cross-contamination can happen.', 'Everything is prepared in the same kitchen, so we cannot guarantee that a dish is free from any allergen.'],
        ['Halal:', 'all our chicken is halal. This does not apply to the whole menu: we also prepare pork, beef, duck and shrimp.'],
        ['Vegetarian', 'here means vegetarian according to our menu. That is not automatically vegan. For example, no. 39 and 40 contain egg.'],
        ['Spicy:', 'the number of peppers comes from our printed menu. One pepper is spicy, two peppers is extra spicy.'],
      ],
    },
    belKnop: { nl: 'Bel de keuken', en: 'Call the kitchen' },
  },

  dialoog: {
    titel: { nl: 'Allergenen', en: 'Allergens' },
    onbekend: {
      nl: 'Voor dit gerecht staat nog geen gecontroleerde allergenenlijst online.',
      en: 'There is no checked allergen list for this dish online yet.',
    },
    bekend: {
      nl: 'Volgens de keuken bevat dit gerecht:',
      en: 'According to the kitchen, this dish contains:',
    },
    advies: {
      nl: 'Heb je een allergie of dieetwens? Bel ons vóór je bestelt en noem het altijd bij je bestelling. Sauzen, bouillon en extra’s kunnen ook allergenen bevatten.',
      en: 'Do you have an allergy or dietary need? Call us before you order and always mention it with your order. Sauces, broth and add-ons can contain allergens too.',
    },
    kruis: {
      nl: 'Kruisbesmetting kan voorkomen. We kunnen niet garanderen dat een gerecht vrij is van een allergeen.',
      en: 'Cross-contamination can happen. We cannot guarantee that a dish is free from any allergen.',
    },
    sluiten: { nl: 'Sluiten', en: 'Close' },
  },

  ophalen: {
    titel: { nl: 'Adres en openingstijden', en: 'Address and opening hours' },
    adresTitel: { nl: 'Afhalen', en: 'Pick-up' },
    tijdenTitel: { nl: 'Openingstijden', en: 'Opening hours' },
    belTitel: { nl: 'Bestellen', en: 'Ordering' },
    evenement: {
      nl: 'Ga je naar een concert, wedstrijd of ander evenement? Bel op tijd, dan spreken we een afhaaltijd af.',
      en: 'Going to a concert, match or other event? Call in good time and we will agree on a pick-up time.',
    },
    vandaag: { nl: 'vandaag', en: 'today' },
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
  dagenReeks: {
    // hoe een reeks dagen wordt geschreven, bijv. "Maandag t/m zaterdag"
    tot: { nl: 't/m', en: 'to' },
  },

  footer: {
    menukaart: { nl: 'Originele menukaart (pdf)', en: 'Original printed menu (PDF)' },
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
