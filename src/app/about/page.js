import { Shield, Clock, Users, Trash2, Cpu, CheckCircle2, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Tentang & Aturan Sistem — Cyber Security MCQ Platform',
  description: 'Panduan lengkap aturan main, arsitektur data temporer, dan filosofi sistem Cyber Security MCQ Platform.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-secondary px-3 py-1 text-xs font-semibold text-cyber-electric">
          <Shield className="h-3.5 w-3.5" />
          <span>Arsitektur & Regulasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Panduan & Aturan Platform
        </h1>
        <p className="text-sm text-cyber-muted max-w-xl mx-auto">
          Penjelasan lengkap mengenai tata cara ujian, sistem penilaian, distribusi soal non-duplikasi, dan konsep data sementara.
        </p>
      </div>

      {/* CORE PHILOSOPHY */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30">
            <Trash2 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Konsep Utama: Data Bersifat Sementara (Temporary)</h2>
        </div>
        <p className="text-xs sm:text-sm text-cyber-muted leading-relaxed">
          Platform ini dirancang khusus untuk kenyamanan, kecepatan, dan privasi penuh:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-cyber-muted pt-2">
          <li className="flex items-start gap-2 bg-cyber-secondary/60 p-3 rounded-lg border border-cyber-border/40">
            <CheckCircle2 className="h-4 w-4 text-cyber-success shrink-0 mt-0.5" />
            <span><strong>Tanpa Akun Wajib:</strong> Anda cukup memasukkan nickname sementara saat memulai.</span>
          </li>
          <li className="flex items-start gap-2 bg-cyber-secondary/60 p-3 rounded-lg border border-cyber-border/40">
            <CheckCircle2 className="h-4 w-4 text-cyber-success shrink-0 mt-0.5" />
            <span><strong>Tanpa Leaderboard Permanen:</strong> Tidak ada rekam jejak historis yang disimpan di database.</span>
          </li>
          <li className="flex items-start gap-2 bg-cyber-secondary/60 p-3 rounded-lg border border-cyber-border/40">
            <CheckCircle2 className="h-4 w-4 text-cyber-success shrink-0 mt-0.5" />
            <span><strong>Pembersihan Otomatis:</strong> Data room multiplayer langsung dibersihkan setelah sesi berakhir.</span>
          </li>
          <li className="flex items-start gap-2 bg-cyber-secondary/60 p-3 rounded-lg border border-cyber-border/40">
            <CheckCircle2 className="h-4 w-4 text-cyber-success shrink-0 mt-0.5" />
            <span><strong>Aman & Mandiri:</strong> Tidak ada profiling pengguna, cookie tracking pihak ketiga, ataupun telemetry invasif.</span>
          </li>
        </ul>
      </div>

      {/* ATURAN SOLO PRACTICE */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-primary/10 text-cyber-electric border border-cyber-primary/30">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Aturan Mode Solo Practice</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-cyber-muted leading-relaxed">
          <p>
            Solo Practice diperuntukkan bagi latihan individu. Anda dapat mengkustomisasi seluruh aspek simulasi:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-xs">
            <li><strong>Konfigurasi:</strong> Pilih kategori materi, tingkat kesulitan (Easy, Medium, Hard, atau Mixed), jumlah butir soal (5 hingga 50 soal), dan durasi (5 hingga 60 menit).</li>
            <li><strong>Pengerjaan:</strong> Tampilan menampilkan satu soal pada satu waktu dengan navigasi tombol Prev/Next dan grid nomor soal.</li>
            <li><strong>Timer Otomatis:</strong> Hitung mundur berjalan di latar belakang. Jika waktu habis, jawaban otomatis tersubmit (*auto-submit*).</li>
            <li><strong>Hasil & Pembahasan:</strong> Segera setelah submit, sistem menampilkan rekapitulasi nilai, persentase akurasi, waktu pengerjaan, dan pembahasan teknis mendalam untuk setiap butir soal.</li>
          </ol>
        </div>
      </div>

      {/* ATURAN TEAM CHALLENGE */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-electric/10 text-cyber-electric border border-cyber-electric/30">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Aturan Mode Team Challenge (Multiplayer)</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-cyber-muted leading-relaxed">
          <p>
            Mode multiplayer dirancang untuk menguji kekompakan dan spesialisasi anggota tim:
          </p>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <span className="text-cyber-accent font-bold">•</span>
              <span><strong>Kapasitas Room:</strong> Maksimal 3 peserta dan minimal 2 peserta untuk dapat memulai pertandingan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-accent font-bold">•</span>
              <span><strong>Distribusi Soal Unik (Non-Duplikasi):</strong> Setiap anggota tim mendapatkan paket soalnya sendiri-sendiri. Peserta TIDAK menjawab soal yang sama bersama-sama.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-accent font-bold">•</span>
              <span><strong>Timer Individual:</strong> Setiap peserta memiliki timer independen di sisi server (*server-authoritative*). Jika Player 1 selesai dalam 10 menit, Player 1 berstatus selesai, sedangkan Player 2 dan 3 tetap dapat melanjutkan hingga timer mereka habis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-accent font-bold">•</span>
              <span><strong>Refresh Resilient:</strong> Jika koneksi terputus atau peserta melakukan refresh browser, timer dan progres jawaban akan dipulihkan secara akurat dari server.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-accent font-bold">•</span>
              <span><strong>Skor Kolektif:</strong> Total Nilai Tim dihitung dari penjumlahan nilai seluruh anggota (<code className="text-cyber-electric">Team Score = P1 + P2 + P3</code>).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SISTEM KEAMANAN */}
      <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-success/10 text-cyber-success border border-cyber-success/30">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Standar Keamanan Aplikasi</h2>
        </div>
        <p className="text-xs sm:text-sm text-cyber-muted leading-relaxed">
          Kami mematuhi kaidah keamanan siber yang ketat:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-cyber-muted pt-1">
          <div className="p-3 rounded-lg bg-cyber-secondary border border-cyber-border/40">
            <div className="font-semibold text-white mb-1">Zero Client-Side Answers</div>
            Kunci jawaban tidak pernah diinjeksi ke HTML/JS client sebelum ujian selesai.
          </div>
          <div className="p-3 rounded-lg bg-cyber-secondary border border-cyber-border/40">
            <div className="font-semibold text-white mb-1">Server Authoritative Scoring</div>
            Klien hanya mengirim opsi yang dipilih. Skor dan akurasi dihitung 100% oleh API backend.
          </div>
          <div className="p-3 rounded-lg bg-cyber-secondary border border-cyber-border/40">
            <div className="font-semibold text-white mb-1">Cryptographic Token Hashing</div>
            Host token dan participant token di-hash menggunakan SHA-256 sebelum disimpan di database.
          </div>
          <div className="p-3 rounded-lg bg-cyber-secondary border border-cyber-border/40">
            <div className="font-semibold text-white mb-1">Row Level Security (RLS)</div>
            Tabel database Supabase diproteksi oleh RLS untuk mencegah akses data lintas peserta.
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/practice"
          className="inline-flex items-center justify-center rounded-xl bg-cyber-primary px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-cyber-electric transition-all"
        >
          Siap Mulai Simulasi
        </Link>
      </div>
    </div>
  );
}
