import Link from 'next/link';
import { getCategories } from '@/lib/questions/loader';
import {
  Shield,
  Activity,
  KeyRound,
  FileSearch,
  Terminal,
  Crosshair,
  Layers,
  Database,
  Bug,
  ArrowRight,
} from 'lucide-react';

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

export const metadata = {
  title: 'Kategori Soal - Cyber Security MCQ Platform',
  description: 'Daftar lengkap 9 kategori soal Cyber Security dengan statistik jumlah soal dan tingkat kesulitan.',
};

export default function CategoriesPage() {
  const categories = getCategories();
  const totalQuestions = categories.reduce((sum, c) => sum + (c.questionsCount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Kategori Soal</h1>
        <p className="text-base text-cyber-muted mt-2">
          Tersedia <span className="text-cyber-primary font-semibold tabular-nums">{totalQuestions} soal terverifikasi</span> dari 9 kategori utama keamanan siber, dirancang untuk persiapan ujian dan kompetisi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.slug] || Shield;
          return (
            <div
              key={cat.slug}
              className="rounded-sm border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between hover:border-cyber-primary transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cyber-secondary border border-cyber-border text-cyber-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs tabular-nums font-medium text-cyber-text bg-cyber-field px-2.5 py-1 rounded-sm border border-cyber-primary/40">
                    {cat.questionsCount} Soal
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{cat.name}</h2>
                <p className="text-xs text-cyber-muted leading-relaxed mb-6">{cat.description}</p>
              </div>

              <div>
                <div className="border-t border-cyber-border pt-4 mb-4">
                  <div className="text-xs text-cyber-muted mb-2 font-medium">
                    Tingkat Kesulitan:
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-sm bg-cyber-secondary p-2 border border-cyber-border">
                      <div className="text-cyber-success font-semibold tabular-nums">{cat.difficulties?.easy || 0}</div>
                      <div className="text-[11px] text-cyber-muted">Mudah</div>
                    </div>
                    <div className="rounded-sm bg-cyber-secondary p-2 border border-cyber-border">
                      <div className="text-cyber-accent font-semibold tabular-nums">{cat.difficulties?.medium || 0}</div>
                      <div className="text-[11px] text-cyber-muted">Sedang</div>
                    </div>
                    <div className="rounded-sm bg-cyber-secondary p-2 border border-cyber-border">
                      <div className="text-cyber-danger font-semibold tabular-nums">{cat.difficulties?.hard || 0}</div>
                      <div className="text-[11px] text-cyber-muted">Sulit</div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/practice?category=${cat.slug}`}
                  className="flex items-center justify-center gap-1.5 w-full rounded-sm bg-cyber-field border border-cyber-primary/40 py-2.5 text-xs font-semibold text-white hover:bg-cyber-primary transition-colors"
                >
                  <span>Mulai Latihan Kategori Ini</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
