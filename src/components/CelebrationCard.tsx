import React from 'react';
import { RotateCcw } from 'lucide-react';
import { QuizConfig, buildWhatsAppUrl, formatAnniversaryDate, getCelebrationDisplayName } from '../utils/quizLogic';

interface CelebrationCardProps {
  config: QuizConfig;
  onReplay: () => void;
}

export const CelebrationCard: React.FC<CelebrationCardProps> = ({ config, onReplay }) => {
  const displayName = getCelebrationDisplayName(config.namaPenerima);
  const anniversaryDate = formatAnniversaryDate();
  const whatsappUrl = buildWhatsAppUrl(config);

  return (
    <section
      aria-label="Perayaan Resmi Jadian"
      className="kawaii-card relative z-10 w-full max-w-md sm:max-w-lg rounded-[2.2rem] p-7 sm:p-9 text-center animate-fade-in"
    >
      {/* Status text */}
      <p className="font-cute text-xs sm:text-sm font-semibold tracking-wide text-emerald-700 mb-4">
        🎉 Yay! Resmi Jadian!
      </p>

      {/* Ikon Perayaan */}
      <div className="mx-auto w-24 h-24 rounded-full bg-pink-100 border-4 border-pink-200 flex items-center justify-center mb-5 relative">
        <span className="text-5xl animate-heartbeat" role="img" aria-label="Senang sekali">
          🥰
        </span>
        <span className="absolute -top-2 -right-2 text-2xl" aria-hidden="true">
          💖
        </span>
        <span className="absolute -bottom-1 -left-2 text-2xl" aria-hidden="true">
          🌸
        </span>
      </div>

      {/* Judul Perayaan */}
      <h1 className="font-cute text-3xl sm:text-4xl font-bold text-rose-600 mb-3 text-balance">
        Yeay! Resmi nih ya? 🥰❤️
      </h1>

      {/* Pesan Penutup Manis */}
      <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed mb-6">
        Makasih udah jawab jujur dari awal sampai akhir,{' '}
        <span className="font-bold text-rose-600">{displayName}</span>! Mulai hari ini nggak ada
        lagi kata &ldquo;cuma temen&rdquo;. Mari kita bikin banyak cerita lucu &amp; seru
        bareng-bareng! 🍓✨
      </p>

      {/* Kotak Tanggal Jadian Otomatis */}
      <div className="bg-pink-50/90 rounded-2xl p-4 mb-6 border-2 border-pink-200">
        <p className="font-cute text-xs text-rose-500 tracking-wide font-semibold mb-1">
          Hari Jadi Kita 🗓️
        </p>
        <p className="text-sm sm:text-base font-bold text-slate-800">{anniversaryDate}</p>
      </div>

      {/* Tombol Kirim Balasan ke WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-cute w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base btn-kawaii-whatsapp flex items-center justify-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
        </svg>
        <span className="whitespace-nowrap">Kabarin Aku di WhatsApp 💌</span>
      </a>

      <button
        type="button"
        onClick={onReplay}
        className="mt-4 inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold text-rose-500 hover:text-rose-700 rounded-full hover:bg-pink-50 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Ulangi Kuis</span>
      </button>
    </section>
  );
};
