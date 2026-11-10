'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export default function SoloQuizPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [initLoaded, setInitLoaded] = useState(false);

  const autoSubmittedRef = useRef(false);

  // Load session from sessionStorage on mount
  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem('solo_session');
      const storedQuestions = sessionStorage.getItem('solo_questions');
      const storedAnswers = sessionStorage.getItem('solo_answers');

      if (!storedSession || !storedQuestions) {
        router.replace('/practice');
        return;
      }

      const parsedSession = JSON.parse(storedSession);
      const parsedQuestions = JSON.parse(storedQuestions);
      const parsedAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};

      setSession(parsedSession);
      setQuestions(parsedQuestions);
      setAnswers(parsedAnswers);

      // Calculate initial remaining seconds based on expiresAt
      if (parsedSession.expiresAt) {
        const diffMs = new Date(parsedSession.expiresAt).getTime() - Date.now();
        const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
        setRemainingSeconds(diffSecs);
      } else {
        setRemainingSeconds(parsedSession.durationSeconds || 15 * 60);
      }

      setInitLoaded(true);
    } catch (err) {
      console.error('Failed to load session:', err);
      router.replace('/practice');
    }
  }, [router]);

  // Submit function
  const handleFinalSubmit = useCallback(
    async (isAuto = false) => {
      if (isSubmitting || autoSubmittedRef.current) return;
      if (isAuto) {
        autoSubmittedRef.current = true;
      }

      setIsSubmitting(true);

      try {
        const storedSession = session || JSON.parse(sessionStorage.getItem('solo_session') || '{}');
        const currentAnswers = answers;

        const payload = {
          nickname: storedSession.nickname || 'Peserta',
          assignedQuestionIds: storedSession.assignedQuestionIds || questions.map((q) => q.id),
          userAnswers: currentAnswers,
          negativeMarking: storedSession.negativeMarking || false,
          startedAt: storedSession.startedAt,
          finishedAt: new Date().toISOString(),
        };

        const res = await fetch('/api/practice/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success && data.result) {
          sessionStorage.setItem('solo_result', JSON.stringify(data));
          // Clear active session to prevent re-taking same session
          sessionStorage.removeItem('solo_session');
          sessionStorage.removeItem('solo_questions');
          sessionStorage.removeItem('solo_answers');

          router.replace('/practice/result');
        } else {
          alert('Gagal mengirimkan ujian: ' + (data.error || 'Terjadi kesalahan'));
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error('Error submitting exam:', err);
        alert('Terjadi kesalahan jaringan saat mengirimkan ujian.');
        setIsSubmitting(false);
      }
    },
    [isSubmitting, session, answers, questions, router]
  );

  // Timer countdown hook
  useEffect(() => {
    if (!initLoaded || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initLoaded, remainingSeconds, handleFinalSubmit]);

  // Save answer selection
  const handleSelectOption = (optionId) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    const updated = {
      ...answers,
      [qId]: optionId,
    };
    setAnswers(updated);
    sessionStorage.setItem('solo_answers', JSON.stringify(updated));
  };

  if (!initLoaded || questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-cyber-electric text-sm animate-pulse">
          <Shield className="h-5 w-5 animate-spin" />
          <span>Memuat sesi ujian...</span>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  // Format timer MM:SS
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timerFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isTimeCritical = remainingSeconds <= 120; // Last 2 minutes

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-between">
      {/* HEADER BAR */}
      <div className="mb-6 rounded-2xl border border-cyber-border bg-cyber-card p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyber-secondary border border-cyber-border flex items-center justify-center text-cyber-electric font-bold text-sm">
            {currentIndex + 1}
          </div>
          <div>
            <div className="text-xs text-cyber-muted">Soal {currentIndex + 1} dari {questions.length}</div>
            <div className="text-xs font-semibold text-white capitalize">
              {currentQ.category} • <span className="text-cyber-accent uppercase text-[10px]">{currentQ.difficulty}</span>
            </div>
          </div>
        </div>

        {/* TIMER */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 border font-mono text-sm font-bold tracking-wider transition-colors ${
              isTimeCritical
                ? 'bg-cyber-danger/20 border-cyber-danger text-cyber-danger animate-pulse'
                : 'bg-cyber-secondary border-cyber-border text-cyber-electric'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{timerFormatted}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="rounded-xl bg-cyber-primary px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-cyber-electric transition-colors"
          >
            Selesai Ujian
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* QUESTION DISPLAY (COL 1-3) */}
        <div className="lg:col-span-3 rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-cyber-muted border-b border-cyber-border/40 pb-3">
              <span className="font-mono text-cyber-electric font-semibold">{currentQ.id}</span>
              <span>Pilih satu jawaban yang paling tepat</span>
            </div>

            <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* OPTIONS */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                      isSelected
                        ? 'border-cyber-electric bg-cyber-primary/20 text-white shadow-glow'
                        : 'border-cyber-border bg-cyber-secondary/70 text-cyber-text hover:border-cyber-border/80 hover:bg-cyber-secondary'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                        isSelected
                          ? 'bg-cyber-electric text-white'
                          : 'bg-cyber-hover text-cyber-muted border border-cyber-border'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="leading-snug pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="border-t border-cyber-border/50 pt-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-cyber-border bg-cyber-secondary px-4 py-2.5 text-xs font-semibold text-cyber-text hover:bg-cyber-hover transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs text-cyber-muted hidden sm:inline">
              Peserta: <strong className="text-white">{session?.nickname}</strong>
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-cyber-secondary border border-cyber-border px-5 py-2.5 text-xs font-semibold text-cyber-text hover:bg-cyber-hover hover:border-cyber-electric transition-colors"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-cyber-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow hover:bg-cyber-electric transition-all"
              >
                <span>Selesai & Kumpulkan</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* QUESTION NAVIGATION GRID (COL 4) */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Navigasi Nomor Soal</h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(answers[q.id]);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg font-mono text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'border-2 border-white bg-cyber-electric text-white shadow-glow'
                        : isAnswered
                        ? 'border border-cyber-electric/60 bg-cyber-primary/30 text-cyber-electric'
                        : 'border border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-border/80'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STATUS SUMMARY */}
          <div className="border-t border-cyber-border/60 pt-4 space-y-2 text-xs text-cyber-muted">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyber-electric" /> Terjawab
              </span>
              <span className="font-semibold text-white">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyber-border" /> Belum Dijawab
              </span>
              <span className="font-semibold text-white">{unansweredCount}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span>Total Butir</span>
              <span className="font-semibold text-white">{questions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-cyber-accent">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-white">Konfirmasi Pengumpulan Ujian</h3>
            </div>

            <p className="text-xs text-cyber-muted leading-relaxed">
              Apakah Anda yakin ingin mengakhiri sesi latihan ini sekarang?
            </p>

            <div className="rounded-xl bg-cyber-secondary p-4 space-y-2 text-xs border border-cyber-border/60">
              <div className="flex justify-between text-cyber-muted">
                <span>Soal Terjawab:</span>
                <span className="font-semibold text-cyber-success">{answeredCount} Soal</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Soal Belum Terjawab:</span>
                <span className="font-semibold text-cyber-danger">{unansweredCount} Soal</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Sisa Waktu:</span>
                <span className="font-semibold text-cyber-electric">{timerFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-xl border border-cyber-border bg-cyber-secondary py-2.5 text-xs font-semibold text-cyber-text hover:bg-cyber-hover transition-colors"
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleFinalSubmit(false);
                }}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-cyber-primary py-2.5 text-xs font-bold text-white shadow-glow hover:bg-cyber-electric transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Ya, Kumpulkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
