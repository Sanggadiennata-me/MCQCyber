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
  title: 'Kategori Soal — Cyber Security MCQ Platform',
  description: 'Daftar lengkap 9 kategori soal Cyber Security dengan statistik jumlah soal dan tingkat kesulitan.',
};

export default function CategoriesPage() {
  const categories = getCategories();
  const totalQuestions = categories.reduce((sum, c) => sum + c.questionsCount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Eksplorasi Kategori Soal</h1>
        <p className="text-sm text-cyber-muted mt-2">
          Total <span className="text-cyber-electric font-semibold">{totalQuestions} soal terkurasi</span> mencakup 9 domain inti keamanan siber dari tingkat Easy, Medium, hingga Hard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.slug] || Shield;
          return (
            <div
              key={cat.slug}
              className="rounded-2xl border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between hover:border-cyber-electric/50 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-secondary border border-cyber-border text-cyber-electric">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-cyber-electric bg-cyber-primary/10 border border-cyber-primary/30 px-3 py-1 rounded-full">
                    {cat.questionsCount} Soal
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{cat.name}</h2>
                <p className="text-xs text-cyber-muted leading-relaxed mb-6">{cat.description}</p>
              </div>

              <div>
                <div className="border-t border-cyber-border/60 pt-4 mb-4">
                  <div className="text-[11px] font-semibold text-cyber-darkMuted uppercase tracking-wider mb-2">
                    Distribusi Kesulitan:
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded bg-cyber-secondary p-1.5 border border-cyber-border/40">
                      <div className="text-cyber-success font-semibold">{cat.difficulties?.easy || 0}</div>
                      <div className="text-[10px] text-cyber-darkMuted">Easy</div>
                    </div>
                    <div className="rounded bg-cyber-secondary p-1.5 border border-cyber-border/40">
                      <div className="text-cyber-accent font-semibold">{cat.difficulties?.medium || 0}</div>
                      <div className="text-[10px] text-cyber-darkMuted">Medium</div>
                    </div>
                    <div className="rounded bg-cyber-secondary p-1.5 border border-cyber-border/40">
                      <div className="text-cyber-danger font-semibold">{cat.difficulties?.hard || 0}</div>
                      <div className="text-[10px] text-cyber-darkMuted">Hard</div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/practice?category=${cat.slug}`}
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-cyber-secondary border border-cyber-border py-2.5 text-xs font-semibold text-cyber-text hover:bg-cyber-primary hover:text-white transition-all"
                >
                  <span>Latihan Kategori Ini</span>
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
