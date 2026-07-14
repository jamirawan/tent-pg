# NT Tourism — Astro Page

Astro port of the Figma prototype build.

## Setup

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
```

## Structure

- `src/layouts/Layout.astro` — base HTML shell, fonts, meta
- `src/components/Header.astro` — sticky nav
- `src/components/Hero.astro` — hero banner with odometer + "Best Kept Season" heading
- `src/components/Odometer.astro` — reusable petrol-pump style rolling digit counter (props: `value`, `label`, `id`)
- `src/components/StorySection.astro` — reusable 80vh scrollable numbered-paragraph section (used for both `#story` and `#story2`, content passed as props/data in `index.astro`)
- `src/components/SecondBanner.astro` — text-on-top banner
- `src/components/SubmitStoryForm.astro` — placeholder "submit your story" form (wire `action` up to a real endpoint / Storyblok / API route)
- `src/components/Footer.astro`
- `src/pages/index.astro` — assembles everything + holds the story copy data arrays
- `src/styles/global.css` — design tokens (`--navy`, `--ochre`, `--orange`, etc.), reset, shared base styles

All section content (story paragraphs, banner copy) lives as plain data in `index.astro`, so swapping in real Storyblok-sourced content later is just a matter of replacing the arrays with a CMS fetch.
