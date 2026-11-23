import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'heart';
  opacity: number;
}

const COLORS = ['#fb7185', '#f43f5e', '#f472b6', '#fbcfe8', '#fcd34d', '#c084fc', '#6ee7b7'];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const spawnBurst = (count: number, originY: number) => {
      const shapes: Particle['shape'][] = ['rect', 'circle', 'heart'];
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
        const speed = 5 + Math.random() * 11;
        particles.push({
          x: width * (0.2 + Math.random() * 0.6),
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 6 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.16,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          opacity: 1,
        });
      }
    };

    spawnBurst(80, height * 0.65);
    const secondBurstTimer = window.setTimeout(() => spawnBurst(45, height * 0.5), 420);

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      const s = size * 0.55;
      c.beginPath();
      c.moveTo(0, s * 0.3);
      c.bezierCurveTo(-s, -s * 0.4, -s * 1.4, s * 0.7, 0, s * 1.4);
      c.bezierCurveTo(s * 1.4, s * 0.7, s, -s * 0.4, 0, s * 0.3);
      c.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24; // gravity
        p.vx *= 0.992; // air drag
        p.rotation += p.vRot;

        if (p.y > height * 0.82) {
          p.opacity -= 0.025;
        }

        if (p.opacity <= 0 || p.y > height + 40) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawHeart(ctx, p.size);
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        animationId = window.requestAnimationFrame(tick);
      }
    };

    animationId = window.requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(secondBurstTimer);
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="confetti-canvas"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
};
