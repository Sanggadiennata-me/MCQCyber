import Link from 'next/link';
import { Shield, Lock, Trash2, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border/60 bg-cyber-bg py-10 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyber-electric" />
              <span className="font-bold text-cyber-text text-base">Cyber Security MCQ Platform</span>
            </div>
            <p className="text-xs text-cyber-muted leading-relaxed max-w-md">
              Platform latihan, simulasi ujian sertifikasi, persiapan KMIPN, dan uji teori CTF di bidang Cyber Security. Dirancang cepat, aman, dan tanpa jejak data permanen.
            </p>
            <div className="flex items-center gap-4 text-xs text-cyber-darkMuted pt-2">
              <span className="flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-cyber-accent" /> Zero Persistent Data
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-cyber-success" /> Server-Side Evaluation
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyber-electric" /> Vercel Serverless
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-text mb-3">Navigasi Mode</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/practice" className="text-cyber-muted hover:text-cyber-electric transition-colors">
                  Solo Practice (Mandiri)
                </Link>
              </li>
              <li>
                <Link href="/team/create" className="text-cyber-muted hover:text-cyber-electric transition-colors">
                  Create Room (Host)
                </Link>
              </li>
              <li>
                <Link href="/team/join" className="text-cyber-muted hover:text-cyber-electric transition-colors">
                  Join Room (Multiplayer)
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-cyber-muted hover:text-cyber-electric transition-colors">
                  Eksplorasi 9 Kategori
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyber-text mb-3">Ketentuan Sistem</h4>
            <ul className="space-y-2 text-xs text-cyber-muted">
              <li>Tanpa Akun Wajib</li>
              <li>Tanpa Leaderboard Permanen</li>
              <li>Timer Independen Tiap Peserta</li>
              <li>Distribusi Soal Tanpa Duplikasi</li>
              <li>Pembersihan Otomatis Pasca Sesi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyber-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-darkMuted">
          <p>© {new Date().getFullYear()} Cyber Security MCQ Platform. Dirancang untuk efisiensi dan keamanan.</p>
          <p className="mt-2 sm:mt-0">
            Powered by Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
