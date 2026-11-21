// Het menu van Asian Kitchen Arena.
// Bron: de menukaart-pdf (bron/menukaart-origineel.pdf). Bij twijfel is die pdf leidend.
//
// Prijzen staan in euro's met een punt: 13.5 betekent € 13,50.
// Nummers zijn tekst ('2a', '22'): dat zijn de nummers die klanten aan de telefoon noemen.
// Labels: 'halal-kip', 'vegetarisch', 'varkensvlees'. Peper: 1 of 2 zoals op de menukaart.
// Allergenen: null = nog niet gecontroleerd. Pas invullen als de keuken het heeft gecontroleerd,
// bijvoorbeeld allergenen: ['gluten', 'soja'] (namen: zie 'allergenen' in content/teksten.mjs).
//
// Het menu heeft drie soorten blokken:
//   - 'lijst':  gerechten onder elkaar, eventueel in groepen (met een kopje).
//   - 'extras' en 'dranken': zonder nummers.

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

const metRijst = { nl: 'Met groenten en witte rijst.', en: 'With vegetables and white rice.' };
const halal = ['halal-kip'];

export const categorieen = [
  {
    id: 'noedels-nasi',
    soort: 'lijst',
    naam: { nl: 'Noedels & nasi', en: 'Noodles & fried rice' },
    intro: {
      nl: 'Gebakken eiernoedels of nasi (gebakken rijst met ei), met groenten.',
      en: 'Egg fried noodles or egg fried rice, with vegetables.',
    },
    groepen: [
      {
        titel: { nl: 'Gebakken eiernoedels', en: 'Egg fried noodles' },
        gerechten: [
          gerecht('2a', 13.0, 'Noedels met kip', 'Noodles with chicken', {
            inhoud: { nl: 'Eiernoedels met kip en groenten.', en: 'Egg noodles with chicken and vegetables.' },
            labels: halal,
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
            labels: halal,
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
    id: 'wok',
    soort: 'lijst',
    naam: { nl: 'Wokgerechten', en: 'Wok dishes' },
    intro: {
      nl: 'Alle wokgerechten zijn met groenten en witte rijst.',
      en: 'All wok dishes come with vegetables and white rice.',
    },
    rijstRuilen: true,
    groepen: [
      {
        titel: { nl: 'Met kip', en: 'With chicken' },
        gerechten: [
          gerecht('19', 13.5, 'Kip met kerriesaus', 'Chicken curry', { inhoud: metRijst, labels: halal, peper: 1 }),
          gerecht('20', 13.5, 'Kip met zwarte bonensaus (zoutig)', 'Chicken black bean (salty)', { inhoud: metRijst, labels: halal, peper: 1 }),
          gerecht('21', 13.5, 'Kip zoetzuur', 'Chicken sweet & sour', { inhoud: metRijst, labels: halal }),
          gerecht('22', 13.5, 'Kip Szechuan (pittig)', 'Chicken Szechuan (spicy)', { inhoud: metRijst, labels: halal, peper: 2 }),
          gerecht('23', 13.5, 'Kip Gong Bao (zoet en pittig)', 'Chicken Gong Bao (sweet & spicy)', { inhoud: metRijst, labels: halal, peper: 1 }),
          gerecht('24', 13.5, 'Kip met oestersaus', 'Chicken oyster sauce', { inhoud: metRijst, labels: halal }),
        ],
      },
      {
        titel: { nl: 'Met rundvlees', en: 'With beef' },
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
        titel: { nl: 'Met garnalen', en: 'With shrimp' },
        gerechten: [
          gerecht('31', 17.5, 'Garnalen met kerriesaus', 'Shrimp curry', { inhoud: metRijst, peper: 1 }),
          gerecht('32', 17.5, 'Garnalen met zwarte bonensaus (zoutig)', 'Shrimp black bean (salty)', { inhoud: metRijst, peper: 1 }),
          gerecht('33', 17.5, 'Garnalen zoetzuur', 'Shrimp sweet & sour', { inhoud: metRijst }),
          gerecht('34', 17.5, 'Garnalen Szechuan (pittig)', 'Shrimp Szechuan (spicy)', { inhoud: metRijst, peper: 2 }),
          gerecht('35', 17.5, 'Garnalen Gong Bao (zoet en pittig)', 'Shrimp Gong Bao (sweet & spicy)', { inhoud: metRijst, peper: 1 }),
          gerecht('36', 17.5, 'Garnalen met oestersaus', 'Shrimp oyster sauce', { inhoud: metRijst }),
        ],
      },
    ],
  },

  {
    id: 'specialiteiten',
    soort: 'lijst',
    naam: { nl: 'Specialiteiten', en: 'Specials' },
    intro: { nl: 'Aanbevolen door de keuken.', en: 'Recommended by our kitchen.' },
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
    id: 'soepen',
    soort: 'lijst',
    naam: { nl: 'Soepen', en: 'Soups' },
    intro: null,
    groepen: [
      {
        titel: { nl: 'Noedelsoep, een hele maaltijd', en: 'Noodle soup, a full meal' },
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
        noot: { nl: 'Vegetarische noedelsoep: nr. 46 bij Vegetarisch.', en: 'Vegetarian noodle soup: no. 46 under Vegetarian.' },
      },
      {
        titel: { nl: 'Kleine soep, vooraf of erbij', en: 'Small soup, as a starter or on the side' },
        gerechten: [
          gerecht('5', 5.5, 'Kippensoep', 'Chicken soup', { labels: ['halal-kip'] }),
          gerecht('6', 5.5, 'Groentesoep', 'Vegetable soup', { labels: ['vegetarisch'] }),
          gerecht('7', 6.5, 'Wontonsoep', 'Wonton soup', {
            inhoud: { nl: 'Heldere bouillon met wontons gevuld met varkensvlees.', en: 'Clear broth with wontons filled with pork.' },
            labels: ['varkensvlees'],
          }),
        ],
      },
    ],
  },

  {
    id: 'vegetarisch',
    soort: 'lijst',
    naam: { nl: 'Vegetarisch', en: 'Vegetarian' },
    intro: {
      nl: 'Vegetarisch volgens onze menukaart. Dat is niet hetzelfde als veganistisch.',
      en: 'Vegetarian according to our menu. That is not the same as vegan.',
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
      }),
      gerecht('40', 12.5, 'Noedels met ei en groenten', 'Noodles with egg & vegetables', {
        inhoud: { nl: 'Noedels met ei en gemengde groenten.', en: 'Noodles with egg and mixed vegetables.' },
        labels: ['vegetarisch'],
      }),
      gerecht('46', 16.0, 'Noedelsoep met groenten', 'Mixed vegetable noodle soup', {
        inhoud: { nl: 'Maaltijdsoep met noedels en gemengde groenten.', en: 'A meal-size soup with noodles and mixed vegetables.' },
        labels: ['vegetarisch'],
      }),
    ],
  },

  {
    id: 'bites',
    soort: 'lijst',
    naam: { nl: 'Bites', en: 'Bites' },
    intro: { nl: 'Kleine gerechten, om te delen of vooraf.', en: 'Small dishes, to share or as a starter.' },
    gerechten: [
      gerecht('9', 6.0, 'Kipsaté', 'Chicken satay', {
        inhoud: { nl: '3 spiezen.', en: '3 skewers.' },
        labels: ['halal-kip'],
      }),
      gerecht('11', 6.0, 'Gestoomde kipdumplings (siu mai)', 'Steamed chicken dumplings (siu mai)', {
        inhoud: { nl: '4 stuks.', en: '4 pieces.' },
        labels: ['halal-kip'],
      }),
      gerecht('12', 6.0, 'Gefrituurde kipdumplings (siu mai)', 'Fried chicken dumplings (siu mai)', {
        inhoud: { nl: '4 stuks.', en: '4 pieces.' },
        labels: ['halal-kip'],
      }),
      gerecht('13', 5.0, "Mini-loempia's", 'Mini spring rolls', {
        inhoud: { nl: '6 stuks.', en: '6 pieces.' },
        labels: ['vegetarisch'],
      }),
      gerecht('14', 5.5, 'Krokante garnalen', 'Crispy shrimp', {
        inhoud: { nl: '2 stuks.', en: '2 pieces.' },
      }),
    ],
  },

  {
    id: 'extras',
    soort: 'extras',
    naam: { nl: "Extra's", en: 'Add-ons' },
    // Ruilen: je krijgt dit IN PLAATS VAN de witte rijst.
    vervangen: [
      { prijs: 2.5, naam: { nl: 'Eiernoedels of nasi met ei in plaats van witte rijst', en: 'Egg noodles or egg fried rice instead of white rice' } },
    ],
    // Erbij: een extra portie BOVENOP je gerecht.
    erbij: [
      { prijs: 2.5, naam: { nl: 'Saus', en: 'Sauce' } },
      { prijs: 3.5, naam: { nl: 'Witte rijst', en: 'White rice' }, sleutel: 'witte-rijst' },
      { prijs: 5.5, naam: { nl: 'Eiernoedels', en: 'Egg noodles' } },
      { prijs: 5.5, naam: { nl: 'Nasi met ei', en: 'Egg fried rice' } },
      { prijs: 4.0, naam: { nl: 'Kip (halal)', en: 'Chicken (halal)' } },
      { prijs: 4.5, naam: { nl: 'Rundvlees', en: 'Beef' } },
      { prijs: 4.5, naam: { nl: 'Garnalen (3 stuks)', en: 'Shrimp (3 pieces)' } },
      { prijs: 4.0, naam: { nl: 'Groenten', en: 'Vegetables' } },
      { prijs: 2.5, naam: { nl: 'Ei', en: 'Egg' } },
    ],
  },

  {
    id: 'dranken',
    soort: 'dranken',
    naam: { nl: 'Dranken', en: 'Drinks' },
    // Een regel met 'keuzes' heeft één prijs voor alle keuzes.
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
  },
];

// Alle gerechten met nummer, als platte lijst (voor controles, zoekmachines en schermlezers).
export function alleGerechten(taal = 'nl') {
  const uit = [];
  for (const c of categorieen) {
    if (c.soort !== 'lijst') continue;
    const lijsten = c.groepen ? c.groepen.flatMap((g) => g.gerechten) : c.gerechten;
    for (const g of lijsten) uit.push({ ...g, naam: g.naam[taal], categorie: c.id });
  }
  return uit;
}
