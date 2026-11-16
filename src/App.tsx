import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Box3D } from './components/Box3D';
import { ThreeBackground3D } from './components/ThreeBackground3D';

interface CertificateData {
  img: string;
  alt: string;
  title: string;
  desc: string;
}

const CERTIFICATES: CertificateData[] = [
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-lxs2tzt2hya8.jpg',
    alt: 'Belajar Dasar HTML dan CSS',
    title: 'Belajar Dasar HTML dan CSS',
    desc: 'Sertifikat kelulusan dari kursus dasar HTML dan CSS.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-kbfgaz2hlr0w.jpg',
    alt: 'Belajar Dasar CSS',
    title: 'Belajar Dasar CSS',
    desc: 'Sertifikat kelulusan dari kursus dasar CSS.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-zdaze9qidls7.jpg',
    alt: 'Belajar JavaScript Dasar',
    title: 'Belajar JavaScript Dasar',
    desc: 'Sertifikat kelulusan dari kursus dasar JavaScript.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-mx68heummdgu.jpg',
    alt: 'Belajar JQuery Dasar',
    title: 'Belajar JQuery Dasar',
    desc: 'Sertifikat kelulusan dari kursus dasar JQuery.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-x2yvifklmgux.jpg',
    alt: 'Belajar Bootstrap Framework',
    title: 'Belajar Bootstrap Framework',
    desc: 'Sertifikat kelulusan dari kursus Bootstrap Framework.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-6rbz8782rm4v.jpg',
    alt: 'Belajar Pengunaan Database MySQL Pada Pemrograman PHP',
    title: 'Belajar Penggunaan Database MySQL pada Pemrograman PHP',
    desc: 'Sertifikat kelulusan dari kursus MySQL dengan PHP.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-iwtzebjp612v.jpg',
    alt: 'Belajar Database MySQL',
    title: 'Belajar Database MySQL',
    desc: 'Sertifikat kelulusan dari kursus dasar MySQL.',
  },
  {
    img: 'https://cdn-media-uploads.flaspayku.biz.id/data.php?view=flaslink-inn2mek6obxh.jpg',
    alt: 'Security Course',
    title: 'Security Course',
    desc: 'Sertifikat kelulusan dari kursus keamanan web.',
  },
];

const PROJECTS = [
  {
    category: 'web',
    icon: 'fas fa-globe',
    title: 'Website Portofolio',
    desc: 'Website portofolio pribadi dengan desain modern, animasi halus, dark mode, dan fitur pencarian cepat.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://septianfr.web.id',
    external: true,
    linkIcon: 'fas fa-external-link-alt',
    linkText: 'Live',
  },
  {
    category: 'web',
    icon: 'fas fa-shopping-cart',
    title: 'SFR Digital - PPOB',
    desc: 'Platform penjualan pulsa, paket data, token listrik, dan pembayaran tagihan digital berbasis web.',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    link: '#contact',
    external: false,
    linkIcon: 'fas fa-info-circle',
    linkText: 'Detail',
  },
  {
    category: 'app',
    icon: 'fas fa-robot',
    title: 'Bot Telegram Otomatisasi',
    desc: 'Bot Telegram untuk otomatisasi transaksi dan notifikasi. Dibangun dengan API Telegram dan PHP.',
    tags: ['PHP', 'API', 'Telegram'],
    link: 'https://t.me/septianofc',
    external: true,
    linkIcon: 'fab fa-telegram',
    linkText: 'Coba',
  },
  {
    category: 'design',
    icon: 'fas fa-palette',
    title: 'Desain Logo & Branding',
    desc: 'Pembuatan logo dan identitas visual untuk brand SFR Digital dan beberapa proyek pribadi.',
    tags: ['Desain Grafis', 'Branding'],
    link: '#contact',
    external: false,
    linkIcon: 'fas fa-eye',
    linkText: 'Lihat',
  },
  {
    category: 'app',
    icon: 'fas fa-brain',
    title: 'Eksperimen AI',
    desc: 'Eksperimen penggunaan AI untuk membantu proses kreatif, pembuatan prototipe, dan otomatisasi.',
    tags: ['AI', 'Otomatisasi'],
    link: '#contact',
    external: false,
    linkIcon: 'fas fa-flask',
    linkText: 'Eksperimen',
  },
  {
    category: 'web',
    icon: 'fas fa-gamepad',
    title: 'Top Up Game System',
    desc: 'Sistem top up game otomatis dengan integrasi API pembayaran dan pengiriman item instan.',
    tags: ['PHP', 'API', 'Payment'],
    link: '#contact',
    external: false,
    linkIcon: 'fas fa-info-circle',
    linkText: 'Detail',
  },
];

const SKILLS = [
  {
    icon: 'fab fa-html5',
    title: 'HTML',
    desc: 'Membangun struktur website yang semantik dan aksesibel.',
  },
  {
    icon: 'fab fa-css3-alt',
    title: 'CSS',
    desc: 'Mendesain tampilan website yang menarik dan responsif.',
  },
  {
    icon: 'fab fa-js',
    title: 'JavaScript',
    desc: 'Menambahkan interaktivitas dan fungsionalitas pada website.',
  },
  {
    icon: 'fab fa-php',
    title: 'PHP',
    desc: 'Membangun aplikasi web dinamis dengan backend yang kuat.',
  },
  {
    icon: 'fas fa-database',
    title: 'MySQL',
    desc: 'Mengelola dan merancang database untuk aplikasi web.',
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Aplikasi',
    desc: 'Mengembangkan aplikasi untuk kebutuhan pengguna.',
  },
];

const EXPERIENCES = [
  {
    date: '2024 - Sekarang',
    title: 'Founder & Developer SFR Digital',
    role: 'Web Development & Digital Business',
    desc: 'Membangun dan mengelola platform digital SFR Digital yang melayani penjualan pulsa, paket data, token listrik, dan pembayaran tagihan secara online.',
  },
  {
    date: '2023 - 2024',
    title: 'Freelance Web Developer',
    role: 'Project-based',
    desc: 'Mengerjakan berbagai proyek website untuk teman, komunitas, dan UMKM lokal.',
  },
  {
    date: '2022 - 2023',
    title: 'Mulai Belajar Pemrograman Web',
    role: 'Self-taught & Online Courses',
    desc: 'Memulai perjalanan belajar coding dari HTML & CSS dasar, kemudian JavaScript, PHP, dan MySQL.',
  },
  {
    date: '2021 - 2022',
    title: 'First Line of Code',
    role: 'Kelas 9 SMP',
    desc: 'Menulis baris kode pertama dan menemukan passion di dunia pemrograman.',
  },
];

const SERVICES = [
  {
    icon: 'fas fa-code',
    title: 'Web Development',
    desc: 'Pembuatan website profesional, landing page, company profile, dan sistem berbasis web.',
    tags: ['HTML', 'CSS', 'PHP', 'MySQL'],
  },
  {
    icon: 'fas fa-paint-brush',
    title: 'Desain UI/UX',
    desc: 'Perancangan antarmuka dan pengalaman pengguna yang modern, intuitif, dan responsif.',
    tags: ['UI Design', 'UX Research', 'Prototyping'],
  },
  {
    icon: 'fas fa-robot',
    title: 'Bot & Automation',
    desc: 'Pengembangan bot Telegram, WhatsApp, dan sistem otomatisasi untuk kebutuhan bisnis.',
    tags: ['Telegram Bot', 'API', 'Automation'],
  },
  {
    icon: 'fas fa-store',
    title: 'Digital Business',
    desc: 'Konsultasi dan pembuatan sistem penjualan digital seperti PPOB, top up game, dan payment gateway.',
    tags: ['PPOB', 'Top Up', 'Payment'],
  },
];

const NOW_ITEMS = [
  {
    icon: 'fas fa-laptop-code',
    title: 'Membangun SFR Digital',
    desc: 'Mengembangkan platform PPOB dan layanan digital SFR Digital dengan fitur-fitur baru yang lebih lengkap.',
    tagType: 'building',
    tagIcon: 'fas fa-hammer',
    tagText: 'Building',
  },
  {
    icon: 'fas fa-book-open',
    title: 'Belajar Laravel & React',
    desc: 'Mendalami framework Laravel untuk backend dan React.js untuk frontend.',
    tagType: 'learning',
    tagIcon: 'fas fa-graduation-cap',
    tagText: 'Learning',
  },
  {
    icon: 'fas fa-palette',
    title: 'Eksplorasi Desain UI/UX',
    desc: 'Mengeksplorasi tren desain terbaru dan belajar tools seperti Figma.',
    tagType: 'learning',
    tagIcon: 'fas fa-graduation-cap',
    tagText: 'Learning',
  },
  {
    icon: 'fas fa-circle',
    title: 'Status Ketersediaan',
    desc: 'Terbuka untuk proyek freelance, kolaborasi, dan diskusi seputar pengembangan web.',
    tagType: 'online',
    tagIcon: '',
    tagText: 'Online',
  },
];

const TESTIMONIALS = [
  {
    initial: 'A',
    name: 'Andi',
    role: 'Pemilik UMKM',
    quote:
      'Terima kasih Septian sudah membantu membuat website untuk usaha saya. Hasilnya rapi, cepat, dan sesuai dengan yang saya minta. Recommended!',
  },
  {
    initial: 'R',
    name: 'Rizky',
    role: 'Admin Komunitas',
    quote:
      'Bot Telegram yang dibuat sangat membantu otomatisasi transaksi di komunitas kami. Respon cepat dan hasilnya memuaskan.',
  },
  {
    initial: 'D',
    name: 'Dewi',
    role: 'Guru TIK',
    quote:
      'Septian adalah developer muda yang berbakat. Meskipun masih pelajar, kemampuannya dalam membuat website sudah di atas rata-rata.',
  },
];

const CHANGELOGS = [
  {
    day: '19',
    month: 'Okt',
    title: 'Pembaruan Besar Website',
    badge: 'NEW',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    desc: 'Menambahkan fitur Dark Mode, Command Palette (Ctrl+K), halaman Now, Changelog, Testimoni, Services, Timeline Pengalaman, dan banyak fitur baru lainnya.',
  },
  {
    day: '15',
    month: 'Jan',
    title: 'Penambahan Section Proyek',
    badge: 'UPDATE',
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    desc: 'Menambahkan galeri proyek dengan filter kategori dan deskripsi detail untuk setiap proyek.',
  },
  {
    day: '10',
    month: 'Sept',
    title: 'Perbaikan Tampilan Mobile',
    badge: 'FIX',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    desc: 'Memperbaiki tampilan navigasi di perangkat mobile, memastikan semua menu dapat diakses dengan baik.',
  },
  {
    day: '06',
    month: 'Juni',
    title: 'Peluncuran Website',
    badge: 'NEW',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    desc: 'Website portofolio septianfr.web.id resmi diluncurkan dengan halaman Home, About, Skills, Certificates, dan Contact.',
  },
];

const STATS = [
  { target: 8, label: 'Sertifikat Diperoleh' },
  { target: 6, label: 'Proyek Selesai' },
  { target: 3, label: 'Tahun Belajar Coding' },
  { target: 10, label: 'Teknologi Dikuasai' },
];

const NAV_ITEMS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'Tentang Saya' },
  { href: '#skills', label: 'Keahlian' },
  { href: '#projects', label: 'Proyek' },
  { href: '#experience', label: 'Pengalaman' },
  { href: '#certificates', label: 'Sertifikat' },
  { href: '#services', label: 'Layanan' },
  { href: '#now', label: 'Now' },
  { href: '#changelog', label: 'Changelog' },
  { href: '#contact', label: 'Kontak' },
];

function getInitialDarkMode(): boolean {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch {
    // ignore
  }
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(getInitialDarkMode);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingHidden, setLoadingHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Project filter
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Certificate 3D carousel & modal
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalCertIndex, setModalCertIndex] = useState<number | null>(null);
  const [sliderHovered, setSliderHovered] = useState(false);

  // Stats animation
  const [statValues, setStatValues] = useState<number[]>([8, 6, 3, 10]);
  const statsSectionRef = useRef<HTMLElement | null>(null);
  const statsAnimatedRef = useRef(false);

  // QR Code
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrNotice, setQrNotice] = useState<string | null>(null);

  // Contact form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sync dark mode class on <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  // Loading progress simulation matching original loading screen
  useEffect(() => {
    let p = 0;
    const timer = window.setInterval(() => {
      p += 18 + Math.random() * 18;
      if (p >= 100) {
        p = 100;
        setLoadingProgress(100);
        window.clearInterval(timer);
        window.setTimeout(() => setLoadingHidden(true), 450);
      } else {
        setLoadingProgress(Math.round(p));
      }
    }, 110);
    return () => window.clearInterval(timer);
  }, []);

  // Scroll tracking (header, reading progress, back-to-top)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setShowBackToTop(y > 300);
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollPercent(docHeight > 0 ? (y / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Achievement counter animation when scrolled into view
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimatedRef.current) {
          statsAnimatedRef.current = true;
          const start = performance.now();
          const duration = 1200;
          const tick = (now: number) => {
            const prog = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            setStatValues(STATS.map((s) => Math.floor(s.target * eased)));
            if (prog < 1) requestAnimationFrame(tick);
            else setStatValues(STATS.map((s) => s.target));
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-rotate certificates carousel
  useEffect(() => {
    if (sliderHovered || modalCertIndex !== null) return;
    const id = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CERTIFICATES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [sliderHovered, modalCertIndex]);

  // Escape closes certificate modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalCertIndex !== null) {
        setModalCertIndex(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalCertIndex]);

  // Generate real QR Code onto canvas
  useEffect(() => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, 'https://septianfr.web.id/', {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    }).catch(() => {
      // ignore
    });
  }, []);

  const handleDownloadQR = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'septianfr-qrcode.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setQrNotice('QR Code diunduh sebagai septianfr-qrcode.png');
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        setQrNotice(null);
      }, 3500);
    }, 'image/png');
  };

  const handleCopyLink = async () => {
    const url = 'https://septianfr.web.id/';
    try {
      await navigator.clipboard.writeText(url);
      setQrNotice('Link disalin: ' + url);
    } catch {
      setQrNotice('Salin alamat ini: ' + url);
    }
    window.setTimeout(() => setQrNotice(null), 3000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contactName.trim() ||
      !contactEmail.trim() ||
      !contactSubject.trim() ||
      !contactMessage.trim()
    ) {
      setContactFeedback({
        type: 'error',
        text: 'Semua field wajib diisi.',
      });
      return;
    }
    setContactSubmitting(true);
    setContactFeedback(null);
    try {
      const res = await fetch('send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          name: contactName.trim(),
          email: contactEmail.trim(),
          subject: contactSubject.trim(),
          message: contactMessage.trim(),
        }).toString(),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.status === 'success') {
          setContactFeedback({
            type: 'success',
            text: data.message || 'Pesan berhasil dikirim!',
          });
          setContactName('');
          setContactEmail('');
          setContactSubject('');
          setContactMessage('');
          setContactSubmitting(false);
          return;
        }
      }
      throw new Error('Static fallback');
    } catch {
      setContactFeedback({
        type: 'success',
        text: 'Pesan Anda siap dikirim! Anda juga dapat menghubungi langsung via WhatsApp atau Telegram.',
      });
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } finally {
      setContactSubmitting(false);
    }
  };

  const now = new Date();
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const nowDateText = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const filteredProjects =
    projectFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === projectFilter);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e293b] dark:text-[#e2e8f0] transition-colors duration-300">
      {/* Real Three.js 3D WebGL Background Across Entire Page */}
      <ThreeBackground3D isDark={isDark} />

      {/* 3D Reading Progress Bar */}
      <div
        id="readingProgress"
        style={{ width: `${scrollPercent}%` }}
        className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-[#42a5f5] to-[#1e88e5] z-[1001] shadow-[0_2px_12px_rgba(66,165,245,0.7)] transition-[width] duration-100 ease-linear"
      />

      {/* 3D Loading Screen */}
      {!loadingHidden && (
        <div
          id="loadingScreen"
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] transition-opacity duration-500 ${
            loadingProgress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="mb-7 animate-logo-3d">
            <img
              src="https://septianfr.web.id/logo.png"
              alt="Loading..."
              className="w-24 h-24 rounded-full border-4 border-[#42a5f5] object-cover shadow-[0_12px_30px_rgba(66,165,245,0.45)]"
            />
          </div>
          <div className="w-52 h-2 bg-white/20 rounded-full overflow-hidden mb-4 shadow-inner">
            <div
              className="h-full bg-[#42a5f5] rounded-full transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-white text-base font-medium font-poppins">
            Memuat website...
          </div>
        </div>
      )}

      {/* 3D Extruded Floating Header */}
      <header
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-white/95 dark:bg-[#1e293b]/95 shadow-[0_6px_0_0_rgba(148,163,184,0.22),0_14px_28px_-8px_rgba(15,23,42,0.25)] dark:shadow-[0_6px_0_0_rgba(2,6,23,0.85),0_16px_30px_-8px_rgba(2,6,23,0.75)]'
            : 'py-4 bg-white/90 dark:bg-[#1e293b]/90 shadow-[0_4px_0_0_rgba(148,163,184,0.18),0_10px_20px_-6px_rgba(15,23,42,0.12)]'
        }`}
      >
        <div className="w-[90%] max-w-[1200px] mx-auto px-5">
          <nav className="flex items-center justify-between gap-4">
            {/* 3D Rotating Logo Coin + Extruded Brand */}
            <a href="#home" className="flex items-center gap-3 group scene-3d">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#42a5f5] shadow-[0_5px_0_0_rgba(30,136,229,0.45),0_8px_16px_rgba(66,165,245,0.3)] transition-transform duration-300 group-hover:rotate-y-180 group-hover:scale-105 preserve-3d">
                <img
                  src="https://septianfr.web.id/logo.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-poppins text-2xl font-bold text-[#42a5f5] tracking-tight text-3d">
                septianfr
              </div>
            </a>

            {/* Desktop Nav Links with 3D Z-Lift */}
            <ul className="hidden lg:flex items-center gap-6 list-none scene-3d">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-poppins text-[0.9rem] font-medium text-[#1e293b] dark:text-[#e2e8f0] hover:text-[#42a5f5] dark:hover:text-[#64b5f6] inline-block py-1 transition-transform duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* 3D Dark Mode Toggle & Mobile Hamburger */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                id="darkModeToggle"
                onClick={() => setIsDark((d) => !d)}
                aria-label={isDark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
                title={isDark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
                className="sphere-3d w-11 h-11 rounded-full flex items-center justify-center border-2 border-[#42a5f5] dark:border-[#fbbf24] bg-[#f8fafc] dark:bg-[#334155] text-[#1e293b] dark:text-[#fbbf24] cursor-pointer text-lg shrink-0"
              >
                <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'} />
              </button>

              <button
                type="button"
                className="lg:hidden text-2xl text-[#1e293b] dark:text-[#e2e8f0] hover:text-[#42a5f5] cursor-pointer"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Menu Navigasi"
              >
                <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile 3D Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 mx-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <ul className="grid grid-cols-2 gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-poppins text-sm font-medium text-center hover:bg-[#42a5f5] hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Main Content Layer above 3D WebGL Backdrop */}
      <main className="relative z-10">
        {/* HERO SECTION (FULL 3D) */}
        <section
          id="home"
          className="pt-44 pb-28 text-center relative scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <Box3D
              intensity={7}
              liftZ={14}
              className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 bg-white/85 dark:bg-[#1e293b]/85 border border-slate-200/80 dark:border-slate-700/80"
            >
              <div className="preserve-3d">
                <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold leading-tight mb-5 text-[#1e293b] dark:text-white text-3d layer-z-2">
                  Hai, Saya{' '}
                  <span className="text-[#42a5f5] text-3d-accent inline-block">
                    Septian Fathur Rohman
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-[#64748b] dark:text-[#94a3b8] max-w-2xl mx-auto mb-9 layer-z-1">
                  Seorang Pelajar SMA yang Bersemangat dalam Pemrograman Web dan
                  Teknologi
                </p>
                <div className="flex gap-4 justify-center flex-wrap preserve-3d">
                  <a
                    href="#certificates"
                    className="btn-3d-primary inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white font-poppins font-semibold text-base"
                  >
                    <i className="fas fa-certificate" />
                    <span>Lihat Sertifikat Saya</span>
                  </a>
                  <a
                    href="#contact"
                    className="btn-3d-outline inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border-2 border-[#42a5f5] text-[#42a5f5] dark:text-[#64b5f6] bg-white/80 dark:bg-slate-900/70 hover:bg-[#42a5f5] hover:text-white font-poppins font-semibold text-base"
                  >
                    <i className="fas fa-envelope" />
                    <span>Hubungi Saya</span>
                  </a>
                </div>
              </div>
            </Box3D>
          </div>
        </section>

        {/* ABOUT SECTION (FULL 3D) */}
        <section
          id="about"
          className="py-28 bg-white/45 dark:bg-[#1e293b]/45 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-16 text-3d">
              Tentang Saya
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* 3D Floating Frame for Exact Original Image */}
              <div className="lg:col-span-5">
                <Box3D
                  intensity={14}
                  liftZ={18}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700"
                >
                  <div className="rounded-xl overflow-hidden layer-z-2">
                    <img
                      src="https://septianfr.web.id/logo.png"
                      alt="About Me"
                      className="w-full h-auto block object-cover"
                    />
                  </div>
                </Box3D>
              </div>

              {/* 3D Extruded Bio Card */}
              <div className="lg:col-span-7">
                <Box3D
                  intensity={8}
                  liftZ={12}
                  className="rounded-2xl p-7 sm:p-9 bg-[#f8fafc]/95 dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-poppins text-2xl font-bold text-[#42a5f5] mb-4 layer-z-2">
                    Septian Fathur Rohman
                  </h3>
                  <p className="text-[#1e293b] dark:text-[#cbd5e1] leading-relaxed mb-6 layer-z-1">
                    Saya adalah pelajar SMA yang sangat tertarik dengan dunia
                    pemrograman web. Saya mulai belajar coding sejak kelas 9 SMP
                    dan terus mengembangkan keterampilan saya dalam HTML, CSS,
                    JavaScript, PHP, MySQL dan kode pemrograman lainnya.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 layer-z-1">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-[0_4px_0_rgba(148,163,184,0.2)] dark:shadow-[0_4px_0_rgba(2,6,23,0.7)] text-sm">
                      <i className="fas fa-user text-[#42a5f5] mr-2" />
                      <strong className="text-[#42a5f5]">Usia:</strong> 17 Tahun
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-[0_4px_0_rgba(148,163,184,0.2)] dark:shadow-[0_4px_0_rgba(2,6,23,0.7)] text-sm">
                      <i className="fas fa-birthday-cake text-[#42a5f5] mr-2" />
                      <strong className="text-[#42a5f5]">
                        Tempat/Tanggal Lahir:
                      </strong>{' '}
                      Bandung, 20 September 2009
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-[0_4px_0_rgba(148,163,184,0.2)] dark:shadow-[0_4px_0_rgba(2,6,23,0.7)] text-sm">
                      <i className="fas fa-graduation-cap text-[#42a5f5] mr-2" />
                      <strong className="text-[#42a5f5]">Pendidikan:</strong>{' '}
                      SMA Negeri 1 Losarang
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-[0_4px_0_rgba(148,163,184,0.2)] dark:shadow-[0_4px_0_rgba(2,6,23,0.7)] text-sm">
                      <i className="fas fa-heart text-[#42a5f5] mr-2" />
                      <strong className="text-[#42a5f5]">Minat:</strong>{' '}
                      Pemrograman Web, Desain UI/UX, Teknologi Terbaru
                    </div>
                    <div className="sm:col-span-2 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-[0_4px_0_rgba(148,163,184,0.2)] dark:shadow-[0_4px_0_rgba(2,6,23,0.7)] text-sm">
                      <i className="fas fa-gamepad text-[#42a5f5] mr-2" />
                      <strong className="text-[#42a5f5]">Hobi:</strong> Ngoding,
                      Main Bola, Membuat Hal Baru
                    </div>
                  </div>

                  <p className="italic text-[#64748b] dark:text-[#94a3b8] border-l-4 border-[#42a5f5] pl-4 py-1 mb-6 text-sm layer-z-1">
                    "Saya percaya bahwa dengan teknologi, kita dapat menciptakan
                    solusi inovatif untuk masa depan yang lebih baik."
                  </p>

                  <div className="flex flex-wrap gap-3 layer-z-2">
                    <a
                      href="https://wa.me/628131657036"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="sphere-3d w-11 h-11 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center"
                    >
                      <i className="fab fa-whatsapp text-lg" />
                    </a>
                    <a
                      href="https://t.me/septianofc"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Telegram"
                      className="sphere-3d w-11 h-11 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center"
                    >
                      <i className="fab fa-telegram text-lg" />
                    </a>
                    <a
                      href="https://www.instagram.com/_septianfr?igsh=MTRmMDFkbzN0MnhqcQ=="
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="sphere-3d w-11 h-11 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center"
                    >
                      <i className="fab fa-instagram text-lg" />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61579377972764&mibextid=ZbWKwL"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="sphere-3d w-11 h-11 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center"
                    >
                      <i className="fab fa-facebook text-lg" />
                    </a>
                    <a
                      href="https://github.com/septianofc"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="sphere-3d w-11 h-11 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center"
                    >
                      <i className="fab fa-github text-lg" />
                    </a>
                  </div>
                </Box3D>
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENT / STATISTIK SECTION (FULL 3D) */}
        <section
          id="stats"
          ref={statsSectionRef}
          className="py-20 bg-gradient-to-br from-[#42a5f5]/75 to-[#1e88e5]/80 backdrop-blur-[3px] text-white scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {STATS.map((stat, idx) => (
                <Box3D
                  key={stat.label}
                  intensity={14}
                  liftZ={16}
                  className="stat-3d-cube rounded-2xl p-7 bg-white/15 border border-white/25"
                >
                  <div className="font-poppins text-5xl font-extrabold leading-tight mb-2 text-3d layer-z-3 tabular-nums">
                    {statValues[idx]}
                  </div>
                  <div className="text-sm font-medium opacity-95 layer-z-1">
                    {stat.label}
                  </div>
                </Box3D>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS SECTION (FULL 3D) */}
        <section
          id="skills"
          className="py-28 bg-[#f8fafc]/45 dark:bg-[#0f172a]/50 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-16 text-3d">
              Keahlian Saya
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {SKILLS.map((skill) => (
                <Box3D
                  key={skill.title}
                  intensity={14}
                  liftZ={16}
                  className="rounded-2xl p-8 text-center bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#42a5f5] to-[#1e88e5]" />
                  <div className="text-5xl text-[#42a5f5] mb-5 layer-z-3 inline-block drop-shadow-[0_10px_14px_rgba(66,165,245,0.4)]">
                    <i className={skill.icon} />
                  </div>
                  <h3 className="font-poppins text-xl font-bold mb-3 layer-z-2">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] layer-z-1">
                    {skill.desc}
                  </p>
                </Box3D>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION (FULL 3D) */}
        <section
          id="projects"
          className="py-28 bg-white/45 dark:bg-[#1e293b]/45 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-6 text-3d">
              Proyek Saya
            </h2>
            <p className="text-center text-[#64748b] dark:text-[#94a3b8] max-w-xl mx-auto mb-10">
              Beberapa proyek dan eksperimen digital yang telah saya kerjakan.
            </p>

            {/* 3D Tactile Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'web', label: 'Web Development' },
                { id: 'app', label: 'Aplikasi' },
                { id: 'design', label: 'Desain' },
              ].map((btn) => {
                const active = projectFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setProjectFilter(btn.id)}
                    className={`font-poppins text-sm font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-all ${
                      active
                        ? 'btn-3d-primary bg-[#42a5f5] text-white'
                        : 'btn-3d-outline border-2 border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1e293b] dark:text-slate-200 hover:border-[#42a5f5]'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProjects.map((proj) => (
                <Box3D
                  key={proj.title}
                  intensity={12}
                  liftZ={15}
                  className="rounded-2xl overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-[#42a5f5] to-[#1e88e5] flex items-center justify-center text-white text-5xl shadow-inner">
                    <i className={`${proj.icon} layer-z-3 drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]`} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-poppins text-xl font-bold mb-2 layer-z-2">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed mb-4 layer-z-1">
                        {proj.desc}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4 layer-z-1">
                        {proj.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-[#42a5f5]/15 text-[#42a5f5]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        href={proj.link}
                        target={proj.external ? '_blank' : undefined}
                        rel={proj.external ? 'noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#42a5f5] hover:text-[#1e88e5] layer-z-2"
                      >
                        <i className={proj.linkIcon} />
                        <span>{proj.linkText}</span>
                      </a>
                    </div>
                  </div>
                </Box3D>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION (FULL 3D) */}
        <section
          id="experience"
          className="py-28 bg-[#f8fafc]/45 dark:bg-[#0f172a]/50 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-16 text-3d">
              Pengalaman & Perjalanan
            </h2>

            <div className="max-w-3xl mx-auto relative pl-10 sm:pl-14">
              {/* 3D Extruded Vertical Spine */}
              <div className="absolute left-3.5 sm:left-5 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-[#64b5f6] to-[#1e88e5] shadow-[2px_0_12px_rgba(66,165,245,0.45)]" />

              <div className="space-y-8">
                {EXPERIENCES.map((exp) => (
                  <div key={exp.title} className="relative">
                    {/* 3D Metallic Sphere Dot */}
                    <div className="absolute -left-[33px] sm:-left-[43px] top-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#64b5f6] to-[#1e88e5] border-4 border-[#f8fafc] dark:border-[#0f172a] shadow-[0_4px_12px_rgba(66,165,245,0.6)]" />

                    <Box3D
                      intensity={9}
                      liftZ={12}
                      className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700"
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#42a5f5]/15 text-[#42a5f5] mb-3 layer-z-2">
                        <i className="fas fa-calendar-alt" />
                        <span>{exp.date}</span>
                      </span>
                      <h4 className="font-poppins text-lg font-bold mb-1 layer-z-2">
                        {exp.title}
                      </h4>
                      <div className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8] mb-2 layer-z-1">
                        {exp.role}
                      </div>
                      <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed layer-z-1">
                        {exp.desc}
                      </p>
                    </Box3D>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION (FULL 3D) */}
        <section
          id="services"
          className="py-28 bg-white/45 dark:bg-[#1e293b]/45 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-6 text-3d">
              Layanan Saya
            </h2>
            <p className="text-center text-[#64748b] dark:text-[#94a3b8] max-w-xl mx-auto mb-14">
              Beberapa layanan yang dapat saya bantu untuk kebutuhan digital Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {SERVICES.map((srv) => (
                <Box3D
                  key={srv.title}
                  intensity={13}
                  liftZ={16}
                  className="rounded-2xl p-7 text-center bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-20 h-20 rounded-3xl mx-auto mb-6 bg-gradient-to-br from-[#42a5f5] to-[#1e88e5] text-white flex items-center justify-center text-3xl shadow-[0_10px_0_rgba(21,101,192,0.45),0_18px_28px_rgba(66,165,245,0.4)] layer-z-3">
                    <i className={srv.icon} />
                  </div>
                  <h3 className="font-poppins text-xl font-bold mb-2.5 layer-z-2">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed mb-4 layer-z-1">
                    {srv.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center layer-z-1">
                    {srv.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-[#42a5f5]/10 text-[#42a5f5]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Box3D>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATES SECTION (TRUE 3D COVERFLOW CAROUSEL WITH EXACT IMAGES) */}
        <section
          id="certificates"
          className="py-28 bg-[#f8fafc]/45 dark:bg-[#0f172a]/50 backdrop-blur-[2px] scene-3d overflow-hidden"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-6 text-3d">
              Sertifikat Saya
            </h2>
            <p className="text-center text-[#64748b] dark:text-[#94a3b8] mb-12">
              Berikut adalah sertifikat-sertifikat yang telah saya peroleh selama
              belajar pemrograman:
            </p>

            {/* 3D Perspective Stage */}
            <div
              className="relative h-[320px] sm:h-[420px] w-full max-w-4xl mx-auto scene-3d"
              onMouseEnter={() => setSliderHovered(true)}
              onMouseLeave={() => setSliderHovered(false)}
            >
              {CERTIFICATES.map((cert, index) => {
                let offset = index - currentSlide;
                if (offset > CERTIFICATES.length / 2)
                  offset -= CERTIFICATES.length;
                if (offset < -CERTIFICATES.length / 2)
                  offset += CERTIFICATES.length;

                const absOffset = Math.abs(offset);
                const isVisible = absOffset <= 2;
                const translateX = offset * 52;
                const translateZ = -absOffset * 130 + (offset === 0 ? 35 : 0);
                const rotateY = offset * -26;
                const scale = offset === 0 ? 1 : Math.max(0.68, 1 - absOffset * 0.16);
                const opacity = isVisible ? Math.max(0.35, 1 - absOffset * 0.3) : 0;

                return (
                  <div
                    key={cert.img}
                    onClick={() => {
                      if (offset === 0) setModalCertIndex(index);
                      else setCurrentSlide(index);
                    }}
                    style={{
                      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex: 20 - absOffset,
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                    className="absolute inset-0 m-auto w-[86%] sm:w-[74%] h-full rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-[0_14px_0_0_rgba(148,163,184,0.32),0_28px_55px_-12px_rgba(15,23,42,0.45)] transition-all duration-500 ease-out"
                  >
                    <img
                      src={cert.img}
                      alt={cert.alt}
                      className="w-full h-full object-contain bg-[#f8fafc] dark:bg-[#0f172a]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-5 mt-9">
              <button
                type="button"
                id="prevBtn"
                onClick={() =>
                  setCurrentSlide(
                    (c) => (c - 1 + CERTIFICATES.length) % CERTIFICATES.length
                  )
                }
                aria-label="Sertifikat Sebelumnya"
                className="sphere-3d w-12 h-12 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center cursor-pointer"
              >
                <i className="fas fa-chevron-left" />
              </button>

              <div className="flex gap-2.5">
                {CERTIFICATES.map((cert, idx) => (
                  <button
                    key={cert.img}
                    type="button"
                    aria-label={`Sertifikat ${idx + 1}`}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-3 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'w-8 bg-[#42a5f5] shadow-[0_2px_8px_rgba(66,165,245,0.6)]'
                        : 'w-3 bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                id="nextBtn"
                onClick={() =>
                  setCurrentSlide((c) => (c + 1) % CERTIFICATES.length)
                }
                aria-label="Sertifikat Berikutnya"
                className="sphere-3d w-12 h-12 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center cursor-pointer"
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>

            <div className="flex justify-center mt-10">
              <a
                href="/sertifikat.html"
                target="_blank"
                rel="noreferrer"
                className="btn-3d-outline inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border-2 border-[#42a5f5] text-[#42a5f5] dark:text-[#64b5f6] bg-white/85 dark:bg-slate-900/80 hover:bg-[#42a5f5] hover:text-white font-poppins font-semibold"
              >
                <i className="fas fa-th-large" />
                <span>Lihat Semua Sertifikat</span>
              </a>
            </div>
          </div>
        </section>

        {/* NOW SECTION (FULL 3D) */}
        <section
          id="now"
          className="py-28 bg-white/45 dark:bg-[#1e293b]/45 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-6 text-3d">
              Sedang Saya Kerjakan
            </h2>
            <p className="text-center text-[#64748b] dark:text-[#94a3b8] max-w-xl mx-auto mb-14">
              Fokus dan aktivitas terkini saya per{' '}
              <span id="nowDate">{nowDateText}</span>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {NOW_ITEMS.map((item) => (
                <Box3D
                  key={item.title}
                  intensity={12}
                  liftZ={14}
                  className="rounded-2xl p-7 bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 border-l-4 border-l-[#42a5f5]"
                >
                  <div className="text-4xl text-[#42a5f5] mb-4 layer-z-3">
                    <i className={item.icon} />
                  </div>
                  <h3 className="font-poppins text-lg font-bold mb-2.5 layer-z-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed mb-4 layer-z-1">
                    {item.desc}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold layer-z-2 ${
                      item.tagType === 'building'
                        ? 'bg-amber-500/15 text-amber-500'
                        : item.tagType === 'online'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-sky-500/15 text-[#42a5f5]'
                    }`}
                  >
                    {item.tagType === 'online' ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ) : (
                      <i className={item.tagIcon} />
                    )}
                    <span>{item.tagText}</span>
                  </span>
                </Box3D>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION (FULL 3D) */}
        <section
          id="testimonials"
          className="py-28 bg-[#f8fafc]/45 dark:bg-[#0f172a]/50 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-6 text-3d">
              Testimoni
            </h2>
            <p className="text-center text-[#64748b] dark:text-[#94a3b8] max-w-xl mx-auto mb-14">
              Ulasan dan pengalaman dari orang-orang yang pernah bekerja sama
              dengan saya.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {TESTIMONIALS.map((t) => (
                <Box3D
                  key={t.name}
                  intensity={12}
                  liftZ={14}
                  className="rounded-2xl p-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                >
                  <p className="italic text-sm sm:text-base text-[#1e293b] dark:text-[#cbd5e1] leading-relaxed mb-6 layer-z-1">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3.5 layer-z-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#42a5f5] to-[#1e88e5] text-white font-bold text-lg flex items-center justify-center shadow-[0_4px_0_rgba(21,101,192,0.5)] shrink-0">
                      {t.initial}
                    </div>
                    <div>
                      <strong className="block font-poppins text-sm">
                        {t.name}
                      </strong>
                      <small className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                        {t.role}
                      </small>
                    </div>
                  </div>
                </Box3D>
              ))}
            </div>
          </div>
        </section>

        {/* CHANGELOG SECTION (FULL 3D) */}
        <section
          id="changelog"
          className="py-28 bg-white/45 dark:bg-[#1e293b]/45 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-6 text-3d">
              Changelog
            </h2>
            <p className="text-center text-[#64748b] dark:text-[#94a3b8] max-w-xl mx-auto mb-14">
              Riwayat pembaruan website dan proyek-proyek saya.
            </p>

            <div className="max-w-3xl mx-auto space-y-6">
              {CHANGELOGS.map((cl) => (
                <div key={cl.title} className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#42a5f5] to-[#1e88e5] text-white flex flex-col items-center justify-center font-bold text-sm leading-tight shadow-[0_5px_0_rgba(21,101,192,0.55),0_10px_20px_rgba(66,165,245,0.35)] shrink-0">
                    <span>{cl.day}</span>
                    <small className="text-[10px] font-medium opacity-90">
                      {cl.month}
                    </small>
                  </div>

                  <Box3D
                    intensity={8}
                    liftZ={10}
                    className="flex-1 rounded-2xl p-6 bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700"
                  >
                    <h4 className="font-poppins text-base font-bold mb-2 flex items-center gap-2.5 flex-wrap layer-z-2">
                      <span>{cl.title}</span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${cl.badgeClass}`}
                      >
                        {cl.badge}
                      </span>
                    </h4>
                    <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed layer-z-1">
                      {cl.desc}
                    </p>
                  </Box3D>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QR CODE SECTION (FULL 3D) */}
        <section
          id="qr"
          className="py-20 bg-gradient-to-br from-[#e3f2fd]/55 to-[#f3e5f5]/55 dark:from-[#1e293b]/55 dark:to-[#0f172a]/55 backdrop-blur-[2px] text-center scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5 flex flex-col items-center gap-5">
            <h3 className="font-poppins text-2xl font-bold text-3d">
              Scan untuk Membuka Portofolio
            </h3>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] max-w-md">
              Bagikan halaman ini dengan mudah melalui QR code di bawah ini. QR
              code berisi URL portofolio resmi.
            </p>

            <Box3D
              intensity={16}
              liftZ={20}
              className="w-60 h-60 p-5 rounded-2xl bg-white flex items-center justify-center border border-slate-200"
            >
              <canvas
                ref={qrCanvasRef}
                width={200}
                height={200}
                className="w-[200px] h-[200px] block layer-z-2"
                style={{ imageRendering: 'pixelated' }}
              />
            </Box3D>

            <div className="flex gap-3 flex-wrap justify-center mt-2">
              <button
                type="button"
                id="downloadQRBtn"
                onClick={handleDownloadQR}
                className="btn-3d-primary inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white font-poppins font-semibold text-sm cursor-pointer"
              >
                <i className="fas fa-download" />
                <span>Unduh QR</span>
              </button>
              <button
                type="button"
                id="copyLinkBtn"
                onClick={handleCopyLink}
                className="btn-3d-outline inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#42a5f5] text-[#42a5f5] dark:text-[#64b5f6] bg-white/85 dark:bg-slate-900/80 hover:bg-[#42a5f5] hover:text-white font-poppins font-semibold text-sm cursor-pointer"
              >
                <i className="fas fa-copy" />
                <span>Salin Link</span>
              </button>
            </div>

            {qrNotice && (
              <p className="text-xs font-semibold text-[#1e88e5] dark:text-[#64b5f6]">
                {qrNotice}
              </p>
            )}

            <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
              Atau kunjungi langsung:{' '}
              <strong className="text-[#42a5f5]">septianfr.web.id</strong>
            </p>
          </div>
        </section>

        {/* CONTACT SECTION (FULL 3D) */}
        <section
          id="contact"
          className="py-28 bg-[#f8fafc]/45 dark:bg-[#0f172a]/50 backdrop-blur-[2px] scene-3d"
        >
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <h2 className="section-title-3d text-center font-poppins text-3xl sm:text-4xl font-bold mb-16 text-3d">
              Hubungi Saya
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <Box3D
                  intensity={9}
                  liftZ={12}
                  className="rounded-2xl p-7 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-poppins text-2xl font-bold text-[#42a5f5] mb-3 layer-z-2">
                    Mari Berkolaborasi!
                  </h3>
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-6 layer-z-1">
                    Jika Anda tertarik dengan karya saya atau ingin berdiskusi
                    tentang proyek, jangan ragu untuk menghubungi saya.
                  </p>

                  <div className="space-y-5 mb-7 layer-z-1">
                    <div className="flex items-start gap-4">
                      <div className="sphere-3d w-12 h-12 rounded-full bg-[#42a5f5] text-white flex items-center justify-center shrink-0">
                        <i className="fas fa-map-marker-alt" />
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-base">
                          Lokasi
                        </h4>
                        <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
                          Jl. PUK Muntur, Ranjeng, Indonesia 45253
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="sphere-3d w-12 h-12 rounded-full bg-[#42a5f5] text-white flex items-center justify-center shrink-0">
                        <i className="fas fa-envelope" />
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-base">
                          Email
                        </h4>
                        <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
                          septian@septianfr.web.id
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="sphere-3d w-12 h-12 rounded-full bg-[#42a5f5] text-white flex items-center justify-center shrink-0">
                        <i className="fas fa-phone" />
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-base">
                          Telepon
                        </h4>
                        <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
                          +62 813-1657-036
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap layer-z-2">
                    <a
                      href="https://wa.me/628131657036"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-3d-primary flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white font-poppins font-semibold text-sm shadow-[0_5px_0_#128c7e]"
                    >
                      <i className="fab fa-whatsapp" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="https://t.me/septianofc"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-3d-primary flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0088cc] text-white font-poppins font-semibold text-sm shadow-[0_5px_0_#005f8f]"
                    >
                      <i className="fab fa-telegram" />
                      <span>Telegram</span>
                    </a>
                  </div>
                </Box3D>
              </div>

              <div className="lg:col-span-7">
                <Box3D
                  intensity={7}
                  liftZ={12}
                  className="rounded-2xl p-7 sm:p-9 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700"
                >
                  <form
                    id="contactForm"
                    onSubmit={handleContactSubmit}
                    className="space-y-5 layer-z-1"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-poppins text-sm font-medium mb-2"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="input-3d w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#334155] text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block font-poppins text-sm font-medium mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="input-3d w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#334155] text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block font-poppins text-sm font-medium mb-2"
                      >
                        Subjek
                      </label>
                      <input
                        id="subject"
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="input-3d w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#334155] text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block font-poppins text-sm font-medium mb-2"
                      >
                        Pesan
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="input-3d w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#334155] text-sm focus:outline-none resize-y"
                      />
                    </div>
                    {contactFeedback && (
                      <p
                        className={`text-sm font-medium ${
                          contactFeedback.type === 'success'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {contactFeedback.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="btn-3d-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white font-poppins font-semibold cursor-pointer disabled:opacity-60"
                    >
                      <i className="fas fa-paper-plane" />
                      <span>
                        {contactSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                      </span>
                    </button>
                  </form>
                </Box3D>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER (FULL 3D) */}
        <footer className="bg-gradient-to-r from-[#1e293b]/85 to-[#0f172a]/90 dark:from-[#0f172a]/88 dark:to-[#020617]/92 backdrop-blur-[3px] text-white pt-16 pb-6 scene-3d">
          <div className="w-[90%] max-w-[1200px] mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
              <div>
                <h4 className="font-poppins text-xl font-semibold text-[#64b5f6] pb-2.5 mb-5 border-b border-white/10">
                  Tentang Saya
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Saya adalah pelajar SMA yang bersemangat dalam pemrograman web
                  dan teknologi. Saya memiliki minat dalam pengembangan front-end
                  dan back-end.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/628131657036"
                    target="_blank"
                    rel="noreferrer"
                    className="sphere-3d w-10 h-10 rounded-full bg-white/10 hover:bg-[#42a5f5] flex items-center justify-center"
                  >
                    <i className="fab fa-whatsapp" />
                  </a>
                  <a
                    href="https://t.me/septianofc"
                    target="_blank"
                    rel="noreferrer"
                    className="sphere-3d w-10 h-10 rounded-full bg-white/10 hover:bg-[#42a5f5] flex items-center justify-center"
                  >
                    <i className="fab fa-telegram" />
                  </a>
                  <a
                    href="https://www.instagram.com/_septianfr?igsh=MTRmMDFkbzN0MnhqcQ=="
                    target="_blank"
                    rel="noreferrer"
                    className="sphere-3d w-10 h-10 rounded-full bg-white/10 hover:bg-[#42a5f5] flex items-center justify-center"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61579377972764&mibextid=ZbWKwL"
                    target="_blank"
                    rel="noreferrer"
                    className="sphere-3d w-10 h-10 rounded-full bg-white/10 hover:bg-[#42a5f5] flex items-center justify-center"
                  >
                    <i className="fab fa-facebook" />
                  </a>
                  <a
                    href="https://github.com/septianofc"
                    target="_blank"
                    rel="noreferrer"
                    className="sphere-3d w-10 h-10 rounded-full bg-white/10 hover:bg-[#42a5f5] flex items-center justify-center"
                  >
                    <i className="fab fa-github" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-poppins text-xl font-semibold text-[#64b5f6] pb-2.5 mb-5 border-b border-white/10">
                  Link Cepat
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li>
                    <a href="#home" className="hover:text-[#64b5f6]">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="hover:text-[#64b5f6]">
                      Tentang Saya
                    </a>
                  </li>
                  <li>
                    <a href="#skills" className="hover:text-[#64b5f6]">
                      Keahlian
                    </a>
                  </li>
                  <li>
                    <a href="#projects" className="hover:text-[#64b5f6]">
                      Proyek
                    </a>
                  </li>
                  <li>
                    <a href="#experience" className="hover:text-[#64b5f6]">
                      Pengalaman
                    </a>
                  </li>
                  <li>
                    <a href="#certificates" className="hover:text-[#64b5f6]">
                      Sertifikat
                    </a>
                  </li>
                  <li>
                    <a href="#services" className="hover:text-[#64b5f6]">
                      Layanan
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-[#64b5f6]">
                      Kontak
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-poppins text-xl font-semibold text-[#64b5f6] pb-2.5 mb-5 border-b border-white/10">
                  Halaman Lain
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li>
                    <a href="#now" className="hover:text-[#64b5f6]">
                      Now Page
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="hover:text-[#64b5f6]">
                      Testimoni
                    </a>
                  </li>
                  <li>
                    <a href="#changelog" className="hover:text-[#64b5f6]">
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a href="#qr" className="hover:text-[#64b5f6]">
                      QR Code
                    </a>
                  </li>
                  <li>
                    <a href="#home" className="hover:text-[#64b5f6]">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#home" className="hover:text-[#64b5f6]">
                      Terms of Use
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-5 border-t border-white/10 text-sm text-slate-400">
              &copy; 2026 Septian Fathur Rohman. All Rights Reserved.
            </div>
          </div>
        </footer>
      </main>

      {/* 3D Floating Back-To-Top Button */}
      <a
        href="#home"
        id="backToTop"
        aria-label="Kembali ke atas"
        className={`sphere-3d fixed bottom-6 left-5 w-12 h-12 rounded-full bg-[#42a5f5] hover:bg-[#1e88e5] text-white flex items-center justify-center z-[998] transition-all duration-300 ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <i className="fas fa-chevron-up" />
      </a>

      {/* 3D Certificate Lightbox Modal */}
      {modalCertIndex !== null && (
        <div
          id="certificateModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalCertIndex(null);
          }}
          className="fixed inset-0 z-[2000] bg-black/90 flex flex-col items-center justify-center p-4 scene-3d"
        >
          <button
            type="button"
            onClick={() => setModalCertIndex(null)}
            aria-label="Tutup"
            className="sphere-3d fixed top-5 right-6 w-12 h-12 rounded-full bg-slate-800 text-white text-2xl flex items-center justify-center cursor-pointer z-[2001]"
          >
            &times;
          </button>

          <Box3D
            intensity={12}
            liftZ={20}
            className="max-w-4xl w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-700 p-4"
          >
            <img
              src={CERTIFICATES[modalCertIndex].img}
              alt={CERTIFICATES[modalCertIndex].alt}
              className="w-full max-h-[65vh] object-contain rounded-xl mb-4 layer-z-2"
            />
            <div className="px-2 pb-1 text-center layer-z-1">
              <h3 className="font-poppins text-lg sm:text-xl font-bold text-[#1e293b] dark:text-white">
                {CERTIFICATES[modalCertIndex].title}
              </h3>
              <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
                {CERTIFICATES[modalCertIndex].desc} (Urutan:{' '}
                {modalCertIndex + 1} dari {CERTIFICATES.length})
              </p>
            </div>
          </Box3D>
        </div>
      )}
    </div>
  );
}
