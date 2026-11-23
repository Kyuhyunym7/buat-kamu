export interface QuizConfig {
  namaPenerima: string;
  nomorWhatsApp: string;
  pesanWA: string;
  teksTombolKabur: string[];
}

export interface QuizOption {
  label: string;
  reply: string;
}

export interface QuizStep {
  id: string;
  badge: string;
  counter: string;
  progress: number;
  emoji: string;
  title: string;
  subtitle: string;
  type: 'intro' | 'choice' | 'climax';
  buttonText?: string;
  options?: QuizOption[];
}

export const DEFAULT_CONFIG: QuizConfig = {
  namaPenerima: 'Lia',
  nomorWhatsApp: '6285723673077',
  pesanWA: 'Iya aku mau jadi pacar kamu ❤️',
  teksTombolKabur: [
    'Eits nggak kena 😜',
    'Yakin nih? 🥺',
    'Tombolnya rusak 😝',
    'Pencet yang pink aja 💖',
    'Error 404: Penolakan ditolak 🚫',
    'Salah pencet kali? 🤭',
    'Nggak bisa diklik wlee 😛',
    "Udah klik 'Mau Banget' aja 😉",
  ],
};

export function createSteps(namaPenerima: string): QuizStep[] {
  const displayName = namaPenerima.trim() || DEFAULT_CONFIG.namaPenerima;

  return [
    {
      id: 'intro',
      badge: 'Kuis Rahasia ✨',
      counter: 'Intro',
      progress: 15,
      emoji: '💌',
      title: `Hai, ${displayName}! Ada kuis rahasia buat kamu 💌`,
      subtitle:
        'Ada beberapa pertanyaan kecil sebelum aku kasih tahu sesuatu. Jawabnya harus jujur ya!',
      type: 'intro',
      buttonText: 'Mulai Jawab 👉',
    },
    {
      id: 'q1',
      badge: 'Pertanyaan 1 • Cek Mood 🌈',
      counter: '1 / 4',
      progress: 35,
      emoji: '🍓',
      title: 'Pertama, gimana kabar & mood kamu hari ini?',
      subtitle: 'Pilih yang paling menggambarkan perasaan kamu sekarang~',
      type: 'choice',
      options: [
        {
          label: 'Happy & semangat banget! ✨',
          reply:
            'Yeay! Seneng banget dengernya kalau kamu lagi happy hari ini. Semoga senyum terus ya! 🥰',
        },
        {
          label: 'Lumayan capek nih 😮‍💨',
          reply:
            'Puk-puk, semangat ya! Makasih udah bertahan hebat hari ini. Abis ini istirahat yang cukup ya 🤍',
        },
        {
          label: 'Makin happy pas kamu chat 🤭',
          reply:
            'Aduh bisa aja! Kalau gitu aku bakal sering-sering chat kamu biar happy terus ya 😉💖',
        },
      ],
    },
    {
      id: 'q2',
      badge: 'Pertanyaan 2 • Jujur Nih 🤭',
      counter: '2 / 4',
      progress: 60,
      emoji: '🧸',
      title: 'Menurut kamu, aku orangnya gimana?',
      subtitle: 'Awas jangan bohong, aku cuma pengen tahu pendapat kamu aja...',
      type: 'choice',
      options: [
        {
          label: 'Asik & seru diajak ngobrol 😊',
          reply:
            'Wah serius nih? Makasih ya! Aku juga selalu ngerasa nyambung tiap ngobrol sama kamu ✨',
        },
        {
          label: 'Kadang nyebelin tapi ngangenin 😜',
          reply:
            'Haha ketahuan deh! Yang penting ngangeninnya jauh lebih banyak daripada nyebelinnya ya kan? 😉',
        },
        {
          label: 'Baik & perhatian banget 🥰',
          reply:
            'Bisa perhatian gitu soalnya orangnya ya kamu~ Makasih udah ngerasa gitu ya 🌷',
        },
      ],
    },
    {
      id: 'q3',
      badge: 'Pertanyaan 3 • Pemanasan 🌷',
      counter: '3 / 4',
      progress: 82,
      emoji: '☁️',
      title: 'Kalau kita sering ngobrol atau jalan bareng, kamu nyaman nggak?',
      subtitle: 'Jawab pakai hati ya, nggak usah ragu.',
      type: 'choice',
      options: [
        {
          label: 'Nyaman banget! ❤️',
          reply:
            'Jujur, aku lega banget bacanya. Soalnya aku juga ngerasain hal yang persis sama.',
        },
        {
          label: 'Iya, nyaman kok ✨',
          reply:
            'Makasih udah ngerasa nyaman sama aku. Itu udah lebih dari cukup buat bikin aku seneng.',
        },
      ],
    },
    {
      id: 'climax',
      badge: 'Pertanyaan Terakhir 💖',
      counter: '4 / 4',
      progress: 100,
      emoji: '💖',
      title: 'Jadi... kamu mau nggak jadi pacar aku? 🥺❤️',
      subtitle:
        'Aku nyaman banget sama kamu, dan aku nggak mau kita cuma sebatas temen. Tinggal jawaban dari kamu nih~',
      type: 'climax',
    },
  ];
}

export function sanitizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return DEFAULT_CONFIG.nomorWhatsApp;
  }
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

export function parseConfigFromSearch(search: string): {
  config: QuizConfig;
  initialStep: number;
} {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const autostart = params.get('autostart');
  const stepParam = params.get('step');

  let initialStep = 0;
  if (stepParam !== null) {
    const parsedStep = Number.parseInt(stepParam, 10);
    if (Number.isFinite(parsedStep)) {
      initialStep = Math.max(0, Math.min(4, parsedStep));
    }
  } else if (autostart === '1' || autostart === 'true') {
    initialStep = 1;
  }

  return {
    config: DEFAULT_CONFIG,
    initialStep,
  };
}

export function buildWhatsAppUrl(config: QuizConfig): string {
  const phone = sanitizeWhatsAppNumber(config.nomorWhatsApp);
  const message = config.pesanWA.trim() || DEFAULT_CONFIG.pesanWA;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getCelebrationDisplayName(namaPenerima: string): string {
  const trimmed = namaPenerima.trim();
  if (!trimmed || trimmed.toLowerCase() === 'kamu') {
    return 'Sayang';
  }
  return trimmed;
}

export function formatAnniversaryDate(date: Date = new Date()): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDodgeButtonText(dodgeCount: number, texts: string[] = DEFAULT_CONFIG.teksTombolKabur): string {
  if (dodgeCount <= 0 || texts.length === 0) {
    return 'Nggak 🙈';
  }
  return texts[(dodgeCount - 1) % texts.length];
}

export interface DodgeBounds {
  areaWidth: number;
  areaHeight: number;
  buttonWidth: number;
  buttonHeight: number;
  currentX: number;
  currentY: number;
}

export function computeSafeDodgePosition(
  bounds: DodgeBounds,
  randomA: number = Math.random(),
  randomB: number = Math.random()
): { x: number; y: number } {
  const padding = 8;
  const maxX = Math.max(padding, bounds.areaWidth - bounds.buttonWidth - padding);
  const maxY = Math.max(padding, bounds.areaHeight - bounds.buttonHeight - padding);

  let bestX = padding + randomA * Math.max(0, maxX - padding);
  let bestY = padding + randomB * Math.max(0, maxY - padding);

  // If the candidate is too close to the current position and there's room, push to the opposite half
  const dx = bestX - bounds.currentX;
  const dy = bestY - bounds.currentY;
  const dist = Math.hypot(dx, dy);

  if (dist < 56 && maxX > padding + 20) {
    bestX = bounds.currentX > (padding + maxX) / 2 ? padding + randomA * ((maxX - padding) * 0.4) : maxX - randomA * ((maxX - padding) * 0.4);
  }
  if (dist < 40 && maxY > padding + 20) {
    bestY = bounds.currentY > (padding + maxY) / 2 ? padding + randomB * ((maxY - padding) * 0.4) : maxY - randomB * ((maxY - padding) * 0.4);
  }

  return {
    x: Math.round(Math.max(padding, Math.min(maxX, bestX))),
    y: Math.round(Math.max(padding, Math.min(maxY, bestY))),
  };
}
