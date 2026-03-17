# Galaad Neau — Portfolio (React + TypeScript)

Technical one-page portfolio rebuilt from a plain HTML/CSS/JS prototype into a modern React stack.

## Highlights
- Vite + React + TypeScript architecture
- Componentized structure:
  - `App`
  - `Hero`
  - `ScrollStory`
  - `Projects`
  - `Contact`
- Cinematic scroll-driven frame-by-frame canvas sequence
- Smoothed scroll interpolation using `requestAnimationFrame` + easing
- Milestone overlay with active scene indicator
- Existing generated assets preserved under `public/assets`

## Stack
- Vite 5
- React 18
- TypeScript 5
- ffmpeg (optional, only for regenerating placeholder assets)

## Project Structure
- `src/App.tsx` — page composition and fixed header/nav
- `src/components/Hero.tsx` — intro section
- `src/components/ScrollStory.tsx` — frame preload, canvas rendering, smooth scroll interpolation, milestone logic
- `src/components/Projects.tsx` — project/technical focus section
- `src/components/Contact.tsx` — contact block
- `src/styles.css` — global styling and responsive layout
- `public/assets/video/galaad-placeholder.mp4` — generated source video
- `public/assets/frames/frame-0001.jpg ... frame-0072.jpg` — scrub frames for canvas
- `scripts/generate-assets.sh` — regenerate legal placeholder media locally

## Run Locally
```bash
cd /root/.openclaw/workspace/repos/galaad-portfolio
npm install
npm run dev
```
Open the local Vite URL (typically `http://localhost:5173`).

## Build
```bash
npm run build
```
Production output is generated in `dist/`.

## Deploy
This is a static site and can be deployed on Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.

### Generic flow
1. `npm install`
2. `npm run build`
3. Deploy the `dist/` directory

### Example (Netlify CLI)
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Example (Vercel CLI)
```bash
npm run build
npx vercel --prod
```

## Re-generate Placeholder Video + Frames (Optional)
```bash
npm run generate:video
```
This overwrites:
- `public/assets/video/galaad-placeholder.mp4`
- `public/assets/frames/frame-*.jpg`

## Asset Provenance (Legal)
All bundled media assets are generated locally from ffmpeg’s built-in test source (`testsrc2`) plus text overlays.
No copyrighted third-party footage is included in this prototype repository.
