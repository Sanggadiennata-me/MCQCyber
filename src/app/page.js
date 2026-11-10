import Link from 'next/link';
import {
  Shield,
  Users,
  Zap,
  Lock,
  Clock,
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
  const totalQuestions = categories.reduce((sum, c) => sum + (c.questionsCount || 0), 0);

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="py-16 sm:py-24 border-b border-cyber-border bg-cyber-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Simulasi Ujian dan Latihan <span className="text-cyber-primary">Cyber Security</span>
            </h1>

            <p className="text-lg sm:text-xl text-cyber-muted max-w-2xl leading-relaxed">
              Platform persiapan sertifikasi, seleksi KMIPN, dan teori CTF. Mode Solo Practice mandiri atau Team Challenge 3 orang dengan distribusi soal tanpa duplikasi dan evaluasi di sisi server.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-cyber-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
              >
                <span>Mulai Solo Practice</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-cyber-border bg-cyber-card px-6 py-3.5 text-sm font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
              >
                <Users className="h-4 w-4 text-cyber-primary" />
                <span>Buka Team Challenge</span>
              </Link>
            </div>

            {/* KEY METRICS POSTER STRIP */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-cyber-border/70 mt-8">
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-sm">
                <div className="text-3xl font-bold text-white tabular-nums">{totalQuestions}</div>
                <div className="text-sm text-cyber-muted mt-1">Soal Terverifikasi</div>
              </div>
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-sm">
                <div className="text-3xl font-bold text-cyber-primary tabular-nums">9</div>
                <div className="text-sm text-cyber-muted mt-1">Kategori Cyber</div>
              </div>
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-sm">
                <div className="text-3xl font-bold text-white tabular-nums">3</div>
                <div className="text-sm text-cyber-muted mt-1">Peserta Per Tim</div>
              </div>
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-sm">
                <div className="text-3xl font-bold text-cyber-primary tabular-nums">0</div>
                <div className="text-sm text-cyber-muted mt-1">Data Permanen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUA MODE UTAMA */}
      <section className="py-20 bg-cyber-secondary border-b border-cyber-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Dua Mode Simulasi</h2>
            <p className="text-base text-cyber-muted mt-2">
              Pilih antara latihan mandiri dengan konfigurasi kustom atau kompetisi tim dengan timer individual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SOLO PRACTICE */}
            <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 flex flex-col justify-between hover:border-cyber-primary transition-colors">
              <div className="space-y-4">
                <div className="text-sm font-semibold text-cyber-primary">Latihan Mandiri</div>
                <h3 className="text-2xl font-bold text-white">
                  Solo Practice
                </h3>
                <p className="text-sm text-cyber-muted leading-relaxed">
                  Latihan mandiri dengan filter kategori, tingkat kesulitan (Easy, Medium, Hard, Campuran), jumlah soal 5 hingga 50, dan durasi pengerjaan. Kunci jawaban dan pembahasan teknis ditampilkan setelah ujian diserahkan.
                </p>

                <ul className="space-y-2.5 text-sm text-cyber-muted pt-3">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Pilih kombinasi dari 9 kategori materi cybersecurity</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Navigasi nomor soal dengan penanda status jawaban</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Pembahasan teknis mendalam untuk setiap soal pada hasil akhir</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Opsi pengurangan nilai salah (negative marking) dan pengacakan</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-sm bg-cyber-field border border-cyber-primary/40 px-5 py-3 text-sm font-semibold text-white hover:bg-cyber-primary transition-colors"
                >
                  Buka Pengaturan Solo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* TEAM CHALLENGE */}
            <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 flex flex-col justify-between hover:border-cyber-primary transition-colors">
              <div className="space-y-4">
                <div className="text-sm font-semibold text-cyber-primary">Mode Kompetisi Tim</div>
                <h3 className="text-2xl font-bold text-white">
                  Team Challenge
                </h3>
                <p className="text-sm text-cyber-muted leading-relaxed">
                  Mode multiplayer hingga 3 peserta per room. Host membuat room dan membagikan kode. Setiap anggota tim menerima paket soal yang berbeda tanpa duplikasi dan timer mandiri di sisi server.
                </p>

                <ul className="space-y-2.5 text-sm text-cyber-muted pt-3">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Distribusi soal eksklusif: 0% soal kembar antar rekan tim</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Timer individual berbasis batas waktu server (tahan refresh browser)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Kalkulasi skor kolektif tim dan kontribusi poin per anggota</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-primary mt-2 flex-shrink-0" />
                    <span>Sinkronisasi lobby dan room realtime melalui Supabase</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/team/create"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-sm bg-cyber-primary px-5 py-3 text-sm font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
                >
                  Buat Room Baru
                </Link>
                <Link
                  href="/team/join"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-sm border border-cyber-border bg-cyber-bg px-5 py-3 text-sm font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
                >
                  Gabung Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI PREVIEW */}
      <section className="py-20 bg-cyber-bg border-b border-cyber-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">9 Bidang Keamanan Siber</h2>
              <p className="text-base text-cyber-muted mt-2">
                Bank soal disusun berdasarkan kurikulum kompetisi dan sertifikasi industri terkini.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyber-primary hover:underline"
            >
              Lihat Rincian Seluruh Kategori
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Shield;
              return (
                <div
                  key={cat.slug}
                  className="rounded-sm border border-cyber-border bg-cyber-card p-5 hover:border-cyber-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-5 w-5 text-cyber-primary" />
                    <span className="text-xs tabular-nums font-medium text-cyber-muted px-2 py-0.5 rounded-sm bg-cyber-secondary border border-cyber-border">
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

      {/* KEAMANAN & ARSITEKTUR */}
      <section className="py-20 bg-cyber-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Integritas dan Keamanan Ujian</h2>
            <p className="text-base text-cyber-muted mt-2">
              Arsitektur aplikasi dirancang untuk mencegah kebocoran data dan menjaga kejujuran simulasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
              <Lock className="h-6 w-6 text-cyber-primary" />
              <h3 className="font-bold text-white text-base">Evaluasi Sisi Server</h3>
              <p className="text-sm text-cyber-muted leading-relaxed">
                Kunci jawaban dan pembahasan tidak dikirim ke browser peserta saat kuis berjalan. Perhitungan skor dilakukan sepenuhnya oleh server saat jawaban diserahkan.
              </p>
            </div>

            <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
              <Clock className="h-6 w-6 text-cyber-primary" />
              <h3 className="font-bold text-white text-base">Timer Server-Authoritative</h3>
              <p className="text-sm text-cyber-muted leading-relaxed">
                Waktu selesai kuis dikunci pada database. Refresh halaman tidak akan menambah waktu. Jawaban yang diserahkan setelah waktu berakhir akan ditolak otomatis.
              </p>
            </div>

            <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
              <Shield className="h-6 w-6 text-cyber-primary" />
              <h3 className="font-bold text-white text-base">Pembersihan Otomatis</h3>
              <p className="text-sm text-cyber-muted leading-relaxed">
                Sesi bersifat temporer tanpa penyimpanan akun atau riwayat nilai permanen. Seluruh data room akan dibersihkan setelah pertandingan berakhir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
