/* Site-wide configuration. Everything a future CMS would own. */

export const site = {
  brand: 'FS INVEST',
  brandLines: ['FS', 'INVEST'] as const,
  tagline: 'Përtej kufijve, pranë teje.',      // FS website (verified)
  legalName: 'FS Real Estate International',    // FS website (verified)
  url: 'https://fs-invest.international',
  locale: 'sq',
  locales: ['sq', 'en', 'de'] as const,

  /* Verified from https://fs-invest.international/kontakti/ */
  contact: {
    address: 'Rr. Sala e Hamit Jashari',
    postal: '41000 Skënderaj',
    country: 'Kosovë',
    phone: '+383 44 957 190',
    phoneHref: '+38344957190',
    email: 'sales@fs-invest.international',
    maps: 'https://maps.app.goo.gl/TzBWKdmimg4oQksEA',
    facebook: 'https://www.facebook.com/profile.php?id=100094527852435',
    instagram: 'https://www.instagram.com/fsrealestateinternational/',
  },

  /* No public FS WhatsApp number has been verified. The sales number above is
     used for the deep-link; swap `whatsapp` once FS confirms the line. */
  whatsapp: {
    /** null → the UI falls back to a phone call instead of inventing a number */
    number: null as string | null,
    unverified: true,
  },

  /** Price visibility is configurable per project — see data/project.ts */
  pricing: {
    /** 'exact' | 'request' */
    mode: 'request' as 'exact' | 'request',
    requestLabel: 'Kërko ofertë',
  },

  /** Rendered as a noindex meta + a dismissible badge on every page. */
  prototype: {
    isConceptPrototype: true,
    badge: 'Koncept prototip · jo faqja zyrtare e FS Invest',
    note:
      'CONCEPT PROTOTYPE — speculative proposal for FS Invest. Contains demo data and ' +
      'placeholder assets. Not an official FS Invest production website.',
  },
} as const;

export const nav = [
  { href: '/dardania/', label: 'Projekti' },
  { href: '/dardania/hapesira-afariste/', label: 'Hapësira afariste' },
  { href: '/kompania/', label: 'Kompania' },
  { href: '/kontakt/', label: 'Kontakt' },
];
