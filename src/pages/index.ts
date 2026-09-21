import { project } from '../data/project.ts';
import { units } from '../data/units.ts';
import { commercialUnits } from '../data/commercial.ts';
import { home } from './home.ts';
import { dardania } from './dardania.ts';
import { blockPage } from './block.ts';
import { floorPage } from './floor.ts';
import { unitPage } from './unit.ts';
import { commercialIndex, commercialPage } from './commercial.ts';
import { companyPage } from './company.ts';
import { contactPage, notFound } from './contact.ts';

export function renderAll(): [string, string][] {
  const routes: [string, string][] = [
    ['/', home()],
    ['/dardania/', dardania()],
    ['/dardania/hapesira-afariste/', commercialIndex()],
    ['/kompania/', companyPage()],
    ['/kontakt/', contactPage()],
    ['/404/', notFound()],
  ];

  for (const b of project.blocks) {
    routes.push([`/dardania/blloku/${b.id}/`, blockPage(b)]);
    for (let f = 1; f <= b.floors; f++) {
      routes.push([`/dardania/blloku/${b.id}/kati/${f}/`, floorPage(b, f)]);
    }
  }
  for (const u of units) routes.push([`/dardania/banesa/${u.id.toLowerCase()}/`, unitPage(u)]);
  for (const c of commercialUnits) routes.push([`/dardania/hapesira-afariste/${c.id.toLowerCase()}/`, commercialPage(c)]);

  return routes;
}
