'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Home,
  Shield,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function SoloResultPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'correct', 'incorrect', 'unanswered'

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('solo_result');
      if (!stored) {
        router.replace('/practice');
        return;
      }
      setData(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load result:', err);
      router.replace('/practice');
    }
  }, [router]);

  if (!data || !data.result) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-cyber-electric text-sm animate-pulse flex items-center gap-2">
          <Shield className="h-4 w-4 animate-spin" />
          <span>Memuat ringkasan hasil latihan...</span>
        </div>
      </div>
    );
  }

  const { nickname, result } = data;
  const {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalScore,
    maxPossibleScore,
    accuracyPercentage,
    timeTakenSeconds,
    breakdown = [],
  } = result;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;
  const timeFormatted = mins > 0 ? `${mins} menit ${secs} detik` : `${secs} detik`;

  const filteredBreakdown = breakdown.filter((item) => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'incorrect') return item.isAnswered && !item.isCorrect;
    if (filterType === 'unanswered') return !item.isAnswered;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* HEADER SCORECARD */}
      <div className="rounded-3xl border border-cyber-border bg-gradient-to-b from-cyber-card to-cyber-secondary p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="h-64 w-64 text-cyber-electric" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-success/30 bg-cyber-success/10 px-3 py-1 text-xs font-semibold text-cyber-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Simulasi Selesai</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hasil Ujian: <span className="text-cyber-electric">{nickname}</span>
          </h1>

          <div className="flex flex-wrap items-baseline gap-4 pt-2">
            <div className="text-5xl font-black text-cyber-accent tracking-tight">
              {totalScore}
              <span className="text-xs font-semibold text-cyber-muted ml-1">/ {maxPossibleScore} POIN</span>
            </div>
            <div className="h-6 w-[1px] bg-cyber-border/70 hidden sm:block" />
            <div className="text-2xl font-bold text-white">
              Akurasi: <span className="text-cyber-electric">{accuracyPercentage}%</span>
            </div>
          </div>
        </div>

        {/* STATS TILES */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-cyber-border/60">
          <div className="rounded-xl bg-cyber-bg/80 border border-cyber-border/80 p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyber-success" />
              <span>Benar</span>
            </div>
            <div className="text-2xl font-extrabold text-cyber-success">{correctCount}</div>
          </div>

          <div className="rounded-xl bg-cyber-bg/80 border border-cyber-border/80 p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <XCircle className="h-3.5 w-3.5 text-cyber-danger" />
              <span>Salah</span>
            </div>
            <div className="text-2xl font-extrabold text-cyber-danger">{incorrectCount}</div>
          </div>

          <div className="rounded-xl bg-cyber-bg/80 border border-cyber-border/80 p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <HelpCircle className="h-3.5 w-3.5 text-cyber-muted" />
              <span>Tidak Dijawab</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{unansweredCount}</div>
          </div>

          <div className="rounded-xl bg-cyber-bg/80 border border-cyber-border/80 p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <Clock className="h-3.5 w-3.5 text-cyber-electric" />
              <span>Durasi Pengerjaan</span>
            </div>
            <div className="text-sm font-bold text-white pt-1">{timeFormatted}</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6">
          <Link
            href="/practice"
            className="flex items-center gap-2 rounded-xl bg-cyber-primary px-5 py-3 text-xs font-bold text-white shadow-glow hover:bg-cyber-electric transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Mulai Latihan Baru</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-cyber-border bg-cyber-secondary px-5 py-3 text-xs font-semibold text-cyber-text hover:bg-cyber-hover transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* DETAILED QUESTION REVIEW SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-cyber-electric" />
            <h2 className="text-xl font-bold text-white">Pembahasan Teknis Soal</h2>
            <span className="text-xs text-cyber-muted">({breakdown.length} Butir)</span>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                filterType === 'all'
                  ? 'border-cyber-electric bg-cyber-primary/20 text-cyber-electric'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:text-white'
              }`}
            >
              Semua ({breakdown.length})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                filterType === 'correct'
                  ? 'border-cyber-success bg-cyber-success/20 text-cyber-success'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:text-white'
              }`}
            >
              Benar ({correctCount})
            </button>
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                filterType === 'incorrect'
                  ? 'border-cyber-danger bg-cyber-danger/20 text-cyber-danger'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:text-white'
              }`}
            >
              Salah ({incorrectCount})
            </button>
            <button
              onClick={() => setFilterType('unanswered')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                filterType === 'unanswered'
                  ? 'border-cyber-darkMuted bg-cyber-secondary text-white'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:text-white'
              }`}
            >
              Kosong ({unansweredCount})
            </button>
          </div>
        </div>

        {/* LIST OF QUESTIONS */}
        <div className="space-y-6">
          {filteredBreakdown.map((item, idx) => {
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-7 space-y-4"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-cyber-border/40">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyber-electric">{item.id}</span>
                    <span className="text-cyber-muted">•</span>
                    <span className="text-cyber-muted">{item.category}</span>
                  </div>

                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 font-bold text-cyber-success bg-cyber-success/10 border border-cyber-success/30 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Benar (+{item.pointsEarned} poin)
                    </span>
                  ) : item.isAnswered ? (
                    <span className="flex items-center gap-1 font-bold text-cyber-danger bg-cyber-danger/10 border border-cyber-danger/30 px-2.5 py-0.5 rounded-full">
                      <XCircle className="h-3.5 w-3.5" /> Salah ({item.pointsEarned} poin)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-cyber-darkMuted bg-cyber-secondary px-2.5 py-0.5 rounded-full border border-cyber-border">
                      Tidak Dijawab (0 poin)
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {item.question}
                </h3>

                {/* OPTIONS LIST */}
                <div className="space-y-2 pt-1">
                  {item.options.map((opt) => {
                    const isChosen = item.selectedOption === opt.id;
                    const isRight = item.correctOption === opt.id;

                    let badgeClass = 'border-cyber-border bg-cyber-secondary/60 text-cyber-muted';
                    if (isRight) {
                      badgeClass = 'border-cyber-success bg-cyber-success/15 text-white font-medium';
                    } else if (isChosen && !isRight) {
                      badgeClass = 'border-cyber-danger bg-cyber-danger/15 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed transition-colors ${badgeClass}`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-bold text-[11px] ${
                            isRight
                              ? 'bg-cyber-success text-black'
                              : isChosen
                              ? 'bg-cyber-danger text-white'
                              : 'bg-cyber-hover text-cyber-muted border border-cyber-border'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1 pt-0.5">{opt.text}</span>
                        {isRight && (
                          <span className="text-[10px] uppercase font-bold text-cyber-success shrink-0 pt-0.5">
                            Kunci Jawaban
                          </span>
                        )}
                        {isChosen && !isRight && (
                          <span className="text-[10px] uppercase font-bold text-cyber-danger shrink-0 pt-0.5">
                            Jawaban Anda
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* EXPLANATION ACCORDION / BOX */}
                <div className="rounded-xl bg-cyber-secondary/90 border border-cyber-border/70 p-4 space-y-1.5 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyber-accent">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Pembahasan Teknis:</span>
                  </div>
                  <p className="text-xs text-cyber-text leading-relaxed pl-5">
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
