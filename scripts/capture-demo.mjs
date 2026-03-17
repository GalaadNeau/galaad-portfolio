import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'docs', 'media');
const frameDir = path.join(root, '.tmp-demo-frames');
const outVideo = path.join(outDir, 'portfolio-v2-demo.webm');
const fps = 24;
const durationSec = 12;
const totalFrames = fps * durationSec;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureServer(url, tries = 40) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(250);
  }
  throw new Error(`Server not ready at ${url}`);
}

async function run() {
  await fs.mkdir(outDir, { recursive: true });
  await fs.rm(frameDir, { recursive: true, force: true });
  await fs.mkdir(frameDir, { recursive: true });

  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
    cwd: root,
    stdio: 'ignore'
  });

  try {
    await ensureServer('http://127.0.0.1:4173');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await sleep(500);

    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

    for (let i = 0; i < totalFrames; i += 1) {
      const t = i / (totalFrames - 1);
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, t * 1.15));
      const scrollY = Math.min(maxScroll, eased * maxScroll);
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await sleep(1000 / fps);
      const framePath = path.join(frameDir, `frame-${String(i).padStart(4, '0')}.png`);
      await page.screenshot({ path: framePath });
    }

    await browser.close();

    await new Promise((resolve, reject) => {
      const ff = spawn(
        'ffmpeg',
        [
          '-y',
          '-framerate',
          String(fps),
          '-i',
          path.join(frameDir, 'frame-%04d.png'),
          '-c:v',
          'libvpx-vp9',
          '-b:v',
          '2M',
          '-pix_fmt',
          'yuv420p',
          outVideo
        ],
        { stdio: 'inherit' }
      );
      ff.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
    });

    await fs.rm(frameDir, { recursive: true, force: true });
    console.log(`Demo video created: ${outVideo}`);
  } finally {
    preview.kill('SIGTERM');
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
