import React from 'react';
import { Music2, VolumeX } from 'lucide-react';
import { TRACK_TITLE } from '../utils/lofiAudio';

interface AudioToggleButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioToggleButton: React.FC<AudioToggleButtonProps> = ({
  isPlaying,
  onToggle,
}) => {
  return (
    <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
      {isPlaying && (
        <span
          aria-live="polite"
          className="hidden sm:inline-block font-cute text-xs font-semibold text-rose-600/85 animate-fade-in whitespace-nowrap select-none"
        >
          ♪ {TRACK_TITLE}
        </span>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPlaying}
        aria-label={
          isPlaying
            ? `Matikan backsound ${TRACK_TITLE}`
            : `Putar backsound ${TRACK_TITLE}`
        }
        title={
          isPlaying
            ? `Sedang diputar: ${TRACK_TITLE} (klik untuk matikan)`
            : `Putar musik rahasia: ${TRACK_TITLE} 🎵`
        }
        data-audio-state={isPlaying ? 'playing' : 'muted'}
        className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
          isPlaying
            ? 'bg-pink-100/95 border-rose-300 text-rose-600 shadow-[0_3px_0px_#f9a8d4] opacity-95 scale-100'
            : 'bg-white/45 hover:bg-white/85 border-pink-200/70 text-rose-400 hover:text-rose-600 opacity-55 hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        {isPlaying ? (
          <span className="relative flex items-center justify-center">
            <Music2 className="w-5 h-5 animate-wiggle" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -top-2 -right-2 text-[10px] leading-none"
            >
              🎵
            </span>
          </span>
        ) : (
          <span className="relative flex items-center justify-center">
            <Music2 className="w-4 h-4 opacity-80" aria-hidden="true" />
            <VolumeX
              className="w-3 h-3 absolute -bottom-1 -right-1.5 text-slate-500 bg-white/90 rounded-full"
              aria-hidden="true"
            />
          </span>
        )}
      </button>
    </div>
  );
};
