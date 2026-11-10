# Cyber Security MCQ Platform

**Cyber Security MCQ Platform** adalah aplikasi web modern berbasis Multiple Choice Questions (MCQ) yang dirancang khusus untuk persiapan sertifikasi keamanan informasi, penyisihan kompetisi KMIPN bidang Cyber Security, latihan teori CTF (Capture The Flag), dan pembelajaran mandiri.

Aplikasi ini mengusung **Prinsip Utama: Data Bersifat Sementara (Temporary)**. Tidak ada sistem registrasi akun wajib, tidak ada penyimpanan histori permanen, dan tidak ada leaderboard permanen. Semua data pertandingan multiplayer dibersihkan setelah selesai.

---

## Fitur Utama

### 1. Solo Practice (Latihan Mandiri)
- **Tanpa Akun:** Cukup masukkan nickname dan langsung mulai latihan.
- **Konfigurasi Fleksibel:** Filter berdasarkan 9 kategori soal, 4 level kesulitan (*Easy, Medium, Hard, Mixed*), jumlah soal (5–50 butir), dan durasi (5–60 menit).
- **Pengaturan Tambahan:** Acak urutan soal, acak pilihan opsi jawaban, serta opsi *Negative Marking* (+50 poin benar, -15 poin salah).
- **Navigasi Soal Intuitif:** Satu soal per tampilan, tombol Previous/Next, grid nomor soal dengan indikator status terjawab/belum, dan hitung mundur timer.
- **Pembahasan Lengkap:** Segera setelah submit, peserta mendapatkan rekap nilai, akurasi, waktu pengerjaan, dan pembahasan teknis mendalam untuk setiap butir soal.

### 2. Team Challenge (Multiplayer 2–3 Peserta)
- **Mekanisme Room Code:** Host membuat room dengan kode unik 6-karakter acak yang sulit ditebak. Rekan tim bergabung menggunakan kode tersebut.
- **Distribusi Soal Tanpa Duplikasi:** Setiap anggota tim mendapatkan paket soal unik yang berbeda dari anggota lain. Tidak ada peserta yang mengerjakan soal yang sama secara bersamaan.
- **Timer Individual (*Server-Authoritative*):** Timer berjalan mandiri untuk tiap peserta berdasarkan `expires_at` di database. Jika Player 1 selesai lebih cepat, statusnya berubah menjadi selesai tanpa menghentikan timer Player 2 dan 3.
- **Tahan Refresh Browser:** Timer dan progres jawaban tersimpan di server. Me-refresh browser memulihkan sisa waktu dan jawaban yang telah dipilih.
- **Akumulasi Skor Tim:** Nilai akhir tim dihitung dari penjumlahan nilai masing-masing peserta:
  $$\text{Team Score} = \text{Player 1 Score} + \text{Player 2 Score} + \text{Player 3 Score}$$
- **Sinkronisasi Realtime:** Didukung oleh Supabase Realtime dengan fallback polling otomatis.
- **Pembersihan Otomatis:** Room dan seluruh data peserta otomatis dibersihkan setelah sesi selesai atau melewati batas retensi.

---

## Teknologi yang Digunakan

- **Framework:** Next.js 14 (App Router)
- **Bahasa Pemrograman:** JavaScript murni (*No TypeScript*)
- **Styling:** Tailwind CSS (Palet tema gelap futuristik Cyber Security)
- **Database & Realtime:** Supabase PostgreSQL & Supabase Realtime
- **Question Bank:** Static JSON files di direktori `questions/`
- **Hosting & Cron:** Vercel & Vercel Cron
- **Package Manager:** npm

---

## Struktur Direktori

```text
MCQCyber/
├── questions/                  # Bank soal statis berbasis JSON
│   ├── web-security/
│   ├── network-security/
│   ├── cryptography/
│   ├── digital-forensics/
│   ├── linux-system/
│   ├── malware-analysis/
│   ├── penetration-testing/
│   ├── blue-team-soc/
│   └── general-cybersecurity/
├── src/
│   ├── app/                    # Next.js App Router (Pages & API Handlers)
│   │   ├── page.js             # Landing page
│   │   ├── layout.js           # Root layout
│   │   ├── categories/         # Halaman penjelajah kategori
│   │   ├── about/              # Halaman aturan & arsitektur sistem
│   │   ├── practice/           # Halaman konfigurasi Solo Practice
│   │   │   ├── quiz/           # Antarmuka ujian Solo Practice
│   │   │   └── result/         # Hasil ujian & pembahasan teknis Solo
│   │   ├── team/               # Menu Team Challenge
│   │   │   ├── create/         # Halaman Create Room (Host)
│   │   │   ├── join/           # Halaman Join Room (Peserta)
│   │   │   ├── room/[code]/    # Lobby multiplayer dengan Supabase Realtime
│   │   │   ├── quiz/[code]/    # Antarmuka ujian Team Challenge
│   │   │   └── result/[code]/  # Hasil akumulasi tim & pembahasan
│   │   └── api/                # REST API Route Handlers
│   │       ├── categories/     # Katalog kategori soal
│   │       ├── practice/       # Start & Submit Solo Practice
│   │       ├── rooms/          # Create, Join, Start, Results, Cleanup
│   │       └── quiz/           # Data kuis & Submit individual
│   ├── components/             # Reusable UI & Layout Components
│   │   └── layout/             # Navbar, Footer
│   ├── lib/
│   │   ├── questions/          # Loader, validator, filter & answer stripper
│   │   ├── scoring/            # Server-authoritative scoring engine
│   │   ├── room/               # Distributor soal non-duplikasi tim
│   │   ├── security/           # Token generation, SHA-256 hashing, sanitasi
│   │   └── supabase/           # Client, Server, & Admin Supabase SDK
│   └── hooks/
├── supabase/
│   └── migrations/
│       └── initial_schema.sql  # Skema tabel rooms, participants, RLS, & stored procedure
├── tests/                      # Unit testing (Node.js test runner)
├── vercel.json                 # Konfigurasi Vercel Cron untuk pembersihan otomatis
└── README.md
```

---

## Panduan Instalasi & Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js versi 18.17 atau lebih baru
- Akun gratis di [Supabase](https://supabase.com)

### 2. Kloning & Instalasi Dependensi
```bash
cd /home/r3x/Documents/project/MCQCyber
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi nilainya dari dashboard proyek Supabase Anda (**Project Settings ➔ API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Catatan Keamanan:** `SUPABASE_SERVICE_ROLE_KEY` hanya diakses di sisi server (API route handlers) dan tidak pernah dikirim ke browser client.

### 4. Setup Database Supabase
1. Masuk ke dashboard proyek Supabase Anda.
2. Buka menu **SQL Editor**.
3. Buka file `supabase/migrations/initial_schema.sql`, salin seluruh kodenya, dan jalankan (*Run*) di SQL Editor Supabase.
4. Skema akan secara otomatis:
   - Membuat tabel `rooms` dan `room_participants`.
   - Mengaktifkan `ON DELETE CASCADE` sehingga penghapusan room langsung membersihkan seluruh peserta.
   - Mengaktifkan publikasi **Supabase Realtime**.
   - Mengonfigurasi **Row Level Security (RLS)**.
   - Membuat stored procedure `cleanup_stale_rooms()`.

### 5. Menjalankan Aplikasi
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## Menjalankan Unit Testing

Aplikasi dilengkapi pengujian unit otomatis menggunakan runner bawaan Node.js (`node --test`) untuk memastikan integritas bank soal, fungsi *answer stripping*, kalkulasi penilaian, dan distribusi tanpa duplikasi:

```bash
npm test
```

---

## Cara Menambahkan Bank Soal Baru

Soal dikelola dalam bentuk file JSON statis di dalam folder `questions/<nama-kategori>/questions.json`.

Format struktur JSON:
```json
{
  "category": "Web Security",
  "slug": "web-security",
  "description": "Deskripsi singkat materi",
  "questions": [
    {
      "id": "WEB-013",
      "difficulty": "medium",
      "question": "Pertanyaan soal keamanan siber?",
      "options": [
        { "id": "A", "text": "Pilihan A" },
        { "id": "B", "text": "Pilihan B" },
        { "id": "C", "text": "Pilihan C" },
        { "id": "D", "text": "Pilihan D" }
      ],
      "answer": "A",
      "explanation": "Penjelasan teknis mengapa A benar dan konteks keamanannya."
    }
  ]
}
```

**Ketentuan Soal:**
- Setiap soal wajib memiliki `id` unik.
- `difficulty`: `easy`, `medium`, atau `hard`.
- Minimal 4 pilihan jawaban (`A`, `B`, `C`, `D`).
- `answer` bernilai satu opsi benar (`A`, `B`, `C`, atau `D`).
- `explanation` penjelasan teknis mendalam.

---

## Arsitektur Keamanan & Sesi Sementara

1. **Answer Stripping (Zero Client-Side Keys):**
   Fungsi `stripAnswers()` di `src/lib/questions/loader.js` menghapus properti `answer` dan `explanation` dari payload JSON sebelum dikirim ke frontend. Pengguna tidak dapat mengintip jawaban melalui DevTools Network/Inspect element.
2. **Server-Side Scoring:**
   Skor dihitung 100% oleh backend melalui `src/lib/scoring/evaluator.js`. Klien hanya mengirimkan opsi yang dipilih (`{ "WEB-001": "A" }`).
3. **Server-Authoritative Timer:**
   Batas waktu berakhir dihitung berdasarkan timestamp server (`expires_at`). Jawaban yang dikirimkan setelah batas waktu kedaluwarsa (+ grace period toleransi jaringan 5 detik) tidak akan diterima oleh server.
4. **Token Security:**
   Host token dan participant token dibuat menggunakan *cryptographically strong pseudo-random bytes* (32 byte) dan disimpan dalam bentuk hash SHA-256 (`host_token_hash`, `participant_token_hash`) di database.
5. **Scheduled Cleanup:**
   File `vercel.json` mengonfigurasi cron job berkala yang memanggil endpoint `/api/rooms/cleanup` setiap 30 menit untuk menghapus room yang kedaluwarsa atau pertandingan yang telah selesai.

---

## Deployment ke Vercel

Aplikasi 100% kompatibel dengan arsitektur serverless Vercel:

1. Push repository ke GitHub.
2. Impor proyek di dashboard [Vercel](https://vercel.com).
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**.
5. Vercel Cron akan otomatis terdaftar sesuai konfigurasi di `vercel.json`.

---

© 2026 Cyber Security MCQ Platform. Dirancang untuk keandalan, privasi, dan keunggulan teknis.
