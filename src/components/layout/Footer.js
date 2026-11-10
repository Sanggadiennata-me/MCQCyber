import Link from 'next/link';
import { Shield, Lock, Trash2, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border bg-cyber-secondary py-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyber-primary" />
              <span className="font-bold text-cyber-text text-base">Cyber Security MCQ Platform</span>
            </div>
            <p className="text-sm text-cyber-muted leading-relaxed max-w-md">
              Platform latihan, simulasi ujian sertifikasi, persiapan kompetisi KMIPN, dan uji teori CTF di bidang Cyber Security. Sesi berbasis waktu dan bersih setelah selesai.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-cyber-muted pt-2">
              <span className="flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-cyber-primary" /> Tanpa Penyimpanan Permanen
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-cyber-success" /> Evaluasi di Sisi Server
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyber-primary" /> Vercel Serverless
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cyber-text mb-3">Navigasi Mode</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/practice" className="text-cyber-muted hover:text-cyber-primary transition-colors">
                  Solo Practice
                </Link>
              </li>
              <li>
                <Link href="/team/create" className="text-cyber-muted hover:text-cyber-primary transition-colors">
                  Buat Room Baru
                </Link>
              </li>
              <li>
                <Link href="/team/join" className="text-cyber-muted hover:text-cyber-primary transition-colors">
                  Gabung Room Tim
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-cyber-muted hover:text-cyber-primary transition-colors">
                  Daftar 9 Kategori Soal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cyber-text mb-3">Ketentuan Sistem</h4>
            <ul className="space-y-2 text-sm text-cyber-muted">
              <li>Tanpa Akun Wajib</li>
              <li>Tanpa Leaderboard Permanen</li>
              <li>Timer Independen Tiap Peserta</li>
              <li>Distribusi Soal Unik Per Peserta</li>
              <li>Pembersihan Data Otomatis</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyber-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-muted">
          <p>© {new Date().getFullYear()} Cyber Security MCQ Platform. Dibangun dengan Next.js dan Supabase.</p>
          <p className="mt-2 sm:mt-0">
            Sesi sementara dan evaluasi aman.
          </p>
        </div>
      </div>
    </footer>
  );
}
