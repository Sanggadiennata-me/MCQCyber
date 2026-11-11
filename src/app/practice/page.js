'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Zap,
  Clock,
  Layers,
  AlertTriangle,
  ArrowRight,
  Shuffle,
  ShieldAlert,
} from 'lucide-react';

function PracticeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form states
  const [nickname, setNickname] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [difficulty, setDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);

          const preselected = searchParams.get('category');
          if (preselected && data.categories.some((c) => c.slug === preselected)) {
            setSelectedCategories([preselected]);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [searchParams]);

  const toggleCategory = (slug) => {
    if (slug === 'all') {
      setSelectedCategories(['all']);
      return;
    }

    let updated = selectedCategories.filter((s) => s !== 'all');
    if (updated.includes(slug)) {
      updated = updated.filter((s) => s !== slug);
      if (updated.length === 0) updated = ['all'];
    } else {
      updated.push(slug);
    }
    setSelectedCategories(updated);
  };

  const handleStartPractice = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nickname.trim()) {
      setErrorMessage('Silakan masukkan nickname Anda terlebih dahulu.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nickname: nickname.trim(),
        categories: selectedCategories.includes('all') ? [] : selectedCategories,
        difficulty,
        questionCount: parseInt(questionCount, 10),
        durationMinutes: parseInt(durationMinutes, 10),
        randomizeQuestions,
        randomizeOptions,
        negativeMarking,
      };

      const res = await fetch('/api/practice/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal memulai sesi latihan.');
        setSubmitting(false);
        return;
      }

      // Store temporary session data in sessionStorage
      sessionStorage.setItem('solo_session', JSON.stringify(data.session));
      sessionStorage.setItem('solo_questions', JSON.stringify(data.questions));
      sessionStorage.setItem('solo_answers', JSON.stringify({}));

      router.push('/practice/quiz');
    } catch (err) {
      console.error('Error starting practice:', err);
      setErrorMessage('Terjadi kesalahan jaringan saat memulai latihan.');
      setSubmitting(false);
    }
  };

  const totalAvailable = categories.reduce((sum, c) => sum + (c.questionsCount || 0), 0);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Konfigurasi Solo Practice</h1>
        <p className="text-sm text-cyber-muted mt-2">
          Pilih materi ujian, batas waktu, dan tingkat kesulitan sebelum memulai simulasi mandiri.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-sm border border-cyber-danger bg-cyber-field p-4 text-xs text-cyber-text">
          <AlertTriangle className="h-4 w-4 text-cyber-danger shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleStartPractice} className="space-y-6">
        {/* NICKNAME */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
          <label className="block text-sm font-semibold text-white">
            Nickname Peserta <span className="text-cyber-primary">*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: cyber_ninja, rev_hacker"
            maxLength={25}
            required
            className="w-full rounded-sm border border-cyber-border bg-cyber-bg px-4 py-3 text-sm text-white placeholder-cyber-muted focus:border-cyber-primary focus:outline-none transition-colors"
          />
          <p className="text-xs text-cyber-muted">
            Nickname hanya digunakan selama sesi berlangsung dan tidak disimpan permanen.
          </p>
        </div>

        {/* KATEGORI SOAL */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-white">Kategori Materi</label>
            <span className="text-xs text-cyber-muted">
              {selectedCategories.includes('all') ? 'Semua Kategori' : `${selectedCategories.length} Kategori Terpilih`}
            </span>
          </div>

          {loadingCategories ? (
            <div className="py-6 text-center text-xs text-cyber-muted">
              Memuat data kategori...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => toggleCategory('all')}
                className={`flex items-center justify-between p-3 rounded-sm border text-left text-xs font-medium transition-colors ${
                  selectedCategories.includes('all')
                    ? 'border-cyber-primary bg-cyber-field text-white'
                    : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
                }`}
              >
                <span>Semua Kategori (Campuran)</span>
                <span className="text-xs tabular-nums opacity-80">{totalAvailable} Soal</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => toggleCategory(cat.slug)}
                    className={`flex items-center justify-between p-3 rounded-sm border text-left text-xs font-medium transition-colors ${
                      isSelected
                        ? 'border-cyber-primary bg-cyber-field text-white'
                        : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-xs tabular-nums opacity-80 shrink-0">{cat.questionsCount}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* TINGKAT KESULITAN & JUMLAH SOAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
            <label className="block text-sm font-semibold text-white">Tingkat Kesulitan</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mixed', label: 'Campuran' },
                { id: 'easy', label: 'Mudah' },
                { id: 'medium', label: 'Sedang' },
                { id: 'hard', label: 'Sulit' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDifficulty(item.id)}
                  className={`py-2 px-3 rounded-sm border text-xs font-semibold transition-colors ${
                    difficulty === item.id
                      ? 'border-cyber-primary bg-cyber-primary text-cyber-ink font-bold'
                      : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
            <label className="block text-sm font-semibold text-white">Jumlah Butir Soal</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20, 30, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 px-2 rounded-sm border text-xs font-semibold tabular-nums transition-colors ${
                    questionCount === num
                      ? 'border-cyber-primary bg-cyber-primary text-cyber-ink font-bold'
                      : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
                  }`}
                >
                  {num} Soal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DURASI PENGERJAAN */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-white">Durasi Pengerjaan</label>
            <span className="text-xs tabular-nums text-cyber-primary font-semibold">{durationMinutes} Menit</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[5, 15, 30, 45, 60, 100].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMinutes(mins)}
                className={`py-2 px-2 rounded-sm border text-xs font-semibold tabular-nums transition-colors ${
                  durationMinutes === mins
                    ? 'border-cyber-primary bg-cyber-primary text-cyber-ink font-bold'
                    : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
                }`}
              >
                {mins} mnt
              </button>
            ))}
          </div>
        </div>

        {/* OPSI TAMBAHAN */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Opsi Tambahan</h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border hover:border-cyber-primary/60 transition-colors">
              <div className="flex items-center gap-3">
                <Shuffle className="h-4 w-4 text-cyber-primary" />
                <div>
                  <div className="text-xs font-semibold text-white">Acak Urutan Soal</div>
                  <div className="text-[11px] text-cyber-muted">Soal disajikan dalam urutan acak setiap sesi</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="h-4 w-4 rounded-sm border-cyber-border accent-cyber-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border hover:border-cyber-primary/60 transition-colors">
              <div className="flex items-center gap-3">
                <Shuffle className="h-4 w-4 text-cyber-primary" />
                <div>
                  <div className="text-xs font-semibold text-white">Acak Pilihan Jawaban</div>
                  <div className="text-[11px] text-cyber-muted">Urutan opsi A, B, C, D diacak per butir soal</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={randomizeOptions}
                onChange={(e) => setRandomizeOptions(e.target.checked)}
                className="h-4 w-4 rounded-sm border-cyber-border accent-cyber-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border hover:border-cyber-primary/60 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-cyber-primary" />
                <div>
                  <div className="text-xs font-semibold text-white">Pengurangan Nilai (Negative Marking)</div>
                  <div className="text-[11px] text-cyber-muted">Benar: +50 poin, Salah: -15 poin, Kosong: 0 poin</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="h-4 w-4 rounded-sm border-cyber-border accent-cyber-primary"
              />
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-sm bg-cyber-primary py-3.5 text-sm font-bold text-cyber-ink hover:bg-cyber-primaryHover transition-colors disabled:opacity-50 shadow-sm"
        >
          {submitting ? (
            <span>Mempersiapkan Soal...</span>
          ) : (
            <>
              <span>Mulai Ujian Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function PracticeConfigurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-cyber-muted text-sm">Memuat konfigurasi latihan...</div>
        </div>
      }
    >
      <PracticeForm />
    </Suspense>
  );
}
