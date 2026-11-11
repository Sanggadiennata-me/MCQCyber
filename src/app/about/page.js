import { Shield, Clock, Users, Trash2, CheckCircle2, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Panduan & Aturan Platform - Cyber Security MCQ Platform',
  description: 'Panduan lengkap aturan main, arsitektur data temporer, dan filosofi sistem Cyber Security MCQ Platform.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Panduan dan Aturan Platform
        </h1>
        <p className="text-base text-cyber-muted max-w-2xl leading-relaxed">
          Penjelasan lengkap tata cara ujian, sistem penilaian, distribusi soal non-duplikasi, dan konsep data sesi sementara.
        </p>
      </div>

      {/* CORE PHILOSOPHY */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Trash2 className="h-5 w-5 text-cyber-primary" />
          <h2 className="text-xl font-bold text-white">Konsep Utama: Data Bersifat Sementara</h2>
        </div>
        <p className="text-sm text-cyber-muted leading-relaxed">
          Platform ini dirancang khusus untuk efisiensi, kecepatan, dan privasi penuh:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-cyber-muted pt-2">
          <div className="flex items-start gap-2.5 bg-cyber-secondary p-3.5 rounded-sm border border-cyber-border">
            <CheckCircle2 className="h-4 w-4 text-cyber-primary shrink-0 mt-0.5" />
            <span><strong className="text-white">Tanpa Akun Wajib:</strong> Anda cukup memasukkan nickname sementara saat memulai sesi.</span>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-secondary p-3.5 rounded-sm border border-cyber-border">
            <CheckCircle2 className="h-4 w-4 text-cyber-primary shrink-0 mt-0.5" />
            <span><strong className="text-white">Tanpa Leaderboard Permanen:</strong> Tidak ada rekam jejak historis yang disimpan di database.</span>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-secondary p-3.5 rounded-sm border border-cyber-border">
            <CheckCircle2 className="h-4 w-4 text-cyber-primary shrink-0 mt-0.5" />
            <span><strong className="text-white">Pembersihan Otomatis:</strong> Data room multiplayer langsung dibersihkan setelah sesi berakhir.</span>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-secondary p-3.5 rounded-sm border border-cyber-border">
            <CheckCircle2 className="h-4 w-4 text-cyber-primary shrink-0 mt-0.5" />
            <span><strong className="text-white">Aman & Mandiri:</strong> Tidak ada profiling pengguna, cookie tracking pihak ketiga, ataupun telemetry invasif.</span>
          </div>
        </div>
      </div>

      {/* ATURAN SOLO PRACTICE */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-cyber-primary" />
          <h2 className="text-xl font-bold text-white">Aturan Mode Solo Practice</h2>
        </div>
        <div className="space-y-3 text-sm text-cyber-muted leading-relaxed">
          <p>
            Solo Practice diperuntukkan bagi latihan individu. Anda dapat menyesuaikan seluruh aspek simulasi:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li><strong className="text-white">Konfigurasi:</strong> Pilih kategori materi, tingkat kesulitan (Easy, Medium, Hard, atau Campuran), jumlah butir soal (5 hingga 50 soal), dan durasi (5 hingga 60 menit).</li>
            <li><strong className="text-white">Pengerjaan:</strong> Tampilan menyajikan satu soal pada satu waktu dengan navigasi tombol Prev/Next dan nomor soal dengan indikator status.</li>
            <li><strong className="text-white">Timer Otomatis:</strong> Hitung mundur berjalan di latar belakang. Jika waktu habis, jawaban otomatis diserahkan ke server (auto-submit).</li>
            <li><strong className="text-white">Hasil & Pembahasan:</strong> Setelah submit, sistem menampilkan rekapitulasi nilai, persentase akurasi, waktu pengerjaan, dan pembahasan teknis mendalam untuk setiap butir soal.</li>
          </ol>
        </div>
      </div>

      {/* ATURAN TEAM CHALLENGE */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-cyber-primary" />
          <h2 className="text-xl font-bold text-white">Aturan Mode Team Challenge (Multiplayer)</h2>
        </div>
        <div className="space-y-3 text-sm text-cyber-muted leading-relaxed">
          <p>
            Mode kompetisi multiplayer dirancang untuk menguji kekompakan dan spesialisasi anggota tim:
          </p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-cyber-primary font-bold">•</span>
              <span><strong className="text-white">Kapasitas Room:</strong> Maksimal 3 peserta dan minimal 2 peserta untuk dapat memulai simulasi pertandingan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-primary font-bold">•</span>
              <span><strong className="text-white">Distribusi Soal Unik:</strong> Setiap anggota tim mendapatkan paket soal eksklusif tanpa duplikasi antar rekan tim.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-primary font-bold">•</span>
              <span><strong className="text-white">Timer Individual:</strong> Setiap peserta memiliki countdown timer independen di sisi server (server-authoritative).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-primary font-bold">•</span>
              <span><strong className="text-white">Refresh Resilient:</strong> Jika koneksi terputus atau halaman di-refresh, sisa waktu dan pilihan jawaban dipulihkan secara aman dari server.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-primary font-bold">•</span>
              <span><strong className="text-white">Skor Kolektif:</strong> Total nilai tim dihitung dari akumulasi poin seluruh anggota tim (Skor Tim = P1 + P2 + P3).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SISTEM KEAMANAN */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-cyber-primary" />
          <h2 className="text-xl font-bold text-white">Standar Keamanan Aplikasi</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-cyber-muted pt-1">
          <div className="p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border">
            <div className="font-semibold text-white mb-1">Zero Client-Side Answers</div>
            Kunci jawaban tidak pernah dikirim ke browser sebelum pengerjaan ujian selesai.
          </div>
          <div className="p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border">
            <div className="font-semibold text-white mb-1">Server Authoritative Scoring</div>
            Klien hanya mengirim opsi jawaban yang dipilih. Evaluasi dan nilai dihitung 100% oleh server.
          </div>
          <div className="p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border">
            <div className="font-semibold text-white mb-1">Cryptographic Token Hashing</div>
            Host token dan participant token di-hash menggunakan SHA-256 sebelum diverifikasi di database.
          </div>
          <div className="p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border">
            <div className="font-semibold text-white mb-1">Row Level Security (RLS)</div>
            Tabel database Supabase diproteksi oleh kebijakan RLS untuk memisahkan sesi antar tim.
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/practice"
          className="inline-flex items-center justify-center rounded-sm bg-cyber-primary px-8 py-3 text-sm font-bold text-cyber-ink hover:bg-cyber-primaryHover transition-colors shadow-sm"
        >
          Mulai Solo Practice Sekarang
        </Link>
      </div>
    </div>
  );
}
