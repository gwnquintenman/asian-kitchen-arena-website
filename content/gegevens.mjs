// Contactgegevens en openingstijden van Asian Kitchen Arena.
// Pas hier iets aan en bouw daarna de website opnieuw (dubbelklik bouw.cmd).

export default {
  naam: 'Asian Kitchen Arena',

  telefoon: {
    weergave: '020 365 7971',          // zo staat het nummer op de site
    internationaal: '+31 20 365 7971', // voor bezoekers met een buitenlands nummer
    link: 'tel:+31203657971',          // wat een telefoon belt als je op de knop tikt
  },

  adres: {
    straat: 'Johan Cruijff Boulevard 81',
    postcode: '1101 DL',
    plaats: 'Amsterdam',
    // oude straatnaam, klein onder het adres zodat bezoekers het herkennen (null = weglaten)
    voorheen: { nl: 'voorheen Arena Boulevard', en: 'formerly Arena Boulevard' },
  },

  // Routeknop: opent Google Maps met een route naar het adres.
  routeLink: 'https://www.google.com/maps/dir/?api=1&destination=Asian+Kitchen%2C+Johan+Cruijff+Boulevard+81%2C+1101+DL+Amsterdam',

  // Openingstijden. Dagen: ma di wo do vr za zo. Tijden als 'uu:mm'.
  openingstijden: [
    { dagen: ['ma', 'di', 'wo', 'do', 'vr', 'za'], open: '11:30', dicht: '21:15' },
    { dagen: ['zo'], open: '13:00', dicht: '20:45' },
  ],
  // Uitzondering die bij zondag wordt getoond.
  uitzondering: {
    nl: 'Bij een voetbalwedstrijd op zondag zijn we open vanaf 12:00.',
    en: 'On Sundays with a football match we open at 12:00.',
  },

  // Adres van de echte website (voor zoekmachines en deel-links). Eindigt op een /.
  websiteUrl: 'https://www.asiankitchen.nl/Arena/',

  // De originele menukaart (staat in src/), wordt als extra download aangeboden.
  menukaartPdf: 'menukaart-asian-kitchen-arena.pdf',
};
