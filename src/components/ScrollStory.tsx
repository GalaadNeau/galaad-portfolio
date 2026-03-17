import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

type Milestone = {
  at: number;
  title: string;
  text: string;
  tone: string;
};

const FRAME_COUNT = 72;
const framePath = (index: number) => `/assets/frames/frame-${String(index).padStart(4, '0')}.jpg`;

const milestones: Milestone[] = [
  {
    at: 0,
    title: 'Act I — Vision',
    text: 'Distill ambition into a clear product narrative and visual north star.',
    tone: '#cba8ff'
  },
  {
    at: 0.28,
    title: 'Act II — Direction',
    text: 'Shape layout rhythm, typography scale, and emotional pacing across screens.',
    tone: '#86b7ff'
  },
  {
    at: 0.58,
    title: 'Act III — Precision',
    text: 'Engineer fluid interactions and high-performance rendering for real devices.',
    tone: '#7adbc7'
  },
  {
    at: 0.82,
    title: 'Act IV — Momentum',
    text: 'Launch, measure, and iterate into a compounding digital advantage.',
    tone: '#ffc18f'
  }
];

function ScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const progressTargetRef = useRef(0);
  const progressCurrentRef = useRef(0);
  const frameRef = useRef(1);

  const [activeMilestone, setActiveMilestone] = useState(milestones[0]);

  const milestoneIndex = useMemo(
    () => milestones.findIndex((milestone) => milestone.title === activeMilestone.title),
    [activeMilestone]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = (frameIndex: number) => {
      const image = imagesRef.current[frameIndex - 1];
      if (!image || !image.complete || image.naturalWidth === 0) return;

      frameRef.current = frameIndex;

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const imageAspect = image.width / image.height;
      const canvasAspect = width / height;
      const drawWidth = imageAspect > canvasAspect ? height * imageAspect : width;
      const drawHeight = imageAspect > canvasAspect ? height : width / imageAspect;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      ctx.drawImage(image, x, y, drawWidth, drawHeight);
      ctx.fillStyle = 'rgba(4, 5, 8, 0.32)';
      ctx.fillRect(0, 0, width, height);
    };

    const setMilestoneFromProgress = (progress: number) => {
      let current = milestones[0];
      for (const milestone of milestones) {
        if (progress >= milestone.at) current = milestone;
      }
      setActiveMilestone((previous) => (previous.title === current.title ? previous : current));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(frameRef.current);
    };

    const updateScrollTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      progressTargetRef.current = progress;
    };

    const animate = () => {
      const smoothing = 0.1;
      const target = progressTargetRef.current;
      progressCurrentRef.current += (target - progressCurrentRef.current) * smoothing;

      if (Math.abs(target - progressCurrentRef.current) < 0.0005) progressCurrentRef.current = target;

      const frameIndex = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.round(progressCurrentRef.current * (FRAME_COUNT - 1)) + 1)
      );

      drawFrame(frameIndex);
      setMilestoneFromProgress(progressCurrentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    const preloadFrames = () => {
      imagesRef.current = Array.from({ length: FRAME_COUNT }, (_, idx) => {
        const image = new Image();
        image.src = framePath(idx + 1);
        image.decoding = 'async';
        return image;
      });

      const first = imagesRef.current[0];
      if (first) first.onload = () => drawFrame(1);
    };

    preloadFrames();
    resize();
    updateScrollTarget();
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateScrollTarget, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateScrollTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="story" className="scroll-sequence" ref={sectionRef}>
      <div className="pin-wrap">
        <canvas ref={canvasRef} aria-label="Scroll-animated project sequence" />
        <div className="overlay-copy" style={{ '--accent-tone': activeMilestone.tone } as CSSProperties}>
          <span className="progress-chip">Scene {milestoneIndex + 1}/4</span>
          <h2>{activeMilestone.title}</h2>
          <p>{activeMilestone.text}</p>
          <div className="milestone-rail" aria-hidden>
            {milestones.map((milestone) => (
              <span
                key={milestone.title}
                className={milestone.title === activeMilestone.title ? 'milestone-dot active' : 'milestone-dot'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollStory;
