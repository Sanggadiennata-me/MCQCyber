import Link from 'next/link';
import Image from 'next/image';
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
  ExternalLink,
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

  const ecosystemMembers = [
    {
      name: 'M. Aryanda Sanggadiennata',
      role: 'Developer & Cyber Security Practitioner',
      organization: 'Aryanda.my.id',
      description: 'Pengembang platform MCQCyber, antusias keamanan siber, web security, dan peserta simulasi CTF/KMIPN.',
      url: 'https://aryanda.my.id/',
      image: '/assets/about/aryanda.jpeg',
      badge: 'Author',
    },
    {
      name: 'Itech Poliban',
      role: 'Komunitas Riset & Teknologi Mahasiswa',
      organization: 'Politeknik Negeri Banjarmasin',
      description: 'Unit kegiatan mahasiswa di Poliban yang berfokus pada pengembangan software, pemrograman, dan riset teknologi informasi.',
      url: 'https://www.itechpoliban.com/',
      image: '/assets/about/itech.png',
      badge: 'Komunitas IT',
    },
    {
      name: 'Komunitas Makat-Xploit',
      role: 'Cyber Security Research Group',
      organization: 'Security Research & CTF',
      description: 'Komunitas riset keamanan informasi, eksploitasi etis, penetration testing, serta persiapan kompetisi Capture The Flag.',
      url: 'https://github.com/makat-xploit',
      image: '/assets/about/makat.jpeg',
      badge: 'Riset Cyber',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="py-16 sm:py-24 border-b border-cyber-border bg-cyber-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Simulasi Ujian dan Latihan <span className="text-cyber-primary">Cyber Security</span>
            </h1>

            <p className="text-lg sm:text-xl text-cyber-muted max-w-2xl leading-relaxed">
              Platform persiapan sertifikasi, seleksi KMIPN, dan teori CTF. Mode Solo Practice mandiri atau Team Challenge 3 orang dengan distribusi soal tanpa duplikasi dan evaluasi di sisi server.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-cyber-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
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
              <h2 className="text-3xl font-bold text-white tracking-tight">9 Bidang Keamanan Siber</h2>
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
                  className="rounded-sm border border-cyber-border bg-cyber-card p-5 hover:border-cyber-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-5 w-5 text-cyber-primary" />
                    <span className="text-xs tabular-nums font-medium text-cyber-muted px-2 py-0.5 rounded-sm bg-cyber-secondary border border-cyber-border">
                      {cat.questionsCount} Soal
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{cat.name}</h3>
                  <p className="text-xs text-cyber-muted line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TENTANG PENGEMBANG & EKOSISTEM */}
      <section className="py-20 bg-cyber-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Tentang Pengembang & Ekosistem</h2>
            <p className="text-base text-cyber-muted mt-2">
              Proyek ini dibangun oleh M. Aryanda Sanggadiennata didukung oleh ekosistem riset keamanan siber dan teknologi informasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecosystemMembers.map((member) => (
              <a
                key={member.name}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-sm border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between hover:border-cyber-primary transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="relative h-14 w-14 overflow-hidden rounded-sm border border-cyber-border bg-cyber-secondary">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <span className="text-xs text-cyber-muted font-medium px-2 py-0.5 rounded-sm bg-cyber-secondary border border-cyber-border">
                      {member.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyber-primary transition-colors flex items-center gap-2">
                      <span>{member.name}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                    </h3>
                    <p className="text-xs text-cyber-primary mt-0.5">{member.role}</p>
                    <p className="text-xs text-cyber-muted mt-2.5 leading-relaxed">{member.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-border/80 mt-6 flex items-center justify-between text-xs text-cyber-muted group-hover:text-white transition-colors">
                  <span>Kunjungi Profil / Website</span>
                  <ArrowRight className="h-3.5 w-3.5 text-cyber-primary" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
