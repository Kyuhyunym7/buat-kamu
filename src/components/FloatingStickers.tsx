import React from 'react';

const RISING_STICKERS = [
  { emoji: '💖', left: '10%', duration: '12s', delay: '0s', size: 'text-2xl' },
  { emoji: '🌸', left: '28%', duration: '14s', delay: '3s', size: 'text-xl' },
  { emoji: '✨', left: '54%', duration: '11s', delay: '1.5s', size: 'text-xl' },
  { emoji: '💌', left: '74%', duration: '13s', delay: '4s', size: 'text-2xl' },
  { emoji: '🦋', left: '89%', duration: '12.5s', delay: '2s', size: 'text-2xl' },
];

export const FloatingStickers: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {/* Dekorasi Stiker Lucu di Sudut Layar */}
      <div className="fixed top-6 left-6 sm:top-10 sm:left-12 text-4xl sm:text-5xl opacity-80 animate-float">☁️</div>
      <div className="fixed top-20 right-6 sm:top-20 sm:right-14 text-3xl sm:text-4xl opacity-80 animate-wiggle">✨</div>
      <div className="fixed bottom-6 left-6 sm:bottom-10 sm:left-12 text-3xl sm:text-4xl opacity-80 animate-wiggle">🍓</div>
      <div className="fixed bottom-8 right-6 sm:bottom-10 sm:right-12 text-4xl sm:text-5xl opacity-80 animate-float">🧸</div>

      {/* Stiker Melayang Lembut */}
      {RISING_STICKERS.map((sticker, idx) => (
        <span
          key={idx}
          className={`bg-sticker opacity-0 ${sticker.size}`}
          style={{
            left: sticker.left,
            animationDuration: sticker.duration,
            animationDelay: sticker.delay,
          }}
        >
          {sticker.emoji}
        </span>
      ))}
    </div>
  );
};
