import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AudioToggleButton } from './components/AudioToggleButton';
import { CelebrationCard } from './components/CelebrationCard';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { FloatingStickers } from './components/FloatingStickers';
import { HeartParticles } from './components/HeartParticles';
import { LofiAudioEngine } from './utils/lofiAudio';
import {
  DEFAULT_CONFIG,
  computeSafeDodgePosition,
  createSteps,
  getDodgeButtonText,
  parseConfigFromSearch,
} from './utils/quizLogic';

export default function App() {
  const initialState = useMemo(() => {
    if (typeof window === 'undefined') {
      return parseConfigFromSearch('');
    }
    return parseConfigFromSearch(window.location.search);
  }, []);

  const config = DEFAULT_CONFIG;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialState.initialStep);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [dodgePos, setDodgePos] = useState<{ x: number; y: number } | null>(null);
  const [celebrated, setCelebrated] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  const audioEngineRef = useRef<LofiAudioEngine | null>(null);

  useEffect(() => {
    const engine = new LofiAudioEngine();
    audioEngineRef.current = engine;
    return () => {
      engine.dispose();
      audioEngineRef.current = null;
    };
  }, []);

  const handleToggleAudio = async () => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    if (isAudioPlaying) {
      engine.stop();
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      await engine.start();
    }
  };

  const steps = useMemo(() => createSteps(config.namaPenerima), [config.namaPenerima]);
  const currentStep = steps[currentStepIndex];

  const handleStart = () => {
    setCurrentStepIndex(1);
    setSelectedOptionIndex(null);
  };

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setDodgeCount(0);
      setDodgePos(null);
    }
  };

  const handleDodge = () => {
    const arenaEl = arenaRef.current;
    const btnEl = noBtnRef.current;

    const areaWidth = arenaEl?.clientWidth ?? 320;
    const areaHeight = arenaEl?.clientHeight ?? 144;
    const buttonWidth = btnEl?.offsetWidth ?? 130;
    const buttonHeight = btnEl?.offsetHeight ?? 46;

    const currentX = dodgePos?.x ?? Math.max(8, (areaWidth - buttonWidth) / 2);
    const currentY = dodgePos?.y ?? 12;

    const nextPos = computeSafeDodgePosition({
      areaWidth,
      areaHeight,
      buttonWidth,
      buttonHeight,
      currentX,
      currentY,
    });

    setDodgePos(nextPos);
    setDodgeCount((prev) => prev + 1);
  };

  const handleAccept = () => {
    setCelebrated(true);
  };

  const handleReplay = () => {
    setCelebrated(false);
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setDodgeCount(0);
    setDodgePos(null);
  };

  const selectedReply =
    currentStep.type === 'choice' &&
    selectedOptionIndex !== null &&
    currentStep.options?.[selectedOptionIndex]
      ? currentStep.options[selectedOptionIndex].reply
      : null;

  const yesScale = Math.min(1 + dodgeCount * 0.03, 1.15);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative"
      data-state={celebrated ? 'celebration' : currentStep.type}
    >
      <ConfettiCanvas active={celebrated} />
      <HeartParticles />
      <FloatingStickers />
      <AudioToggleButton isPlaying={isAudioPlaying} onToggle={handleToggleAudio} />

      {celebrated ? (
        <CelebrationCard config={config} onReplay={handleReplay} />
      ) : (
        <main
          aria-label="Kuis Rahasia"
          className="kawaii-card relative z-10 w-full max-w-md sm:max-w-lg rounded-[2.2rem] p-6 sm:p-8 text-center transition-all duration-300"
        >
          {/* Progress Bar & Indikator Tahapan */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold mb-2.5">
              <span className="font-cute text-rose-600 truncate">{currentStep.badge}</span>
              <span className="font-cute text-purple-600 shrink-0 tabular-nums">
                {currentStep.counter}
              </span>
            </div>
            <div
              className="w-full h-3 bg-pink-100 rounded-full p-0.5 border border-pink-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={currentStep.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progres kuis"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentStep.progress}%` }}
              />
            </div>
          </div>

          {/* Konten Dinamis per Tahap */}
          <div key={currentStep.id} className="animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-pink-100/90 border-4 border-pink-200 flex items-center justify-center mb-5 shadow-inner">
              <span className="text-4xl" role="img" aria-hidden="true">
                {currentStep.emoji}
              </span>
            </div>

            <h1 className="font-cute text-2xl sm:text-3xl font-bold text-rose-600 mb-2.5 leading-snug text-balance">
              {currentStep.title}
            </h1>

            <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed mb-6">
              {currentStep.subtitle}
            </p>

            {currentStep.type === 'intro' && (
              <button
                type="button"
                onClick={handleStart}
                className="font-cute w-full min-h-[48px] py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base btn-kawaii-pink cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                {currentStep.buttonText}
              </button>
            )}

            {currentStep.type === 'choice' && currentStep.options && (
              <div className="space-y-3">
                {currentStep.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const hasAnswered = selectedOptionIndex !== null;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      disabled={hasAnswered}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full min-h-[48px] py-3.5 px-5 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                        isSelected
                          ? 'bg-pink-100 border-rose-400 text-rose-700 shadow-[0_4px_0px_#fb7185]'
                          : hasAnswered
                            ? 'bg-white/60 border-pink-100 text-slate-400 opacity-75'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-400 hover:bg-pink-50/70 btn-kawaii-choice'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {currentStep.type === 'climax' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleAccept}
                  style={{ transform: `scale(${yesScale})` }}
                  className="font-cute w-full min-h-[52px] py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-lg btn-kawaii-pink cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Mau Banget! 💖
                </button>

                {/* Arena khusus tombol kabur agar tidak pernah menutupi tombol utama atau keluar kartu */}
                <div
                  ref={arenaRef}
                  data-testid="dodge-arena"
                  className="relative w-full h-36 rounded-2xl flex items-start justify-center pt-2 overflow-hidden"
                >
                  <button
                    ref={noBtnRef}
                    type="button"
                    onMouseEnter={handleDodge}
                    onClick={handleDodge}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleDodge();
                    }}
                    style={
                      dodgePos
                        ? {
                            position: 'absolute',
                            left: `${dodgePos.x}px`,
                            top: `${dodgePos.y}px`,
                          }
                        : undefined
                    }
                    className="font-cute min-h-[44px] py-2.5 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200 font-semibold text-sm btn-kawaii-no cursor-pointer whitespace-nowrap select-none"
                  >
                    {getDodgeButtonText(dodgeCount, config.teksTombolKabur)}
                  </button>
                </div>

                {dodgeCount >= 2 && (
                  <p className="text-xs font-semibold text-rose-500 animate-fade-in">
                    Tombolnya nggak mau diklik tuh, pencet yang pink aja ya 🤭
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Kotak Respon Manis Sementara */}
          {selectedReply && (
            <div
              role="status"
              aria-live="polite"
              className="mt-5 p-4 sm:p-5 rounded-3xl bg-amber-50/95 border-2 border-amber-200 text-slate-700 text-sm font-semibold animate-fade-in"
            >
              <p className="mb-4 leading-relaxed">{selectedReply}</p>
              <button
                type="button"
                onClick={handleNextStep}
                className="font-cute w-full min-h-[48px] py-3 px-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base btn-kawaii-pink cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Lanjut Pertanyaan Berikutnya 👉
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
