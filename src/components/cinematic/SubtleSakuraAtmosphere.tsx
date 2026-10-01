import React, { useEffect, useRef } from 'react';
import { BOTANICAL_ASSETS } from '../../assets/images';

interface SparsePetal {
  x: number;
  y: number;
  size: number;
  angle: number;
  angularVelocity: number;
  vx: number;
  vy: number;
  flipAngle: number;
  flipSpeed: number;
  opacity: number;
}

export const SubtleSakuraAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Load authentic photographic petal sprite
    const petalImg = new Image();
    petalImg.src = BOTANICAL_ASSETS.petalsMacro;
    let isPetalLoaded = false;
    petalImg.onload = () => {
      isPetalLoaded = true;
    };

    // Extreme restraint: Only 3 to 4 tiny, sparse petals across the entire large viewport
    const PETAL_COUNT = 3;
    const petals: SparsePetal[] = [];

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 11 + Math.random() * 5, // Small, non-distracting size
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.004,
        vx: 0.15 + Math.random() * 0.12, // Extremely gentle drift
        vy: 0.22 + Math.random() * 0.15,
        flipAngle: Math.random() * Math.PI,
        flipSpeed: 0.007 + Math.random() * 0.005,
        opacity: 0.45 + Math.random() * 0.2, // Subtle, soft opacity
      });
    }

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.flipAngle += p.flipSpeed;
        p.angle += p.angularVelocity;

        const sway = Math.sin(time + p.flipAngle) * 0.3;
        p.x += p.vx + sway;
        p.y += p.vy;

        // Loop smoothly when out of view
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * (width * 0.8);
        }
        if (p.x > width + 20) {
          p.x = -20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.flipAngle), 1);
        ctx.globalAlpha = p.opacity;

        if (isPetalLoaded) {
          const half = p.size / 2;
          ctx.drawImage(petalImg, -half, -half, p.size, p.size);
        } else {
          ctx.fillStyle = 'rgba(247, 218, 226, 0.7)';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
      {/* 
        Clean luxury background:
        - Warm ivory and soft cream
        - Lots of calm whitespace
        - Zero giant branch photos or distracting imagery behind text
      */}

      {/* Tiny decorative corner floral accent (small, 48px, tucked away in the upper left corner) */}
      <div className="absolute top-4 left-4 w-12 h-12 opacity-35 transition-opacity hover:opacity-50">
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full text-[#c83a4b]">
          {/* Subtle 5-petal floral emblem */}
          <circle cx="24" cy="24" r="3" fill="#b48728" opacity="0.8" />
          <path
            d="M 24 21 C 24 14 20 12 24 9 C 28 12 24 14 24 21 Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M 27 24 C 34 24 36 20 39 24 C 36 28 34 24 27 24 Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M 24 27 C 24 34 28 36 24 39 C 20 36 24 34 24 27 Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M 21 24 C 14 24 12 28 9 24 C 12 20 14 24 21 24 Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M 22 22 C 16 16 14 18 13 13 C 18 14 16 16 22 22 Z"
            fill="currentColor"
            opacity="0.25"
          />
        </svg>
      </div>

      {/* Sparse falling petals canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
