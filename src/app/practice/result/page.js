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
} from 'lucide-react';

export default function SoloResultPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState('all');

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
        <div className="text-cyber-muted text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyber-primary" />
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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      {/* HEADER SCORECARD */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-4">
          <div className="text-xs font-semibold text-cyber-primary">
            Evaluasi Selesai
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Hasil Ujian: <span className="text-cyber-primary">{nickname}</span>
          </h1>

          <div className="flex flex-wrap items-baseline gap-6 pt-2">
            <div className="text-5xl font-black text-white font-mono tabular-nums tracking-tight">
              {totalScore}
              <span className="text-xs font-medium text-cyber-muted ml-2">/ {maxPossibleScore} POIN</span>
            </div>
            <div className="text-2xl font-bold text-cyber-muted font-mono tabular-nums">
              Akurasi: <span className="text-white">{accuracyPercentage}%</span>
            </div>
          </div>
        </div>

        {/* STATS TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cyber-border">
          <div className="rounded-sm bg-cyber-secondary border border-cyber-border p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyber-success" />
              <span>Benar</span>
            </div>
            <div className="text-2xl font-bold text-cyber-success font-mono tabular-nums">{correctCount}</div>
          </div>

          <div className="rounded-sm bg-cyber-secondary border border-cyber-border p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <XCircle className="h-3.5 w-3.5 text-cyber-danger" />
              <span>Salah</span>
            </div>
            <div className="text-2xl font-bold text-cyber-danger font-mono tabular-nums">{incorrectCount}</div>
          </div>

          <div className="rounded-sm bg-cyber-secondary border border-cyber-border p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <HelpCircle className="h-3.5 w-3.5 text-cyber-muted" />
              <span>Tidak Dijawab</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{unansweredCount}</div>
          </div>

          <div className="rounded-sm bg-cyber-secondary border border-cyber-border p-4">
            <div className="flex items-center gap-2 text-xs text-cyber-muted mb-1">
              <Clock className="h-3.5 w-3.5 text-cyber-primary" />
              <span>Waktu Pengerjaan</span>
            </div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums pt-1">{timeFormatted}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-cyber-border">
          <Link
            href="/practice"
            className="flex items-center gap-2 rounded-sm bg-cyber-primary px-5 py-2.5 text-xs font-bold text-cyber-ink hover:bg-cyber-primaryHover transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Mulai Sesi Baru</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm border border-cyber-border bg-cyber-secondary px-5 py-2.5 text-xs font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
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
            <BookOpen className="h-5 w-5 text-cyber-primary" />
            <h2 className="text-xl font-bold text-white">Pembahasan Teknis Soal</h2>
            <span className="text-xs text-cyber-muted">({breakdown.length} Butir)</span>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-sm border font-medium transition-colors ${
                filterType === 'all'
                  ? 'border-cyber-primary bg-cyber-primary text-cyber-ink font-bold'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
              }`}
            >
              Semua ({breakdown.length})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1.5 rounded-sm border font-medium transition-colors ${
                filterType === 'correct'
                  ? 'border-cyber-success bg-cyber-success/20 text-cyber-success'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
              }`}
            >
              Benar ({correctCount})
            </button>
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-3 py-1.5 rounded-sm border font-medium transition-colors ${
                filterType === 'incorrect'
                  ? 'border-cyber-danger bg-cyber-field text-cyber-danger'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
              }`}
            >
              Salah ({incorrectCount})
            </button>
            <button
              onClick={() => setFilterType('unanswered')}
              className={`px-3 py-1.5 rounded-sm border font-medium transition-colors ${
                filterType === 'unanswered'
                  ? 'border-cyber-primary bg-cyber-card text-white'
                  : 'border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
              }`}
            >
              Kosong ({unansweredCount})
            </button>
          </div>
        </div>

        {/* LIST OF QUESTIONS */}
        <div className="space-y-6">
          {filteredBreakdown.map((item) => {
            return (
              <div
                key={item.id}
                className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-7 space-y-4"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-cyber-border">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyber-primary">{item.id}</span>
                    <span className="text-cyber-muted">•</span>
                    <span className="text-cyber-muted">{item.category}</span>
                  </div>

                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 font-semibold text-cyber-success bg-cyber-secondary border border-cyber-success/30 px-2.5 py-0.5 rounded-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Benar (+{item.pointsEarned} poin)
                    </span>
                  ) : item.isAnswered ? (
                    <span className="flex items-center gap-1 font-semibold text-cyber-danger bg-cyber-secondary border border-cyber-danger/30 px-2.5 py-0.5 rounded-sm">
                      <XCircle className="h-3.5 w-3.5" /> Salah ({item.pointsEarned} poin)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-medium text-cyber-muted bg-cyber-secondary px-2.5 py-0.5 rounded-sm border border-cyber-border">
                      Tidak Dijawab (0 poin)
                    </span>
                  )}
                </div>

                <h3 className="text-base font-medium text-white leading-relaxed">
                  {item.question}
                </h3>

                {/* OPTIONS LIST */}
                <div className="space-y-2 pt-1">
                  {item.options.map((opt) => {
                    const isChosen = item.selectedOption === opt.id;
                    const isRight = item.correctOption === opt.id;

                    let badgeClass = 'border-cyber-border bg-cyber-secondary text-cyber-muted';
                    if (isRight) {
                      badgeClass = 'border-cyber-success bg-cyber-secondary text-white font-medium';
                    } else if (isChosen && !isRight) {
                      badgeClass = 'border-cyber-danger bg-cyber-field text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-sm border text-xs leading-relaxed transition-colors ${badgeClass}`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-bold text-[11px] ${
                            isRight
                              ? 'bg-cyber-success text-black'
                              : isChosen
                              ? 'bg-cyber-danger text-white'
                              : 'bg-cyber-card text-cyber-muted border border-cyber-border'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1 pt-0.5">{opt.text}</span>
                        {isRight && (
                          <span className="text-[11px] font-semibold text-cyber-success shrink-0 pt-0.5">
                            Kunci Jawaban
                          </span>
                        )}
                        {isChosen && !isRight && (
                          <span className="text-[11px] font-semibold text-cyber-danger shrink-0 pt-0.5">
                            Jawaban Anda
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* EXPLANATION BOX */}
                <div className="rounded-sm bg-cyber-secondary border border-cyber-border p-4 space-y-1.5 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyber-primary">
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
