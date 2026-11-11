import Link from 'next/link';
import {
  Shield,
  Users,
  ArrowRight,
  Database,
  Terminal,
  Activity,
  Layers,
  KeyRound,
  FileSearch,
  Crosshair,
  Bug,
} from 'lucide-react';
import { getCategories } from '@/lib/questions/loader';

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

export default function HomePage() {
  const categories = getCategories();

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="py-16 sm:py-24 border-b border-cyber-border bg-cyber-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight font-heading">
              Simulasi Ujian dan Latihan <span className="text-cyber-primary">Cyber Security</span>
            </h1>

            <p className="text-lg sm:text-xl text-cyber-muted max-w-2xl leading-relaxed">
              Platform persiapan sertifikasi, seleksi KMIPN, dan teori CTF. Mode Solo Practice mandiri atau Team Challenge 3 orang dengan distribusi soal tanpa duplikasi dan evaluasi di sisi server.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-cyber-primary px-6 py-3.5 text-sm font-bold text-cyber-ink hover:bg-cyber-primaryHover transition-colors shadow-sm"
              >
                <span>Mulai Solo Practice</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-cyber-border bg-cyber-card px-6 py-3.5 text-sm font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
              >
                <Users className="h-4 w-4 text-cyber-primary" />
                <span>Buka Team Challenge</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI PREVIEW */}
      <section className="py-20 bg-cyber-secondary border-b border-cyber-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight font-heading">9 Bidang Keamanan Siber</h2>
              <p className="text-base text-cyber-muted mt-2">
                Bank soal komprehensif disusun berdasarkan kurikulum kompetisi dan standar industri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Shield;
              return (
                <div
                  key={cat.slug}
                  className="rounded-sm border border-cyber-border bg-cyber-card p-5 hover:border-cyber-primary transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-5 w-5 text-cyber-primary" />
                    <span className="text-xs tabular-nums font-semibold text-cyber-primary px-2 py-0.5 rounded-sm bg-cyber-secondary border border-cyber-border">
                      {cat.questionsCount} Soal
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1 font-heading group-hover:text-cyber-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-cyber-muted line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
