/* Albanian is the primary locale. The dictionary exists so EN/DE can be
   added without touching components — every string in the UI resolves
   through `t`. */
export type Locale = 'sq' | 'en' | 'de';

export const dict = {
  sq: {
    'status.available': 'E lirë',
    'status.reserved': 'E rezervuar',
    'status.sold': 'E shitur',
    'status.viewing': 'Po e shikoni',
    'nav.project': 'Projekti',
    'nav.company': 'Kompania',
    'nav.contact': 'Kontakt',
    'cta.explore': 'Eksploro',
    'cta.exploreBlock': 'Eksploro bllokun',
    'cta.viewFloor': 'Shiko katin',
    'cta.viewUnit': 'Shiko banesën',
    'cta.offer': 'Kërko ofertë',
    'cta.download': 'Shkarko fletën e banesës',
    'cta.downloadCommercial': 'Shkarko fletën e hapësirës',
    'cta.whatsapp': 'Shkruaj në WhatsApp',
    'label.block': 'Blloku',
    'label.floor': 'Kati',
    'label.floors': 'Kate',
    'label.units': 'Banesa',
    'label.available': 'Të lira',
    'label.area': 'Sipërfaqja',
    'label.bedrooms': 'Dhoma gjumi',
    'label.bathrooms': 'Banjo',
    'label.orientation': 'Orientimi',
    'label.typology': 'Tipologjia',
    'label.status': 'Statusi',
    'label.price': 'Çmimi',
    'label.selectFloor': 'Zgjidh katin',
    'label.selectBlock': 'Zgjidh bllokun',
    'label.sameTypology': 'Kjo tipologji gjendet edhe në',
    'label.commercial': 'Hapësira afariste',
  },
  en: {} as Record<string, string>,
  de: {} as Record<string, string>,
} as const;

export const t = (key: keyof typeof dict.sq, locale: Locale = 'sq'): string => {
  const table = dict[locale] as Record<string, string>;
  return table?.[key] ?? dict.sq[key] ?? key;
};

export const statusLabel = (s: 'available' | 'reserved' | 'sold'): string =>
  s === 'available' ? dict.sq['status.available'] : s === 'reserved' ? dict.sq['status.reserved'] : dict.sq['status.sold'];
