/* ------------------------------------------------------------------
   Company content. Nothing here is invented: every line is either taken
   from the current FS website or is structural copy that makes no factual
   claim. Milestones FS has not published are deliberately absent — the
   timeline component renders whatever the array contains.
-------------------------------------------------------------------*/

export const company = {
  name: 'FS Real Estate International',
  short: 'FS Invest',
  base: 'Skenderaj, Kosovë',

  /* Verified — https://fs-invest.international/rreth-nesh/ */
  mission: 'Angazhimi ynë është të ripërcaktojmë peizazhin e jetesës urbane përmes zhvillimit inovativ.',

  intro:
    'FS Invest zhvillon objekte banimi dhe hapësira afariste në Kosovë. Puna jonë nis me kushtet urbanistike ' +
    'dhe përfundon me dorëzimin e hapësirave — planifikim, menaxhim dhe mbikëqyrje të ndërtimit nën një çati.',

  /* Verified — https://fs-invest.international/sherbimet/ */
  services: [
    { title: 'Shitje & ndërmjetësim', body: 'Menaxhim i portfolios dhe mbështetje gjatë blerjes, shitjes apo qiradhënies.' },
    { title: 'Planifikimi i ndërtimit', body: 'Analizë e pronës dhe konsulencë në planifikimin e projekteve ndërtimore.' },
    { title: 'Menaxhimi i ndërtimit', body: 'Koordinim i të gjitha kompanive në kantier dhe përputhje me planet e miratuara.' },
    { title: 'Analizimi', body: 'Vlerësim i pronave dhe lokacioneve për potencial zhvillimi.' },
    { title: 'Ndërtim me çelës në dorë', body: 'Objekte të reja banimi me planifikim individual dhe bashkëpunim të ngushtë me klientin.' },
    { title: 'Marketingu', body: 'Promovim i pronave përmes kanaleve tradicionale dhe digjitale.' },
    { title: 'Mbikëqyrja e ndërtimit', body: 'Monitorim i ecurisë, siguria në punë dhe përputhshmëria ligjore e kontratave.' },
  ],

  /* Verified — figures published by FS on rreth-nesh */
  published: [
    { label: 'Kënaqshmëri — banim', value: '99', unit: '%' },
    { label: 'Kënaqshmëri — afarizëm', value: '95', unit: '%' },
  ],

  process: [
    { n: '01', title: 'Planifikim strategjik dhe dizajn', body: 'Kushtet urbanistike, programi dhe koncepti arkitektonik.' },
    { n: '02', title: 'Menaxhim efikas i projektit', body: 'Koordinim i ekipeve, afateve dhe dokumentacionit.' },
    { n: '03', title: 'Ndërtim cilësor dhe dorëzim', body: 'Mbikëqyrje e vazhdueshme deri te dorëzimi te klienti.' },
  ],

  /* Only dates FS has itself published are listed. */
  milestones: [
    {
      year: '2023',
      title: 'Kompleksi Dardania publikohet',
      body: 'Projekti prezantohet publikisht si zhvillimi kryesor i FS në qendër të Skenderajt.',
      source: 'fs-website' as const,
    },
    {
      year: '2024',
      title: 'Tipologjitë e Bllokut A',
      body: 'Dymbëdhjetë tipologji banesash publikohen me sipërfaqe, strukturë dhomash dhe disponueshmëri sipas kateve.',
      source: 'fs-website' as const,
    },
    {
      year: 'Në vazhdim',
      title: 'Realizimi i Kompleksit Dardania',
      body: 'Zhvillimi vazhdon në bashkëpunim me Froject Architecture.',
      source: 'fs-website' as const,
    },
  ],
};
