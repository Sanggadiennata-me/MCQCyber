import Link from 'next/link';
import { Users, PlusCircle, LogIn, ArrowRight, Shield, Clock, Shuffle } from 'lucide-react';

export const metadata = {
  title: 'Team Challenge - Cyber Security MCQ Platform',
  description: 'Mode kompetisi tim Cyber Security MCQ maksimal 3 peserta dengan distribusi soal tanpa duplikasi.',
};

export default function TeamPortalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Team Challenge
        </h1>
        <p className="text-base text-cyber-muted leading-relaxed">
          Bentuk tim 2 hingga 3 orang. Setiap anggota menerima paket soal yang berbeda tanpa duplikasi dan mengumpulkan skor secara kolektif.
        </p>
      </div>

      {/* TWO PRIMARY ACTIONS: CREATE OR JOIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CREATE ROOM */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 flex flex-col justify-between hover:border-cyber-primary transition-colors">
          <div className="space-y-4">
            <PlusCircle className="h-8 w-8 text-cyber-primary" />
            <h2 className="text-2xl font-bold text-white">
              Buat Room Baru (Host)
            </h2>
            <p className="text-sm text-cyber-muted leading-relaxed">
              Bertindak sebagai Host tim. Buat room baru, atur konfigurasi soal dan durasi, peroleh kode room 6 karakter acak, dan undang hingga 2 rekan tim Anda.
            </p>
            <div className="pt-2 text-xs text-cyber-muted space-y-1">
              <div>• Kontrol penuh pengaturan pertandingan</div>
              <div>• Memulai pertandingan saat minimal 2 peserta hadir di lobby</div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/team/create"
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-cyber-primary py-3.5 text-sm font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
            >
              <span>Buat Room Baru</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* JOIN ROOM */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 flex flex-col justify-between hover:border-cyber-primary transition-colors">
          <div className="space-y-4">
            <LogIn className="h-8 w-8 text-cyber-primary" />
            <h2 className="text-2xl font-bold text-white">
              Gabung Room (Peserta)
            </h2>
            <p className="text-sm text-cyber-muted leading-relaxed">
              Sudah memiliki Room Code dari rekan tim Anda? Masukkan kode room dan nickname Anda untuk langsung masuk ke Room Lobby pertandingan.
            </p>
            <div className="pt-2 text-xs text-cyber-muted space-y-1">
              <div>• Langsung masuk tanpa pendaftaran akun</div>
              <div>• Sinkronisasi otomatis saat pertandingan dimulai oleh Host</div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/team/join"
              className="w-full flex items-center justify-center gap-2 rounded-sm border border-cyber-border bg-cyber-secondary py-3.5 text-sm font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
            >
              <span>Gabung dengan Kode Room</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CORE MULTIPLAYER HIGHLIGHTS */}
      <div className="rounded-sm border border-cyber-border bg-cyber-secondary p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-4">Mekanisme Utama Pertandingan Tim:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-cyber-muted">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Shuffle className="h-4 w-4 text-cyber-primary" />
              <span>Distribusi Non-Duplikasi</span>
            </div>
            <p className="leading-relaxed">
              Sistem membagi bank soal secara eksklusif. Player 1, Player 2, dan Player 3 tidak akan mendapatkan soal yang sama.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Clock className="h-4 w-4 text-cyber-primary" />
              <span>Timer Mandiri Server</span>
            </div>
            <p className="leading-relaxed">
              Setiap pemain memiliki countdown timer individual. Batas waktu diverifikasi oleh database server secara independen.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Shield className="h-4 w-4 text-cyber-primary" />
              <span>Sesi Bersih Otomatis</span>
            </div>
            <p className="leading-relaxed">
              Setelah seluruh tim menyelesaikan ujian dan melihat hasil akhir, seluruh data room akan dibersihkan secara otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
