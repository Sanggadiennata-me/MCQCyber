import Link from 'next/link';
import { Users, PlusCircle, LogIn, ArrowRight, Shield, Clock, Shuffle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Team Challenge — Cyber Security MCQ Platform',
  description: 'Mode kompetisi tim Cyber Security MCQ maksimal 3 peserta dengan distribusi soal tanpa duplikasi.',
};

export default function TeamPortalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-secondary px-3.5 py-1 text-xs font-semibold text-cyber-electric shadow-glow">
          <Users className="h-3.5 w-3.5" />
          <span>Multiplayer Mode</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Team Challenge
        </h1>
        <p className="text-sm text-cyber-muted leading-relaxed">
          Bentuk tim maksimal 3 orang. Setiap anggota menerima paket soal yang berbeda secara eksklusif dan mengumpulkan skor secara kolektif.
        </p>
      </div>

      {/* TWO PRIMARY ACTIONS: CREATE OR JOIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CREATE ROOM */}
        <div className="rounded-3xl border border-cyber-border bg-cyber-card p-8 sm:p-10 flex flex-col justify-between hover:border-cyber-primary/70 transition-all shadow-xl group">
          <div className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-electric">
              <PlusCircle className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-cyber-electric transition-colors">
              Create Room (Host)
            </h2>
            <p className="text-xs sm:text-sm text-cyber-muted leading-relaxed">
              Bertindak sebagai Host tim. Buat room baru, atur konfigurasi soal dan durasi, dapatkan kode unik 6-karakter, dan undang hingga 2 rekan tim Anda.
            </p>
            <div className="pt-2 text-xs text-cyber-darkMuted space-y-1">
              <div>• Kontrol penuh pengaturan pertandingan</div>
              <div>• Memulai pertandingan saat minimal 2 peserta siap</div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/team/create"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyber-primary py-3.5 text-sm font-bold text-white shadow-glow hover:bg-cyber-electric transition-all"
            >
              <span>Buat Room Baru</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* JOIN ROOM */}
        <div className="rounded-3xl border border-cyber-border bg-cyber-card p-8 sm:p-10 flex flex-col justify-between hover:border-cyber-electric/70 transition-all shadow-xl group">
          <div className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyber-secondary border border-cyber-border text-cyber-electric">
              <LogIn className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-cyber-electric transition-colors">
              Join Room (Peserta)
            </h2>
            <p className="text-xs sm:text-sm text-cyber-muted leading-relaxed">
              Sudah memiliki Room Code dari rekan tim Anda? Masukkan kode room dan nickname Anda untuk langsung bergabung ke Room Lobby.
            </p>
            <div className="pt-2 text-xs text-cyber-darkMuted space-y-1">
              <div>• Cepat tanpa perlu pendaftaran akun</div>
              <div>• Sinkronisasi otomatis saat pertandingan dimulai</div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/team/join"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyber-border bg-cyber-secondary py-3.5 text-sm font-bold text-cyber-text hover:bg-cyber-hover hover:border-cyber-electric/60 transition-all"
            >
              <span>Gabung dengan Kode Room</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CORE MULTIPLAYER HIGHLIGHTS */}
      <div className="rounded-2xl border border-cyber-border/70 bg-cyber-secondary/40 p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-4">Mekanisme Utama Pertandingan Tim:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-cyber-muted">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyber-electric font-semibold text-sm">
              <Shuffle className="h-4 w-4" />
              <span>Distribusi Non-Duplikasi</span>
            </div>
            <p className="leading-relaxed">
              Sistem membagi bank soal secara eksklusif. Player 1, Player 2, dan Player 3 tidak akan mendapatkan soal yang sama.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyber-electric font-semibold text-sm">
              <Clock className="h-4 w-4" />
              <span>Timer Mandiri</span>
            </div>
            <p className="leading-relaxed">
              Setiap peserta memiliki batas waktu individual. Jika salah satu anggota selesai duluan, anggota lainnya tetap dapat melanjutkan hingga waktunya habis.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyber-electric font-semibold text-sm">
              <Shield className="h-4 w-4" />
              <span>Skor Kolektif</span>
            </div>
            <p className="leading-relaxed">
              Total Skor Tim merupakan penjumlahan murni dari poin masing-masing peserta. Sinergi dan akurasi seluruh anggota menentukan kemenangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
