# Galaad Neau — Portfolio Prototype

Modern one-page portfolio prototype with cinematic scroll storytelling (inspired by theycallmegiulio style):
- smooth page scrolling
- long scroll section with **pinned canvas**
- frame-by-frame scrub tied to scroll progress
- overlay milestone copy that updates as the user scrolls

## Stack
- Vite (vanilla JS)
- HTML/CSS/JS
- ffmpeg (for local asset generation)

## Project Structure
- `index.html` — page structure and sections
- `src/styles.css` — visual system, sticky sequence section, responsive layout
- `src/main.js` — frame loading, canvas drawing, scroll progress logic, milestones
- `scripts/generate-assets.sh` — generates legal placeholder video + extracts frames
- `public/assets/video/galaad-placeholder.mp4` — generated source video
- `public/assets/frames/frame-0001.jpg ... frame-0072.jpg` — scrub frames used by canvas

## Asset Provenance (Legal)
All media assets are generated locally using ffmpeg’s built-in test source (`testsrc2`) and text overlays.
- No copyrighted third-party footage is included.
- The generated placeholder video and derived frames are safe to use as prototype assets.

## Run Locally
```bash
cd /root/.openclaw/workspace/repos/galaad-portfolio
npm install
npm run dev
```
Then open the local Vite URL (usually `http://localhost:5173`).

## Build
```bash
npm run build
```
Output is generated in `dist/`.

## Re-generate Video + Frames
If you want to recreate assets:
```bash
npm run generate:video
```
This overwrites:
- `public/assets/video/galaad-placeholder.mp4`
- `public/assets/frames/frame-*.jpg`

## Deploy
Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages):
1. Run `npm run build`
2. Deploy the `dist/` folder

## Notes
This is a prototype intended for direction/style validation. Next iterations can replace generated frames with real showreel footage (properly licensed) while keeping the same scroll-scrub architecture.
