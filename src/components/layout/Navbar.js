'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, User, Compass, Info } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/practice', label: 'Solo Practice', icon: User },
    { href: '/team', label: 'Team Challenge', icon: Users },
    { href: '/categories', label: 'Kategori Soal', icon: Compass },
    { href: '/about', label: 'Tentang & Aturan', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-border bg-cyber-secondary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-cyber-field text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-cyber-text text-base">
                MCQ<span className="text-cyber-primary">Cyber</span>
              </span>
              <span className="text-[11px] text-cyber-muted font-normal">
                Ujian Sementara
              </span>
            </div>
            <p className="text-[11px] text-cyber-muted -mt-0.5 hidden sm:block">
              Simulasi Ujian & Latihan Cyber Security
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyber-card text-cyber-text border-b-2 border-cyber-primary'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-card'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4 text-cyber-primary" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/team/join"
            className="hidden sm:inline-flex items-center justify-center rounded-sm border border-cyber-border bg-cyber-card px-3.5 py-1.5 text-xs font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
          >
            Gabung Room
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center rounded-sm bg-cyber-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
          >
            Mulai Solo
          </Link>
        </div>
      </div>
    </header>
  );
}
