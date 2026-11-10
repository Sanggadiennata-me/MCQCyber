'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  PlusCircle,
  Clock,
  Layers,
  Shuffle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export default function CreateRoomPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [categoryMode, setCategoryMode] = useState('mixed'); // 'mixed', 'selected', 'random'
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [difficulty, setDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(true);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
          // Default select first 3 if in selected mode
          setSelectedCategories(data.categories.slice(0, 3).map((c) => c.slug));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const toggleCategory = (slug) => {
    if (selectedCategories.includes(slug)) {
      if (selectedCategories.length <= 1) return; // Keep at least 1
      setSelectedCategories(selectedCategories.filter((s) => s !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nickname.trim()) {
      setErrorMessage('Silakan masukkan nickname Anda sebagai Host.');
      return;
    }

    if (categoryMode === 'selected' && selectedCategories.length === 0) {
      setErrorMessage('Pilih minimal satu kategori soal untuk mode Selected Categories.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nickname: nickname.trim(),
        categoryMode,
        categories: categoryMode === 'selected' ? selectedCategories : [],
        difficulty,
        questionCount: parseInt(questionCount, 10),
        durationMinutes: parseInt(durationMinutes, 10),
        negativeMarking,
        randomizeOptions,
        randomizeQuestions: true,
      };

      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal membuat room multiplayer.');
        setSubmitting(false);
        return;
      }

      // Store credentials in sessionStorage
      sessionStorage.setItem(`room_${data.roomCode}_host_token`, data.hostToken);
      sessionStorage.setItem(`room_${data.roomCode}_participant_token`, data.participantToken);
      sessionStorage.setItem(`room_${data.roomCode}_participant_id`, data.participantId);
      sessionStorage.setItem(`room_${data.roomCode}_nickname`, nickname.trim());

      router.push(`/team/room/${data.roomCode}`);
    } catch (err) {
      console.error('Network error creating room:', err);
      setErrorMessage('Terjadi kesalahan jaringan saat membuat room.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-secondary px-3 py-1 text-xs font-semibold text-cyber-electric mb-3 shadow-glow">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Host Setup</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Team Room</h1>
        <p className="text-sm text-cyber-muted mt-1">
          Atur konfigurasi pertandingan tim sebelum membagikan Room Code kepada rekan Anda.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyber-danger/50 bg-cyber-danger/10 p-4 text-xs text-cyber-text">
          <AlertTriangle className="h-4 w-4 text-cyber-danger shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCreateRoom} className="space-y-8">
        {/* NICKNAME HOST */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <label className="block text-sm font-semibold text-white">
            Nickname Host (Anda) <span className="text-cyber-danger">*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: TeamCaptain, SecLeader"
            maxLength={25}
            required
            className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-sm text-white placeholder-cyber-darkMuted focus:border-cyber-electric focus:outline-none focus:ring-1 focus:ring-cyber-electric transition-colors"
          />
          <p className="text-[11px] text-cyber-muted">
            Anda akan bertindak sebagai Host yang memiliki wewenang untuk memulai pertandingan.
          </p>
        </div>

        {/* MODE DISTRIBUSI SOAL */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-4">
          <label className="block text-sm font-semibold text-white">Mode Distribusi Soal</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'mixed',
                title: 'Mixed Categories',
                desc: 'Setiap anggota menerima kombinasi seimbang dari semua kategori.',
              },
              {
                id: 'selected',
                title: 'Selected Categories',
                desc: 'Host memilih beberapa kategori spesifik untuk diperebutkan.',
              },
              {
                id: 'random',
                title: 'Random Distribution',
                desc: 'Sistem membagikan soal secara acak murni dari seluruh bank soal.',
              },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setCategoryMode(m.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  categoryMode === m.id
                    ? 'border-cyber-electric bg-cyber-primary/20 text-white shadow-glow'
                    : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-border/80'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{m.title}</div>
                <div className="text-[11px] text-cyber-muted leading-relaxed">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* IF SELECTED CATEGORIES, SHOW PICKER */}
          {categoryMode === 'selected' && (
            <div className="pt-4 border-t border-cyber-border/60 space-y-3">
              <label className="block text-xs font-semibold text-cyber-muted">
                Pilih Kategori untuk Pertandingan:
              </label>
              {loadingCategories ? (
                <div className="text-xs text-cyber-muted animate-pulse">Memuat kategori...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.slug);
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => toggleCategory(cat.slug)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-cyber-electric bg-cyber-primary text-white'
                            : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:bg-cyber-hover'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[10px] opacity-75">{cat.questionsCount} soal</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* JUMLAH SOAL PER PESERTA & DURASI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
            <label className="block text-sm font-semibold text-white">Soal Per Anggota</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 20, 25, 30].map((num) => (
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
            <p className="text-[10px] text-cyber-darkMuted pt-1">
              Setiap anggota menerima paket {questionCount} soal berbeda tanpa duplikasi.
            </p>
          </div>

          <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-3">
            <label className="block text-sm font-semibold text-white">Durasi Individual</label>
            <div className="grid grid-cols-3 gap-2">
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
            <p className="text-[10px] text-cyber-darkMuted pt-1">
              Timer berjalan mandiri untuk tiap anggota (server-authoritative).
            </p>
          </div>
        </div>

        {/* TINGKAT KESULITAN & NEGATIVE MARKING */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">Tingkat Kesulitan</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'mixed', label: 'Campuran' },
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    difficulty === d.id
                      ? 'border-cyber-electric bg-cyber-primary text-white shadow-glow'
                      : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:bg-cyber-hover'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-cyber-border/60 pt-4 space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-cyber-secondary border border-cyber-border/60 hover:border-cyber-border transition-colors">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-cyber-danger" />
                <div>
                  <div className="text-xs font-semibold text-white">Negative Marking</div>
                  <div className="text-[11px] text-cyber-muted">Pengurangan nilai (-15 poin) jika jawaban salah</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="h-4 w-4 rounded border-cyber-border text-cyber-primary focus:ring-0"
              />
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
            <span>Mempersiapkan Room...</span>
          ) : (
            <>
              <span>Buat Room & Masuk Lobby</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
