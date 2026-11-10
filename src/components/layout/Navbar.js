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
    <header className="sticky top-0 z-50 w-full border-b border-cyber-border/70 bg-cyber-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-secondary border border-cyber-border group-hover:border-cyber-electric transition-colors shadow-glow">
            <Shield className="h-5 w-5 text-cyber-electric" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-cyber-text text-lg">MCQ<span className="text-cyber-electric">Cyber</span></span>
              <span className="rounded bg-cyber-primary/20 border border-cyber-primary/40 px-1.5 py-0.5 text-[10px] font-semibold text-cyber-electric tracking-wide">
                TEMPORARY
              </span>
            </div>
            <p className="text-[11px] text-cyber-muted -mt-0.5 hidden sm:block">Platform Latihan & Simulasi Ujian Cyber Security</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyber-card text-cyber-electric border border-cyber-border'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-secondary'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/team/join"
            className="hidden sm:inline-flex items-center justify-center rounded-lg border border-cyber-border bg-cyber-secondary px-3.5 py-2 text-xs font-semibold text-cyber-text hover:bg-cyber-hover hover:border-cyber-electric/50 transition-colors"
          >
            Join Room
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center rounded-lg bg-cyber-primary px-4 py-2 text-xs font-semibold text-white shadow-glow hover:bg-cyber-electric transition-all"
          >
            Mulai Solo
          </Link>
        </div>
      </div>
    </header>
  );
}
