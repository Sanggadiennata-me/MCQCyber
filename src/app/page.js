import Link from 'next/link';
import {
  Shield,
  Users,
  Zap,
  Lock,
  Clock,
  Compass,
  ArrowRight,
  Database,
  Terminal,
  Activity,
  Layers,
  KeyRound,
  FileSearch,
  Crosshair,
  Bug,
} from 'lucide-react';
import { getCategories } from '@/lib/questions/loader';

const categoryIcons = {
  'web-security': Bug,
  'network-security': Activity,
  cryptography: KeyRound,
  'digital-forensics': FileSearch,
  'linux-system': Terminal,
  'malware-analysis': Crosshair,
  'penetration-testing': Shield,
  'blue-team-soc': Layers,
  'general-cybersecurity': Database,
};

export default function HomePage() {
  const categories = getCategories();

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-cyber-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-secondary/80 px-3 py-1 text-xs font-medium text-cyber-electric shadow-glow">
              <Zap className="h-3.5 w-3.5 text-cyber-accent" />
              <span>Platform Temporer — Tanpa Login & Tanpa Jejak Permanen</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Simulasi Ujian & Teori <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-electric via-blue-400 to-cyber-accent">
                Cyber Security MCQ
              </span>
            </h1>

            <p className="text-base sm:text-lg text-cyber-muted max-w-2xl mx-auto leading-relaxed">
              Persiapan sertifikasi keamanan informasi, penyisihan KMIPN, dan teori CTF. Kerjakan secara mandiri atau bertanding dalam tim beranggotakan hingga 3 peserta dengan distribusi soal tanpa duplikasi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/practice"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyber-primary px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-cyber-electric hover:shadow-lg transition-all"
              >
                <span>Solo Practice (Mandiri)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-cyber-border bg-cyber-secondary px-7 py-3.5 text-sm font-semibold text-cyber-text hover:bg-cyber-hover hover:border-cyber-electric/60 transition-all"
              >
                <Users className="h-4 w-4 text-cyber-electric" />
                <span>Team Challenge (Room)</span>
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="rounded-xl border border-cyber-border/70 bg-cyber-secondary/50 p-3.5">
                <div className="text-xl font-bold text-cyber-electric">108+</div>
                <div className="text-xs text-cyber-muted mt-0.5">Soal Berkualitas</div>
              </div>
              <div className="rounded-xl border border-cyber-border/70 bg-cyber-secondary/50 p-3.5">
                <div className="text-xl font-bold text-cyber-accent">9</div>
                <div className="text-xs text-cyber-muted mt-0.5">Kategori Utama</div>
              </div>
              <div className="rounded-xl border border-cyber-border/70 bg-cyber-secondary/50 p-3.5">
                <div className="text-xl font-bold text-cyber-success">100%</div>
                <div className="text-xs text-cyber-muted mt-0.5">Server Authoritative</div>
              </div>
              <div className="rounded-xl border border-cyber-border/70 bg-cyber-secondary/50 p-3.5">
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-cyber-muted mt-0.5">Data Permanen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUA MODE UTAMA */}
      <section className="py-16 bg-cyber-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pilih Mode Latihan</h2>
            <p className="text-sm text-cyber-muted mt-2">
              Dua mode fleksibel yang dirancang untuk pembelajaran pribadi maupun koordinasi tim kompetisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SOLO PRACTICE CARD */}
            <div className="relative rounded-2xl border border-cyber-border bg-cyber-card p-8 flex flex-col justify-between hover:border-cyber-primary/60 transition-all group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-electric">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyber-electric transition-colors">
                  Solo Practice
                </h3>
                <p className="text-sm text-cyber-muted leading-relaxed">
                  Latihan mandiri dengan filter kategori, tingkat kesulitan (Easy, Medium, Hard, Mixed), jumlah soal (5–50), dan batas waktu pengerjaan. Jawaban dan pembahasan teknis lengkap langsung tersedia setelah ujian selesai.
                </p>

                <ul className="space-y-2.5 text-xs text-cyber-muted pt-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric" />
                    Bebas memilih kombinasi 9 kategori soal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric" />
                    Navigasi soal cepat dengan indikator terjawab
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric" />
                    Penjelasan teknis komprehensif di akhir sesi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-electric" />
                    Opsi Negative Marking dan Randomisasi Soal & Opsi
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/practice"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-cyber-secondary border border-cyber-border px-5 py-3 text-sm font-semibold text-cyber-text hover:bg-cyber-primary hover:text-white transition-all"
                >
                  Konfigurasi Solo Practice
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* TEAM CHALLENGE CARD */}
            <div className="relative rounded-2xl border border-cyber-border bg-cyber-card p-8 flex flex-col justify-between hover:border-cyber-electric/60 transition-all group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-electric/10 border border-cyber-electric/30 text-cyber-electric">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyber-electric transition-colors">
                  Team Challenge (Max 3 Peserta)
                </h3>
                <p className="text-sm text-cyber-muted leading-relaxed">
                  Mode kompetisi tim multiplayer. Host membuat room dengan room code unik. Setiap anggota tim menerima paket soal yang berbeda (tanpa duplikasi) dan timer individual yang berjalan secara independen.
                </p>

                <ul className="space-y-2.5 text-xs text-cyber-muted pt-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent" />
                    Distribusi soal unik per anggota: tidak ada soal duplikat
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent" />
                    Timer individual server-authoritative (tahan refresh)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent" />
                    Akumulasi Skor Tim: Total = Player 1 + Player 2 + Player 3
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent" />
                    Sinkronisasi lobby dan status real-time via Supabase
                  </li>
                </ul>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/team/create"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyber-primary px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-cyber-electric transition-all"
                >
                  Create Room
                </Link>
                <Link
                  href="/team/join"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-cyber-border bg-cyber-secondary px-5 py-3 text-sm font-semibold text-cyber-text hover:bg-cyber-hover transition-all"
                >
                  Join Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI PREVIEW */}
      <section className="py-16 border-t border-cyber-border/40 bg-cyber-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyber-electric mb-1">
                <Compass className="h-3.5 w-3.5" />
                <span>Cakupan Materi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">9 Bidang Keamanan Siber</h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-electric hover:underline"
            >
              Lihat Detail Semua Kategori
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Shield;
              return (
                <div
                  key={cat.slug}
                  className="rounded-xl border border-cyber-border bg-cyber-card/70 p-5 hover:border-cyber-border/80 hover:bg-cyber-card transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-secondary border border-cyber-border text-cyber-electric">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-cyber-muted bg-cyber-secondary/80 px-2.5 py-1 rounded border border-cyber-border/60">
                      {cat.questionsCount} Soal
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{cat.name}</h3>
                  <p className="text-xs text-cyber-muted line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CARA KERJA & KEAMANAN */}
      <section className="py-16 border-t border-cyber-border/40 bg-cyber-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Arsitektur Sesi Sementara</h2>
            <p className="text-sm text-cyber-muted mt-2">
              Prinsip desain utama: privasi mutlak dan keamanan ujian server-authoritative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Kunci Jawaban Terlindungi</h3>
              <p className="text-xs text-cyber-muted leading-relaxed">
                Kunci jawaban dan pembahasan tidak pernah dikirim ke browser peserta saat kuis berjalan. Semua evaluasi dan perhitungan skor dihitung 100% di sisi server.
              </p>
            </div>

            <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-electric/10 border border-cyber-electric/30 text-cyber-electric">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Timer Server-Authoritative</h3>
              <p className="text-xs text-cyber-muted leading-relaxed">
                Waktu kedaluwarsa disimpan pada database. Refresh halaman tidak akan me-reset waktu pengerjaan. Jawaban yang dikirim melampaui batas waktu akan ditolak server.
              </p>
            </div>

            <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-success/10 border border-cyber-success/30 text-cyber-success">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Pembersihan Otomatis</h3>
              <p className="text-xs text-cyber-muted leading-relaxed">
                Data room dan hasil pengerjaan hanya disimpan sementara selama durasi sesi. Rutinitas cleanup berkala menghapus room yang telah selesai atau kedaluwarsa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
