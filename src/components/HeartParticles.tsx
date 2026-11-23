import React from 'react';

interface HeartParticleConfig {
  left: string;
  size: number;
  duration: string;
  delay: string;
  sway: string;
  opacity: number;
  colorClass: string;
}

const HEART_PARTICLES: HeartParticleConfig[] = [
  { left: '6%', size: 16, duration: '11s', delay: '-2s', sway: '22px', opacity: 0.34, colorClass: 'text-rose-300' },
  { left: '14%', size: 12, duration: '14s', delay: '-7s', sway: '-18px', opacity: 0.28, colorClass: 'text-pink-300' },
  { left: '22%', size: 20, duration: '12.5s', delay: '-4s', sway: '26px', opacity: 0.32, colorClass: 'text-rose-400' },
  { left: '31%', size: 14, duration: '15s', delay: '-10s', sway: '-24px', opacity: 0.26, colorClass: 'text-pink-400' },
  { left: '40%', size: 18, duration: '10.5s', delay: '-1.5s', sway: '16px', opacity: 0.3, colorClass: 'text-rose-300' },
  { left: '49%', size: 12, duration: '13.5s', delay: '-8.5s', sway: '-20px', opacity: 0.25, colorClass: 'text-fuchsia-300' },
  { left: '58%', size: 22, duration: '12s', delay: '-5.5s', sway: '24px', opacity: 0.3, colorClass: 'text-pink-300' },
  { left: '67%', size: 15, duration: '14.5s', delay: '-11s', sway: '-22px', opacity: 0.34, colorClass: 'text-rose-400' },
  { left: '76%', size: 18, duration: '11.5s', delay: '-3s', sway: '20px', opacity: 0.28, colorClass: 'text-pink-400' },
  { left: '84%', size: 13, duration: '13s', delay: '-9s', sway: '-16px', opacity: 0.3, colorClass: 'text-rose-300' },
  { left: '92%', size: 19, duration: '12.5s', delay: '-6s', sway: '-24px', opacity: 0.32, colorClass: 'text-pink-300' },
  { left: '18%', size: 14, duration: '16s', delay: '-13s', sway: '18px', opacity: 0.24, colorClass: 'text-fuchsia-300' },
  { left: '72%', size: 16, duration: '15.5s', delay: '-12s', sway: '20px', opacity: 0.26, colorClass: 'text-rose-300' },
];

export const HeartParticles: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      data-testid="heart-particles"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {HEART_PARTICLES.map((particle, idx) => (
        <span
          key={idx}
          className={`heart-particle ${particle.colorClass}`}
          style={
            {
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              '--heart-sway': particle.sway,
              '--heart-opacity': particle.opacity,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
    </div>
  );
};
