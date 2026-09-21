import { project } from '../data/project.ts';

const STEPS = [
  { k: 'Kosovë', s: 'Republika e Kosovës' },
  { k: 'Skenderaj', s: 'Rajoni i Drenicës' },
  { k: 'Në zemër të qytetit', s: 'Qendra urbane' },
  { k: 'Dardania Complex', s: 'Rr. Sala e Hamit Jashari' },
];

/** Scroll-driven approach sequence: country → town → centre → the complex. */
export function locationScene(): string {
  const lat = project.coordinates.lat.toFixed(4);
  const lng = project.coordinates.lng.toFixed(4);
  return `<section class="loc deep" data-location aria-label="Lokacioni">
  <div class="loc__scroll">
    <div class="loc__stage" data-loc-stage>
      <div class="loc__media">
        <picture>
          <source media="(min-width:900px)" srcset="/dardania/masterplan/complex-dusk.webp">
          <img src="/dardania/masterplan/complex-dusk.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
        </picture>
      </div>
      <svg class="loc__rings" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g class="loc__ring-g">
          <circle cx="50" cy="50" r="44"></circle>
          <circle cx="50" cy="50" r="30"></circle>
          <circle cx="50" cy="50" r="18"></circle>
          <circle cx="50" cy="50" r="8"></circle>
        </g>
        <g class="loc__cross">
          <line x1="50" y1="0" x2="50" y2="100"></line>
          <line x1="0" y1="50" x2="100" y2="50"></line>
        </g>
      </svg>
      <div class="loc__grain" aria-hidden="true"></div>

      <ol class="loc__index" aria-hidden="true">
        ${STEPS.map((s, i) => `<li data-loc-tick><i></i><span>${s.k}</span><em>0${i + 1}</em></li>`).join('')}
      </ol>

      <div class="loc__copy">
        ${STEPS.map((s, i) => `<div class="loc__step" data-loc-step>
          <p class="label">0${i + 1} / 04</p>
          <h2 class="display h1">${s.k}</h2>
          <p class="loc__sub">${s.s}</p>
        </div>`).join('')}
      </div>

      <p class="loc__coords num">${lat}° N &nbsp;·&nbsp; ${lng}° E</p>
    </div>
  </div>
</section>`;
}
