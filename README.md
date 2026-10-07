# Craft Kit — Frontend Primitives

A premium, from-scratch React redesign of the "DevTools Craft Kit" prototype: a curated
toolkit of Icons, Grids, Colors, Shadows, and Motion primitives, built as a proper
production-grade single-page app.

This is **v1 of the rebuild** — home page + all five tool modules, fully designed,
animated, responsive, and theme-aware. Dashboard, auth, forms, and backend integration
were intentionally left out of this pass (see "What's not in this version" below) so the
core experience could be built to a high bar rather than spread thin.

## Stack

- React 19 + Vite 8
- React Router 7 (client-side routing, animated page transitions)
- Framer Motion (entrances, hovers, scroll reveals, replayable presets)
- Sass (custom design-token architecture — no Tailwind, no Bootstrap)
- lucide-react (icon set used both as UI chrome and as the "Icons" module content)
- react-intersection-observer (scroll-triggered reveals)

## Getting started

```bash
npm install
npm run dev       # start local dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

Requires Node 18+.

## Project structure

```
src/
  components/
    layout/         Navbar, Footer, PageTransition
    ui/              Reusable primitives: PageHero, Reveal, Counter, Toast,
                      ScrollProgress, BackToTop
  context/
    ThemeContext.jsx   Dark/light theme provider, persisted to localStorage
  hooks/
    useClipboard.js
  pages/
    Home.jsx / Home.module.scss
    Icons.jsx / Icons.module.scss
    Grids.jsx / Grids.module.scss
    Colors.jsx / Colors.module.scss
    Shadows.jsx / Shadows.module.scss
    Motion.jsx / Motion.module.scss
    NotFound.jsx
  scss/
    base/             reset, variables, utility classes
    mixins/            shared mixins (glass, gradient-text, breakpoints, focus ring…)
    themes/            CSS custom properties for dark + light mode
    main.scss          single entrypoint imported once in main.jsx
```

Styling uses **CSS Modules** (`*.module.scss`) scoped per component/page, layered on top
of global design tokens defined as CSS variables in `scss/themes/_themes.scss`. Every
color, radius, and font in the app resolves through those tokens, so re-theming the whole
product is a matter of editing one file.

## Design system highlights

- **Theme system**: `data-theme="dark" | "light"` on `<html>`, driven by
  `ThemeContext`, defaults to the user's OS preference, persists across visits.
- **Typography**: Fraunces (display serif), Bebas Neue (headline caps), Inter (body),
  DM Mono (labels/code) — loaded via Google Fonts in `index.html`.
- **Motion**: page-level transitions via `AnimatePresence` in `App.jsx`, scroll reveals
  via the `<Reveal>` wrapper, and a full interactive catalogue of reusable presets on the
  `/motion` page.
- **Accessibility**: semantic landmarks, visible focus rings (`:focus-visible`),
  `aria-label`s on icon-only controls, keyboard-operable nav/menu.

## Pages

| Route      | Description                                                          |
|------------|------------------------------------------------------------------------|
| `/`        | Landing page — hero, marquee, module grid, feature highlights, CTA     |
| `/icons`   | Searchable/filterable icon library, click-to-copy import statement     |
| `/grids`   | Five live CSS Grid layout patterns with copyable CSS                   |
| `/colors`  | Brand, neutral, and gradient color tokens, click-to-copy               |
| `/shadows` | Elevation scale, colored glows, inset/pressed shadows, click-to-copy   |
| `/motion`  | Replayable Framer Motion presets with source values                     |

## Deployment

The app builds to a static `dist/` folder and can be deployed anywhere that serves static
files (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CDN, etc.):

```bash
npm run build
# upload dist/ to your static host
```

For SPA routing to work on a static host, configure a fallback so all paths serve
`index.html` (Vercel/Netlify do this automatically for Vite SPAs; on Netlify add a
`_redirects` file containing `/* /index.html 200` if needed).

## What's not in this version

Scoped out deliberately for this pass:

- Dashboard / authenticated app shell
- Forms (React Hook Form + Zod) and contact/pricing sections
- Backend/Axios service layer, mock API, retry logic
- Command palette, keyboard shortcuts
- TypeScript (JS was used for speed; structure is TS-ready if you want to migrate)

Happy to build any of these next — just say which one.
