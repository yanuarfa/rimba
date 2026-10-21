# Rimba

Landing page for Rimba, a small conservation foundation working with villages in West Kalimantan and Central Java. It rewets burned peatland, replants mangrove coasts, and publishes its survival counts.

Built with [Astro](https://astro.build). The build output is plain static HTML and CSS with no framework runtime. The only JavaScript shipped is the page's own interaction script plus the Lottie player loaded from a CDN.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Structure

- `src/pages/index.astro` assembles the page from its sections
- `src/components/` holds one component per section (Header, Hero, Mission, Initiatives, About, FieldData, Newsletter, Contact, Footer) plus the ContourDivider between them
- `src/layouts/Base.astro` holds the document head: meta, Open Graph, canonical URL, and the NGO structured data
- `src/styles/global.css` is the full stylesheet, organized by section
- `src/scripts/engine.js` (bundled and minified by Astro) holds every interaction: scroll reveals, the contour progress line, the mobile menu, scrollspy, the counters, the seasonal hero fade, and the three Lottie animations (falling leaves, the form sprout, the stats burst)

## Notes

- The canonical domain lives in `astro.config.mjs` (`site`). Canonical URLs and `public/sitemap.xml` read from it, so change both together when the domain changes.
- Motion respects `prefers-reduced-motion`: reveals, the seasonal fade, and the Lottie animations all stand down.
- Field data on the page (planted trees, survival counts, budget split) is maintained by hand in `FieldData.astro` and `Hero.astro`. Edit the numbers there.
