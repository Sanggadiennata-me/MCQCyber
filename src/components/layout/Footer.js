import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border bg-cyber-secondary py-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* BRAND */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyber-primary" />
              <span className="font-bold text-cyber-text text-base">MCQCyber</span>
            </div>
            <p className="text-sm text-cyber-muted leading-relaxed max-w-sm">
              Platform simulasi ujian Multiple Choice Questions berbasis Cyber Security untuk latihan mandiri dan kompetisi tim.
            </p>
          </div>

          {/* NAVIGASI MODE */}
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
                <Link href="/about" className="text-cyber-muted hover:text-cyber-primary transition-colors">
                  Tentang & Aturan
                </Link>
              </li>
            </ul>
          </div>

          {/* TENTANG PENGEMBANG */}
          <div>
            <h4 className="text-sm font-semibold text-cyber-text mb-3">Tentang Pengembang</h4>
            <div className="space-y-2 text-sm text-cyber-muted">
              <p>
                Dikembangkan oleh <strong className="text-white">M. Aryanda Sanggadiennata</strong> bersama ekosistem riset keamanan siber.
              </p>
              <div className="pt-1">
                <a
                  href="https://aryanda.my.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-primary hover:underline"
                >
                  <span>Aryanda.my.id</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cyber-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-muted">
          <p>© {new Date().getFullYear()} MCQCyber. All rights reserved.</p>
          <a
            href="https://aryanda.my.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors mt-2 sm:mt-0"
          >
            Developed by Aryanda
          </a>
        </div>
      </div>
    </footer>
  );
}
