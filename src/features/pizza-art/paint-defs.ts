/**
 * Shared SVG paint (gradients, filters, clip paths) referenced by every
 * pizza drawing. Rendered once in the page by <PaintDefs /> for live SVG,
 * and inlined into each rasterised image (see rasterize.ts).
 */

const radial = (id: string, stops: [number, string, number?][], attrs = 'r="50%"') =>
  `<radialGradient id="${id}" ${attrs}>${stops
    .map(
      ([o, c, a]) =>
        `<stop offset="${o}" stop-color="${c}"${a === undefined ? "" : ` stop-opacity="${a}"`}/>`,
    )
    .join("")}</radialGradient>`;

const linear = (id: string, stops: [number, string][], dir = 'x1="0" y1="0" x2="1" y2="1"') =>
  `<linearGradient id="${id}" ${dir}>${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;

const crust = (id: string, c: string[]) =>
  radial(id, [
    [0.8, c[0]!],
    [0.875, c[1]!],
    [0.935, c[2]!],
    [0.975, c[3]!],
    [1, c[4]!],
  ]);

/** Sauce colours: centre, body, rim. */
export const SAUCE_COLORS = {
  tomato: ["#c93c22", "#b02f17", "#7f1d0c"],
  bbq: ["#7a2c14", "#5e1f0d", "#3a1106"],
  garlic: ["#f5e6bd", "#ead39a", "#c9a865"],
  creamy: ["#f7eedb", "#ecdcb6", "#cdb27c"],
  tandoori: ["#e57a35", "#c9551f", "#8d3410"],
  nutella: ["#5e3018", "#4a230f", "#2c1306"],
} as const;

export type SauceId = keyof typeof SAUCE_COLORS;

const sauces = Object.entries(SAUCE_COLORS)
  .map(([id, [a, b, c]]) =>
    radial(`gSauce-${id}`, [
      [0, a],
      [0.8, b],
      [1, c],
    ]),
  )
  .join("");

export const PAINT_DEFS = [
  `<filter id="spriteShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="3.2" flood-color="#2a0c00" flood-opacity=".35"/></filter>`,
  crust("gCrust", ["#c78a45", "#ecb56c", "#d6913f", "#a8611f", "#7c4214"]),
  crust("gCrustThin", ["#cf9550", "#f0be78", "#dc9a48", "#b06a26", "#83481a"]),
  crust("gCrustGF", ["#d9b077", "#f3d39b", "#e2b26c", "#bf8a45", "#8e6129"]),
  sauces,
  radial("gPep", [
    [0, "#b8321a"],
    [0.55, "#c94329"],
    [0.82, "#a42a15"],
    [0.93, "#6e1709"],
    [1, "#3f0c04"],
  ]),
  radial("gGrease", [
    [0.55, "#e98a2b", 0.55],
    [1, "#e98a2b", 0],
  ]),
  radial(
    "gSal",
    [
      [0, "#9c2228"],
      [0.85, "#6d1418"],
      [1, "#3d080b"],
    ],
    'cx="45%" cy="40%" r="60%"',
  ),
  linear("gHam", [
    [0, "#f2b2a6"],
    [0.6, "#e08f84"],
    [1, "#c36f66"],
  ]),
  radial(
    "gMush",
    [
      [0, "#f3e8d4"],
      [0.7, "#dcc6a2"],
      [1, "#a7835b"],
    ],
    'cx="45%" cy="35%" r="70%"',
  ),
  linear(
    "gCap",
    [
      [0, "#4fae4a"],
      [1, "#1f6a2a"],
    ],
    'x1="0" y1="0" x2="0" y2="1"',
  ),
  radial(
    "gOlive",
    [
      [0, "#6a4458"],
      [0.6, "#3a2230"],
      [1, "#170c12"],
    ],
    'cx="40%" cy="35%" r="70%"',
  ),
  linear("gPine", [
    [0, "#ffe58a"],
    [0.6, "#f6c94a"],
    [1, "#d79c22"],
  ]),
  linear(
    "gOnion",
    [
      [0, "#c472a4"],
      [1, "#7d3263"],
    ],
    'x1="0" y1="0" x2="0" y2="1"',
  ),
  radial(
    "gChick",
    [
      [0, "#f4d3a3"],
      [0.7, "#dcaa6c"],
      [1, "#a86e34"],
    ],
    'cx="40%" cy="35%" r="75%"',
  ),
  radial("gJal", [
    [0.62, "#d9eab0"],
    [0.68, "#5ba843"],
    [1, "#2b6e26"],
  ]),
  radial(
    "gBeef",
    [
      [0, "#9a6040"],
      [1, "#4a2412"],
    ],
    'cx="40%" cy="35%" r="70%"',
  ),
  radial("gTom", [
    [0, "#f88a6c"],
    [0.7, "#e2462e"],
    [0.92, "#c2311d"],
    [1, "#9c2211"],
  ]),
  linear("gBasil", [
    [0, "#5fb556"],
    [0.6, "#2f8435"],
    [1, "#1c5a24"],
  ]),
  linear("gSpinach", [
    [0, "#3f8a3a"],
    [0.6, "#24612a"],
    [1, "#123d18"],
  ]),
  radial(
    "gDollop",
    [
      [0, "#fffbea"],
      [0.6, "#fbeab8"],
      [1, "#ebc56c"],
    ],
    'cx="40%" cy="35%" r="65%"',
  ),
  radial(
    "gBocc",
    [
      [0, "#ffffff"],
      [0.65, "#f7f1e2"],
      [1, "#d9ccaa"],
    ],
    'cx="38%" cy="32%" r="70%"',
  ),
  radial(
    "gYolk",
    [
      [0, "#ffd75e"],
      [0.7, "#f7a51c"],
      [1, "#d27b0e"],
    ],
    'cx="40%" cy="35%" r="65%"',
  ),
  linear(
    "gPrawn",
    [
      [0, "#ffb38a"],
      [0.5, "#f47b4f"],
      [1, "#d4502c"],
    ],
    'x1="0" y1="0" x2="1" y2="0"',
  ),
  linear(
    "gAnchovy",
    [
      [0, "#a7a39b"],
      [0.5, "#6b4a35"],
      [1, "#3d2416"],
    ],
    'x1="0" y1="0" x2="0" y2="1"',
  ),
  radial(
    "gSausage",
    [
      [0, "#d48a6a"],
      [0.75, "#b9654a"],
      [1, "#6e2f1e"],
    ],
    'cx="45%" cy="40%" r="60%"',
  ),
  linear("gKebab", [
    [0, "#b9784a"],
    [0.6, "#8a4f2a"],
    [1, "#5a2e14"],
  ]),
  `<filter id="wood" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .09" numOctaves="3" seed="8" result="g"/><feColorMatrix in="g" type="matrix" values=".5 0 0 0 .62  .5 0 0 0 .62  .5 0 0 0 .62  0 0 0 0 1" result="grain"/><feFlood class="wood-flood" style="flood-color: var(--board)" result="col"/><feComposite in="grain" in2="col" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="tinted"/><feComposite in="tinted" in2="SourceGraphic" operator="in"/></filter>`,
  `<filter id="dough" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="2" seed="3" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="12" xChannelSelector="R" yChannelSelector="G" result="shape"/><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="4" seed="4" result="noise"/><feDiffuseLighting in="noise" surfaceScale="1.8" lighting-color="#fff" result="lit"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting><feComposite in="lit" in2="shape" operator="arithmetic" k1="1.22" k2="0" k3="0" k4="0" result="tex"/><feComposite in="tex" in2="shape" operator="in"/></filter>`,
  `<filter id="leopard" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".085" numOctaves="2" seed="11" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .2  0 0 0 0 .09  0 0 0 0 .03  11 0 0 0 -6.9" result="spots"/><feGaussianBlur in="spots" stdDeviation=".8" result="soft"/><feComposite in="soft" in2="SourceGraphic" operator="in"/></filter>`,
  `<filter id="sauceTex" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="2" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="14" xChannelSelector="R" yChannelSelector="G" result="shape"/><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="6" result="n"/><feSpecularLighting in="n" surfaceScale="2" specularConstant=".55" specularExponent="22" lighting-color="#ffd2bf" result="spec"><feDistantLight azimuth="225" elevation="40"/></feSpecularLighting><feComposite in="spec" in2="shape" operator="in" result="specIn"/><feMerge><feMergeNode in="shape"/><feMergeNode in="specIn"/></feMerge></filter>`,
  `<filter id="mozz" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".016" numOctaves="2" seed="5" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="30" xChannelSelector="R" yChannelSelector="G" result="shape"/><feGaussianBlur in="shape" stdDeviation="3.5" result="soft"/><feFlood flood-color="#4a1005" flood-opacity=".5"/><feComposite in2="soft" operator="in"/><feOffset dx="1.5" dy="2.5" result="shade"/><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="9" result="bub"/><feComposite in="bub" in2="soft" operator="arithmetic" k1="0" k2=".35" k3="1" k4="0" result="bump"/><feSpecularLighting in="bump" surfaceScale="5" specularConstant=".85" specularExponent="16" lighting-color="#fff6d8" result="spec"><feDistantLight azimuth="225" elevation="48"/></feSpecularLighting><feComposite in="spec" in2="shape" operator="in" result="specIn"/><feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="3" seed="21" result="sp"/><feColorMatrix in="sp" type="matrix" values="0 0 0 0 .80  0 0 0 0 .52  0 0 0 0 .18  12 0 0 0 -7.3" result="brown"/><feGaussianBlur in="brown" stdDeviation="1.2" result="brownSoft"/><feComposite in="brownSoft" in2="shape" operator="in" result="brownIn"/><feMerge><feMergeNode in="shade"/><feMergeNode in="shape"/><feMergeNode in="brownIn"/><feMergeNode in="specIn"/></feMerge></filter>`,
  `<filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1.4" dy="2.4" stdDeviation="1.5" flood-color="#3a0d05" flood-opacity=".5"/></filter>`,
  `<filter id="blur14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>`,
  `<filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>`,
  `<radialGradient id="gLight" cx="32%" cy="28%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#2a0c00" stop-opacity=".1"/><stop offset="1" stop-color="#2a0c00" stop-opacity=".3"/></radialGradient>`,
  `<clipPath id="clipL"><rect x="-255" y="-255" width="254" height="510"/></clipPath>`,
  `<clipPath id="clipR"><rect x="1" y="-255" width="254" height="510"/></clipPath>`,
].join("");
