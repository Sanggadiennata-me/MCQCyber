import Link from 'next/link';
import Image from 'next/image';
import { Shield, ExternalLink, ArrowRight } from 'lucide-react';

export default function Footer() {
  const ecosystemMembers = [
    {
      name: 'M. Aryanda Sanggadiennata',
      role: 'Developer & Security Practitioner',
      organization: 'Aryanda.my.id',
      url: 'https://aryanda.my.id/',
      image: '/assets/about/aryanda.jpeg',
      badge: 'Author',
      description: 'Pengembang platform MCQCyber, antusias keamanan siber, web security & CTF.',
    },
    {
      name: 'Itech Poliban',
      role: 'Komunitas Riset & Teknologi Mahasiswa',
      organization: 'Politeknik Negeri Banjarmasin',
      url: 'https://www.itechpoliban.com/',
      image: '/assets/about/itech.png',
      badge: 'Komunitas IT',
      description: 'Unit kegiatan mahasiswa riset pemrograman & teknologi informasi.',
    },
    {
      name: 'Komunitas Makat-Xploit',
      role: 'Cyber Security Research Group',
      organization: 'Security Research & CTF',
      url: 'https://github.com/makat-xploit',
      image: '/assets/about/makat.jpeg',
      badge: 'Riset Cyber',
      description: 'Komunitas riset keamanan informasi, eksploitasi etis & kompetisi CTF.',
    },
  ];

  return (
    <footer className="border-t border-cyber-border bg-cyber-secondary py-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* TOP ROW: BRAND & NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BRAND */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-cyber-primary/10 border border-cyber-primary/30">
                <Shield className="h-4 w-4 text-cyber-primary" />
              </div>
              <span className="font-black text-white text-lg tracking-tight font-heading">
                MCQ<span className="text-cyber-primary">Cyber</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyber-muted leading-relaxed max-w-sm">
              Platform simulasi ujian Multiple Choice Questions berbasis Cyber Security untuk persiapan sertifikasi, seleksi KMIPN, dan teori CTF. Sesi bersifat sementara dengan evaluasi di sisi server.
            </p>
          </div>

          {/* NAVIGASI MODE */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3.5 font-heading">
              Navigasi Mode
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/practice" className="text-cyber-muted hover:text-cyber-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-cyber-primary" />
                  <span>Solo Practice Mandiri</span>
                </Link>
              </li>
              <li>
                <Link href="/team/create" className="text-cyber-muted hover:text-cyber-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-cyber-primary" />
                  <span>Buat Room Team Challenge</span>
                </Link>
              </li>
              <li>
                <Link href="/team/join" className="text-cyber-muted hover:text-cyber-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-cyber-primary" />
                  <span>Gabung Room dengan Kode</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cyber-muted hover:text-cyber-primary transition-colors flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-cyber-primary" />
                  <span>Tentang & Aturan Integritas</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* KONTAK & PORTOFOLIO */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3.5 font-heading">
              Pengembang Platform
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-cyber-muted">
              <p className="leading-relaxed">
                Dirancang dan dibangun oleh <strong className="text-white font-semibold">M. Aryanda Sanggadiennata</strong> untuk kebutuhan latihan mandiri dan kompetisi tim mahasiswa.
              </p>
              <div className="pt-1">
                <a
                  href="https://aryanda.my.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyber-primary hover:text-cyber-primaryHover hover:underline"
                >
                  <span>Kunjungi Aryanda.my.id</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: TENTANG PENGEMBANG & EKOSISTEM (INTEGRATED FOOTER SIZING) */}
        <div className="border-t border-cyber-border/70 pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-cyber-primary font-heading">
                Tentang Pengembang &amp; Ekosistem
              </h4>
              <p className="text-[11px] text-cyber-muted mt-0.5">
                Didukung oleh jaringan riset teknologi dan keamanan siber Politeknik Negeri Banjarmasin.
              </p>
            </div>
            <span className="text-[10px] text-cyber-muted px-2 py-0.5 rounded-sm bg-cyber-card border border-cyber-border font-medium w-fit">
              3 Entitas Kolaborator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {ecosystemMembers.map((member) => (
              <a
                key={member.name}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-sm border border-cyber-border bg-cyber-card/60 p-3 hover:border-cyber-primary hover:bg-cyber-card transition-colors flex items-start gap-3"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-cyber-border bg-cyber-secondary">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white text-xs truncate group-hover:text-cyber-primary transition-colors font-heading">
                      {member.name}
                    </span>
                    <span className="text-[10px] text-cyber-muted px-1.5 py-0.5 rounded-sm bg-cyber-secondary border border-cyber-border font-medium shrink-0">
                      {member.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-cyber-primary font-medium truncate mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-cyber-muted line-clamp-1 mt-1 leading-snug">
                    {member.description}
                  </p>
                </div>

                <ExternalLink className="h-3.5 w-3.5 text-cyber-muted opacity-60 group-hover:opacity-100 group-hover:text-cyber-primary transition-opacity shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* BOTTOM ATTRIBUTION */}
        <div className="border-t border-cyber-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-muted gap-2">
          <p>© {new Date().getFullYear()} MCQCyber. Platform Simulasi Cyber Security.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://aryanda.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-muted hover:text-white transition-colors"
            >
              Aryanda.my.id
            </a>
            <span>•</span>
            <span className="text-cyber-muted">Politeknik Negeri Banjarmasin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}