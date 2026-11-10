'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Zap,
  Sliders,
  Clock,
  Layers,
  HelpCircle,
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

          // If category preselected in query param
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

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-secondary px-3 py-1 text-xs font-semibold text-cyber-electric mb-3 shadow-glow">
          <Zap className="h-3.5 w-3.5" />
          <span>Solo Practice Mode</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Konfigurasi Latihan Mandiri</h1>
        <p className="text-sm text-cyber-muted mt-1">
          Sesuaikan materi, durasi pengerjaan, dan tingkat kesulitan sebelum memulai simulasi.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyber-danger/50 bg-cyber-danger/10 p-4 text-xs text-cyber-text">
          <AlertTriangle className="h-4 w-4 text-cyber-danger shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleStartPractice} className="space-y-8">
        {/* NICKNAME */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <label className="block text-sm font-semibold text-white">
            Nickname Peserta <span className="text-cyber-danger">*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: cyber_ninja, rev_hacker"
            maxLength={25}
            required
            className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-sm text-white placeholder-cyber-darkMuted focus:border-cyber-electric focus:outline-none focus:ring-1 focus:ring-cyber-electric transition-colors"
          />
          <p className="text-[11px] text-cyber-muted">
            Nickname hanya digunakan selama sesi berlangsung dan tidak disimpan secara permanen.
          </p>
        </div>

        {/* KATEGORI SOAL */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-white">Pilih Kategori Soal</label>
            <span className="text-xs text-cyber-muted">
              {selectedCategories.includes('all') ? 'Semua Kategori' : `${selectedCategories.length} Dipilih`}
            </span>
          </div>

          {loadingCategories ? (
            <div className="py-6 text-center text-xs text-cyber-muted animate-pulse">
              Memuat kategori soal...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => toggleCategory('all')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  selectedCategories.includes('all')
                    ? 'border-cyber-electric bg-cyber-primary/20 text-white shadow-glow'
                    : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-border/80'
                }`}
              >
                <span>Semua Kategori (Campuran)</span>
                <span className="text-[11px] opacity-75">108 Soal</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => toggleCategory(cat.slug)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-cyber-electric bg-cyber-primary/20 text-white shadow-glow'
                        : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-border/80'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[11px] opacity-75 shrink-0">{cat.questionsCount}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* TINGKAT KESULITAN & JUMLAH SOAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
            <label className="block text-sm font-semibold text-white">Tingkat Kesulitan</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mixed', label: 'Campuran' },
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDifficulty(item.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    difficulty === item.id
                      ? 'border-cyber-electric bg-cyber-primary text-white shadow-glow'
                      : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:bg-cyber-hover'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
            <label className="block text-sm font-semibold text-white">Jumlah Soal</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 20, 30, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    questionCount === num
                      ? 'border-cyber-electric bg-cyber-primary text-white shadow-glow'
                      : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:bg-cyber-hover'
                  }`}
                >
                  {num} Soal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DURASI PENGERJAAN */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-white">Durasi Pengerjaan</label>
            <span className="text-xs text-cyber-electric font-semibold">{durationMinutes} Menit</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[5, 10, 15, 20, 30, 45].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMinutes(mins)}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  durationMinutes === mins
                    ? 'border-cyber-electric bg-cyber-primary text-white shadow-glow'
                    : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:bg-cyber-hover'
                }`}
              >
                {mins} mnt
              </button>
            ))}
          </div>
        </div>

        {/* OPSIONAL TOGGLES */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Opsi Tambahan</h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-cyber-secondary border border-cyber-border/60 hover:border-cyber-border transition-colors">
              <div className="flex items-center gap-3">
                <Shuffle className="h-4 w-4 text-cyber-electric" />
                <div>
                  <div className="text-xs font-semibold text-white">Acak Urutan Soal</div>
                  <div className="text-[11px] text-cyber-muted">Soal disajikan dalam urutan acak</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="h-4 w-4 rounded border-cyber-border text-cyber-primary focus:ring-0"
              >
              </input>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-cyber-secondary border border-cyber-border/60 hover:border-cyber-border transition-colors">
              <div className="flex items-center gap-3">
                <Shuffle className="h-4 w-4 text-cyber-electric" />
                <div>
                  <div className="text-xs font-semibold text-white">Acak Pilihan Jawaban</div>
                  <div className="text-[11px] text-cyber-muted">Opsi A, B, C, D diacak per butir soal</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={randomizeOptions}
                onChange={(e) => setRandomizeOptions(e.target.checked)}
                className="h-4 w-4 rounded border-cyber-border text-cyber-primary focus:ring-0"
              >
              </input>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-cyber-secondary border border-cyber-border/60 hover:border-cyber-border transition-colors">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-cyber-danger" />
                <div>
                  <div className="text-xs font-semibold text-white">Negative Marking (Pengurangan Nilai)</div>
                  <div className="text-[11px] text-cyber-muted">Benar: +50 poin, Salah: -15 poin (Default: nonaktif)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="h-4 w-4 rounded border-cyber-border text-cyber-primary focus:ring-0"
              >
              </input>
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyber-primary py-4 text-sm font-bold text-white shadow-glow hover:bg-cyber-electric transition-all disabled:opacity-50"
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
          <div className="text-cyber-electric text-sm animate-pulse">Memuat konfigurasi latihan...</div>
        </div>
      }
    >
      <PracticeForm />
    </Suspense>
  );
}
