// Het menu van Asian Kitchen Arena.
// Bron: de menukaart-pdf (bron/menukaart-origineel.pdf). Bij twijfel is die pdf leidend.
//
// Zo werkt een gerecht:
//   nr:      het nummer dat klanten aan de telefoon noemen (tekst, dus '2a' of '22')
//   prijs:   in euro's, met een punt: 13.5 betekent € 13,50
//   naam:    naam in het Nederlands (nl) en Engels (en)
//   inhoud:  wat er standaard bij zit (mag leeg blijven: null)
//   labels:  'halal-kip', 'vegetarisch' en/of 'varkensvlees'
//   peper:   1 of 2 pepers zoals op de menukaart (0 = niet pittig)
//   foto:    bestandsnaam in src/images (of null)
//
// Per categorie zegt 'rijstRuilen' bij welke gerechten de witte rijst geruild kan worden
// voor eiernoedels of nasi: true (alle gerechten), een lijst nummers, of false.
//   allergenen: null = nog niet gecontroleerd (de site zegt dan: bel de keuken).
//              Pas invullen als de keuken het heeft gecontroleerd, bijvoorbeeld:
//              allergenen: ['gluten', 'ei', 'soja'],
//              Mogelijke namen: zie 'allergenen' in content/teksten.mjs.

const metRijst = {
  nl: 'Met groenten en witte rijst.',
  en: 'With vegetables and white rice.',
};

function gerecht(nr, prijs, nl, en, opties = {}) {
  return {
    nr,
    prijs,
    naam: { nl, en },
    inhoud: opties.inhoud ?? null,
    labels: opties.labels ?? [],
    peper: opties.peper ?? 0,
    foto: opties.foto ?? null,
    allergenen: opties.allergenen ?? null,
  };
}

export const categorieen = [
  {
    id: 'noedels-nasi',
    naam: { nl: 'Noedels & nasi', en: 'Noodles & fried rice' },
    intro: {
      nl: 'Gebakken eiernoedels of nasi (gebakken rijst met ei), met groenten.',
      en: 'Egg fried noodles or egg fried rice, with vegetables.',
    },
    rijstRuilen: false,
    groepen: [
      {
        titel: { nl: 'Gebakken eiernoedels', en: 'Egg fried noodles' },
        gerechten: [
          gerecht('2a', 13.0, 'Noedels met kip', 'Noodles with chicken', {
            inhoud: { nl: 'Eiernoedels met kip en groenten.', en: 'Egg noodles with chicken and vegetables.' },
            labels: ['halal-kip'],
          }),
          gerecht('3a', 14.0, 'Noedels met rundvlees', 'Noodles with beef', {
            inhoud: { nl: 'Eiernoedels met rundvlees en groenten.', en: 'Egg noodles with beef and vegetables.' },
          }),
          gerecht('4a', 15.0, 'Noedels met garnalen', 'Noodles with shrimp', {
            inhoud: { nl: 'Eiernoedels met garnalen en groenten.', en: 'Egg noodles with shrimp and vegetables.' },
          }),
        ],
      },
      {
        titel: { nl: 'Nasi (gebakken rijst met ei)', en: 'Egg fried rice' },
        gerechten: [
          gerecht('2b', 13.0, 'Nasi met kip', 'Fried rice with chicken', {
            inhoud: { nl: 'Gebakken rijst met ei, kip en groenten.', en: 'Egg fried rice with chicken and vegetables.' },
            labels: ['halal-kip'],
          }),
          gerecht('3b', 14.0, 'Nasi met rundvlees', 'Fried rice with beef', {
            inhoud: { nl: 'Gebakken rijst met ei, rundvlees en groenten.', en: 'Egg fried rice with beef and vegetables.' },
          }),
          gerecht('4b', 15.0, 'Nasi met garnalen', 'Fried rice with shrimp', {
            inhoud: { nl: 'Gebakken rijst met ei, garnalen en groenten.', en: 'Egg fried rice with shrimp and vegetables.' },
          }),
        ],
      },
    ],
  },

  {
    id: 'kip',
    naam: { nl: 'Kip', en: 'Chicken' },
    intro: {
      nl: 'Met groenten en witte rijst. Alle kip is halal.',
      en: 'With vegetables and white rice. All our chicken is halal.',
    },
    rijstRuilen: true,
    gerechten: [
      gerecht('19', 13.5, 'Kip met kerriesaus', 'Chicken curry', { inhoud: metRijst, labels: ['halal-kip'], peper: 1 }),
      gerecht('20', 13.5, 'Kip met zwarte bonensaus (zoutig)', 'Chicken black bean (salty)', { inhoud: metRijst, labels: ['halal-kip'], peper: 1 }),
      gerecht('21', 13.5, 'Kip zoetzuur', 'Chicken sweet & sour', { inhoud: metRijst, labels: ['halal-kip'] }),
      gerecht('22', 13.5, 'Kip Szechuan (pittig)', 'Chicken Szechuan (spicy)', { inhoud: metRijst, labels: ['halal-kip'], peper: 2, foto: 'nr-22.webp' }),
      gerecht('23', 13.5, 'Kip Gong Bao (zoet en pittig)', 'Chicken Gong Bao (sweet & spicy)', { inhoud: metRijst, labels: ['halal-kip'], peper: 1 }),
      gerecht('24', 13.5, 'Kip met oestersaus', 'Chicken oyster sauce', { inhoud: metRijst, labels: ['halal-kip'] }),
    ],
  },

  {
    id: 'rund',
    naam: { nl: 'Rundvlees', en: 'Beef' },
    intro: { nl: 'Met groenten en witte rijst.', en: 'With vegetables and white rice.' },
    rijstRuilen: true,
    gerechten: [
      gerecht('25', 15.5, 'Rundvlees met kerriesaus', 'Beef curry', { inhoud: metRijst, peper: 1 }),
      gerecht('26', 15.5, 'Rundvlees met zwarte bonensaus (zoutig)', 'Beef black bean (salty)', { inhoud: metRijst, peper: 1 }),
      gerecht('27', 15.5, 'Rundvlees zoetzuur', 'Beef sweet & sour', { inhoud: metRijst }),
      gerecht('28', 15.5, 'Rundvlees Szechuan (pittig)', 'Beef Szechuan (spicy)', { inhoud: metRijst, peper: 2 }),
      gerecht('29', 15.5, 'Rundvlees Gong Bao (zoet en pittig)', 'Beef Gong Bao (sweet & spicy)', { inhoud: metRijst, peper: 1 }),
      gerecht('30', 15.5, 'Rundvlees met oestersaus', 'Beef oyster sauce', { inhoud: metRijst }),
    ],
  },

  {
    id: 'garnalen',
    naam: { nl: 'Garnalen', en: 'Shrimp' },
    intro: { nl: 'Met groenten en witte rijst.', en: 'With vegetables and white rice.' },
    rijstRuilen: true,
    gerechten: [
      gerecht('31', 17.5, 'Garnalen met kerriesaus', 'Shrimp curry', { inhoud: metRijst, peper: 1 }),
      gerecht('32', 17.5, 'Garnalen met zwarte bonensaus (zoutig)', 'Shrimp black bean (salty)', { inhoud: metRijst, peper: 1 }),
      gerecht('33', 17.5, 'Garnalen zoetzuur', 'Shrimp sweet & sour', { inhoud: metRijst }),
      gerecht('34', 17.5, 'Garnalen Szechuan (pittig)', 'Shrimp Szechuan (spicy)', { inhoud: metRijst, peper: 2 }),
      gerecht('35', 17.5, 'Garnalen Gong Bao (zoet en pittig)', 'Shrimp Gong Bao (sweet & spicy)', { inhoud: metRijst, peper: 1 }),
      gerecht('36', 17.5, 'Garnalen met oestersaus', 'Shrimp oyster sauce', { inhoud: metRijst }),
    ],
  },

  {
    id: 'specialiteiten',
    naam: { nl: 'Specialiteiten', en: 'Specials' },
    intro: {
      nl: 'Aanbevolen door de keuken.',
      en: 'Recommended by our kitchen.',
    },
    rijstRuilen: ['15', '16', '16a'],
    gerechten: [
      gerecht('15', 19.5, 'Knapperige Pekingeend', 'Crispy Peking duck', {
        inhoud: { nl: 'Met saus van de chef en witte rijst.', en: "With the chef's sauce and white rice." },
      }),
      gerecht('16', 17.5, 'Char siu', 'Char siu', {
        inhoud: { nl: 'Geroosterd varkensvlees met witte rijst.', en: 'Roasted pork with white rice.' },
        labels: ['varkensvlees'],
      }),
      gerecht('16a', 18.5, 'Geroosterd buikspek', 'Roasted pork belly', {
        inhoud: { nl: 'Met witte rijst.', en: 'With white rice.' },
        labels: ['varkensvlees'],
      }),
      gerecht('17', 16.0, 'Noedels Singapore', 'Singapore noodles', {
        inhoud: {
          nl: 'Noedels met char siu (geroosterd varkensvlees) en garnalen in kerriesaus.',
          en: 'Noodles with char siu (roasted pork) and shrimp in curry sauce.',
        },
        labels: ['varkensvlees'],
      }),
      gerecht('18', 16.0, 'Nasi Yeung Chow', 'Yeung Chow fried rice', {
        inhoud: {
          nl: 'Gebakken rijst met char siu (geroosterd varkensvlees) en garnalen.',
          en: 'Fried rice with char siu (roasted pork) and shrimp.',
        },
        labels: ['varkensvlees'],
      }),
    ],
  },

  {
    id: 'vegetarisch',
    naam: { nl: 'Vegetarisch', en: 'Vegetarian' },
    intro: {
      nl: 'Vegetarisch volgens onze menukaart. Vegetarisch is niet hetzelfde als veganistisch.',
      en: 'Vegetarian according to our menu. Vegetarian is not the same as vegan.',
    },
    rijstRuilen: ['37'],
    gerechten: [
      gerecht('37', 14.5, 'Roergebakken groenten', 'Stir-fried mixed vegetables', {
        inhoud: { nl: 'Gemengde groenten uit de wok, met witte rijst.', en: 'Mixed vegetables from the wok, with white rice.' },
        labels: ['vegetarisch'],
      }),
      gerecht('39', 12.5, 'Nasi met ei en groenten', 'Fried rice with egg & vegetables', {
        inhoud: { nl: 'Gebakken rijst met ei en gemengde groenten.', en: 'Fried rice with egg and mixed vegetables.' },
        labels: ['vegetarisch'],
        foto: 'nr-39.webp',
      }),
      gerecht('40', 12.5, 'Noedels met ei en groenten', 'Noodles with egg & vegetables', {
        inhoud: { nl: 'Noedels met ei en gemengde groenten.', en: 'Noodles with egg and mixed vegetables.' },
        labels: ['vegetarisch'],
        foto: 'nr-40.webp',
      }),
      gerecht('46', 16.0, 'Noedelsoep met groenten', 'Mixed vegetable noodle soup', {
        inhoud: { nl: 'Maaltijdsoep met noedels en gemengde groenten.', en: 'A meal-size soup with noodles and mixed vegetables.' },
        labels: ['vegetarisch'],
      }),
    ],
  },

  {
    id: 'noedelsoep',
    naam: { nl: 'Noedelsoep (maaltijd)', en: 'Noodle soup (meal)' },
    intro: {
      nl: 'Een grote kom soep met noedels: een volledige maaltijd. Vegetarisch? Kijk bij nr. 46.',
      en: 'A big bowl of soup with noodles: a full meal. Vegetarian? See no. 46.',
    },
    rijstRuilen: false,
    gerechten: [
      gerecht('41', 14.5, 'Wonton-noedelsoep', 'Wonton noodle soup', {
        inhoud: { nl: 'Met noedels en wontons gevuld met varkensvlees.', en: 'With noodles and wontons filled with pork.' },
        labels: ['varkensvlees'],
      }),
      gerecht('43', 17.5, 'Char siu-noedelsoep', 'Char siu noodle soup', {
        inhoud: { nl: 'Met noedels en char siu (geroosterd varkensvlees).', en: 'With noodles and char siu (roasted pork).' },
        labels: ['varkensvlees'],
      }),
      gerecht('44', 19.5, 'Pekingeend-noedelsoep', 'Peking duck noodle soup', {
        inhoud: { nl: 'Met noedels en Pekingeend.', en: 'With noodles and Peking duck.' },
      }),
    ],
  },

  {
    id: 'soep',
    naam: { nl: 'Soep (klein)', en: 'Soup (small)' },
    intro: {
      nl: 'Een kleine soep, als voorgerecht of erbij. Zin in een hele maaltijd? Kies een noedelsoep.',
      en: 'A small soup, as a starter or on the side. Want a full meal? Choose a noodle soup.',
    },
    rijstRuilen: false,
    gerechten: [
      gerecht('5', 5.5, 'Kippensoep', 'Chicken soup', { labels: ['halal-kip'] }),
      gerecht('6', 5.5, 'Groentesoep', 'Vegetable soup', { labels: ['vegetarisch'] }),
      gerecht('7', 6.5, 'Wontonsoep', 'Wonton soup', {
        inhoud: { nl: 'Heldere bouillon met wontons gevuld met varkensvlees.', en: 'Clear broth with wontons filled with pork.' },
        labels: ['varkensvlees'],
      }),
    ],
  },

  {
    id: 'bites',
    naam: { nl: 'Bites & voorgerechten', en: 'Bites & starters' },
    intro: null,
    rijstRuilen: false,
    gerechten: [
      gerecht('9', 6.0, 'Kipsaté', 'Chicken satay', {
        inhoud: { nl: '3 spiezen.', en: '3 skewers.' },
        labels: ['halal-kip'],
      }),
      gerecht('11', 6.0, 'Gestoomde kipdumplings (siu mai)', 'Steamed chicken dumplings (siu mai)', {
        inhoud: { nl: '4 stuks.', en: '4 pieces.' },
        labels: ['halal-kip'],
        foto: 'nr-11.webp',
      }),
      gerecht('12', 6.0, 'Gefrituurde kipdumplings (siu mai)', 'Fried chicken dumplings (siu mai)', {
        inhoud: { nl: '4 stuks.', en: '4 pieces.' },
        labels: ['halal-kip'],
      }),
      gerecht('13', 5.0, "Mini-loempia's", 'Mini spring rolls', {
        inhoud: { nl: '6 stuks.', en: '6 pieces.' },
        labels: ['vegetarisch'],
        foto: 'nr-13.webp',
      }),
      gerecht('14', 5.5, 'Krokante garnalen', 'Crispy shrimp', {
        inhoud: { nl: '2 stuks.', en: '2 pieces.' },
        foto: 'nr-14.webp',
      }),
    ],
  },
];

// Extra's bij hoofdgerechten (menukaart: "Add-ons for main dishes").
export const extras = {
  id: 'extras',
  naam: { nl: "Extra's", en: 'Add-ons' },
  // Vervangen: je krijgt dit IN PLAATS VAN de witte rijst.
  vervangen: [
    { prijs: 2.5, naam: { nl: 'Eiernoedels of nasi met ei in plaats van witte rijst', en: 'Egg noodles or egg fried rice instead of white rice' } },
  ],
  // Erbij: een extra portie BOVENOP je gerecht.
  erbij: [
    { prijs: 2.5, naam: { nl: 'Saus', en: 'Sauce' } },
    { prijs: 3.5, naam: { nl: 'Witte rijst', en: 'White rice' } },
    { prijs: 5.5, naam: { nl: 'Eiernoedels', en: 'Egg noodles' } },
    { prijs: 5.5, naam: { nl: 'Nasi met ei', en: 'Egg fried rice' } },
    { prijs: 4.0, naam: { nl: 'Kip (halal)', en: 'Chicken (halal)' } },
    { prijs: 4.5, naam: { nl: 'Rundvlees', en: 'Beef' } },
    { prijs: 4.5, naam: { nl: 'Garnalen (3 stuks)', en: 'Shrimp (3 pieces)' } },
    { prijs: 4.0, naam: { nl: 'Groenten', en: 'Vegetables' } },
    { prijs: 2.5, naam: { nl: 'Ei', en: 'Egg' } },
  ],
};

// Dranken. Een groep met één prijs geldt voor alle keuzes in die groep.
export const dranken = {
  id: 'dranken',
  naam: { nl: 'Dranken', en: 'Drinks' },
  items: [
    {
      prijs: 3.5,
      naam: { nl: 'Frisdrank, sap of water', en: 'Soft drink, juice or water' },
      keuzes: {
        nl: 'Coca-Cola (regular of zero), Sprite, Fanta Orange, mangosap, Ice Tea Green, Fernandes (cherry of green punch), Spa water (zonder of met prik)',
        en: 'Coca-Cola (regular or zero), Sprite, Fanta Orange, mango juice, Ice Tea Green, Fernandes (cherry or green punch), Spa water (still or sparkling)',
      },
    },
    { prijs: 4.5, naam: { nl: 'Red Bull', en: 'Red Bull' } },
    { prijs: 4.5, naam: { nl: 'Bier, blikje (330 ml)', en: 'Beer, can (330 ml)' }, alcohol: true },
    { prijs: 4.5, naam: { nl: 'Bier, 25 cl', en: 'Beer, 25 cl' }, alcohol: true },
    { prijs: 8.0, naam: { nl: 'Bier, 50 cl', en: 'Beer, 50 cl' }, alcohol: true },
    { prijs: 4.5, naam: { nl: 'Tsingtao (Chinees bier)', en: 'Tsingtao (Chinese beer)' }, alcohol: true },
    { prijs: 5.5, naam: { nl: 'Witte wijn', en: 'White wine' }, alcohol: true },
    { prijs: 5.5, naam: { nl: 'Rode wijn', en: 'Red wine' }, alcohol: true },
    { prijs: 3.5, naam: { nl: 'Chinese thee', en: 'Chinese tea' } },
    { prijs: 3.5, naam: { nl: 'Koffie', en: 'Coffee' } },
  ],
};
