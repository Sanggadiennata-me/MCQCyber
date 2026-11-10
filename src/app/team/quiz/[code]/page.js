'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  Users,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { getBrowserSupabase } from '@/lib/supabase/client';

export default function TeamQuizPage({ params }) {
  const router = useRouter();
  const roomCode = (params.code || '').trim().toUpperCase();

  const [questions, setQuestions] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [roomConfig, setRoomConfig] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Waiting state for teammates
  const [teammateStatus, setTeammateStatus] = useState([]);

  const autoSubmittedRef = useRef(false);
  const participantTokenRef = useRef('');

  // Fetch individual quiz data from server
  const fetchQuizData = useCallback(async () => {
    const token =
      sessionStorage.getItem(`room_${roomCode}_participant_token`) ||
      sessionStorage.getItem(`room_${roomCode}_host_token`) ||
      '';

    participantTokenRef.current = token;

    if (!token) {
      router.replace(`/team/room/${roomCode}`);
      return;
    }

    try {
      const res = await fetch(`/api/quiz/${roomCode}?token=${token}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error('Quiz fetch error:', data.error);
        router.replace(`/team/room/${roomCode}`);
        return;
      }

      setQuestions(data.questions || []);
      setParticipant(data.participant);
      setRoomConfig(data.room);

      const saved = data.participant?.savedAnswers || {};
      setAnswers((prev) => (Object.keys(prev).length > 0 ? prev : saved));

      if (data.participant?.isCompleted) {
        setIsCompleted(true);
      }

      if (data.timer) {
        setRemainingSeconds(data.timer.remainingSeconds);
      }
    } catch (err) {
      console.error('Network error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  }, [roomCode, router]);

  const fetchTeammates = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${roomCode}?token=${participantTokenRef.current}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.participants)) {
        setTeammateStatus(data.participants);

        if (data.room?.status === 'COMPLETED') {
          router.replace(`/team/result/${roomCode}`);
        }
      }
    } catch (err) {
      console.error('Error fetching teammates:', err);
    }
  }, [roomCode, router]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  // Periodic poll if user is waiting for teammates
  useEffect(() => {
    if (!isCompleted) return;
    fetchTeammates();
    const interval = setInterval(fetchTeammates, 3000);
    return () => clearInterval(interval);
  }, [isCompleted, fetchTeammates]);

  // Realtime subscription for team completion
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`room_quiz_${roomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` },
        (payload) => {
          if (payload.new && payload.new.status === 'COMPLETED') {
            router.replace(`/team/result/${roomCode}`);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants' },
        () => {
          if (isCompleted) {
            fetchTeammates();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, router, isCompleted, fetchTeammates]);

  // Countdown timer hook
  useEffect(() => {
    if (loading || remainingSeconds <= 0 || isCompleted) return;

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
  }, [loading, remainingSeconds, isCompleted]);

  // Submit answer
  const handleFinalSubmit = async (isAuto = false) => {
    if (submitting || autoSubmittedRef.current || isCompleted) return;
    if (isAuto) autoSubmittedRef.current = true;

    setSubmitting(true);

    try {
      const token = participantTokenRef.current;
      const res = await fetch(`/api/quiz/${roomCode}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          userAnswers: answers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsCompleted(true);
        if (data.roomCompleted) {
          router.replace(`/team/result/${roomCode}`);
        } else {
          fetchTeammates();
        }
      } else {
        alert('Gagal mengirimkan ujian: ' + (data.error || 'Terjadi kesalahan'));
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Error submitting team quiz:', err);
      alert('Terjadi kesalahan jaringan.');
      setSubmitting(false);
    }
  };

  const handleSelectOption = (optionId) => {
    if (isCompleted || !questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionId,
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-cyber-muted text-sm">
          <Clock className="h-5 w-5 text-cyber-primary" />
          <span>Memuat paket soal tim...</span>
        </div>
      </div>
    );
  }

  // WAITING SCREEN: If this participant has submitted, but others haven't finished yet
  if (isCompleted) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 sm:p-10 text-center space-y-6">
          <div className="h-14 w-14 rounded-sm bg-cyber-field border border-cyber-primary/40 flex items-center justify-center text-cyber-primary mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Jawaban Anda Berhasil Diserahkan</h1>
            <p className="text-sm text-cyber-muted">
              Anda telah menyelesaikan paket soal Anda. Skor individual telah dihitung dan disimpan di sisi server.
            </p>
          </div>

          {/* TEAMMATES LIVE PROGRESS */}
          <div className="border-t border-cyber-border pt-6 text-left space-y-3">
            <div className="text-xs font-semibold text-white mb-2">
              Status Anggota Tim:
            </div>

            <div className="space-y-2.5">
              {teammateStatus.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-sm bg-cyber-secondary border border-cyber-border text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-white">{p.nickname}</span>
                    {p.id === participant?.id && (
                      <span className="text-[10px] text-white bg-cyber-field border border-cyber-primary/50 px-1.5 py-0.5 rounded-sm font-semibold">
                        Anda
                      </span>
                    )}
                  </div>

                  {p.isFinished ? (
                    <span className="flex items-center gap-1 font-semibold text-cyber-success bg-cyber-card border border-cyber-border px-2 py-0.5 rounded-sm text-xs">
                      <CheckCircle2 className="h-3 w-3" /> Selesai
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-semibold text-white bg-cyber-field border border-cyber-primary/40 px-2 py-0.5 rounded-sm text-xs">
                      <Clock className="h-3 w-3 text-cyber-primary" /> Sedang Mengerjakan...
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/team/result/${roomCode}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-cyber-primary px-6 py-3 text-xs font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
            >
              <Trophy className="h-4 w-4" />
              <span>Buka Halaman Hasil Tim</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const selectedOption = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timerFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isTimeCritical = remainingSeconds <= 120;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-between">
      {/* HEADER BAR */}
      <div className="mb-6 rounded-sm border border-cyber-border bg-cyber-card p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-sm bg-cyber-field border border-cyber-primary/40 flex items-center justify-center text-white font-bold text-sm font-mono tabular-nums">
            {currentIndex + 1}
          </div>
          <div>
            <div className="text-xs text-cyber-muted">Soal {currentIndex + 1} dari {questions.length}</div>
            <div className="text-xs font-semibold text-white capitalize">
              {currentQ.category} • <span className="text-cyber-primary">{currentQ.difficulty}</span>
            </div>
          </div>
        </div>

        {/* TIMER */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-sm px-4 py-2 border font-mono text-sm font-bold tracking-wider tabular-nums transition-colors ${
              isTimeCritical
                ? 'bg-cyber-field border-cyber-danger text-cyber-danger'
                : 'bg-cyber-secondary border-cyber-border text-white'
            }`}
          >
            <Clock className="h-4 w-4 text-cyber-primary" />
            <span>{timerFormatted}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="rounded-sm bg-cyber-primary px-4 py-2 text-xs font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
          >
            Submit Ujian
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* QUESTION DISPLAY (3 COLS) */}
        <div className="lg:col-span-3 rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-cyber-muted border-b border-cyber-border pb-3">
              <span className="font-mono text-cyber-primary font-semibold">{currentQ.id}</span>
              <span className="text-cyber-muted">Paket Soal Eksklusif Anda • Bebas Duplikasi</span>
            </div>

            <h2 className="text-lg sm:text-xl font-medium text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* OPTIONS */}
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-sm border text-left text-sm transition-colors ${
                      isSelected
                        ? 'border-cyber-primary bg-cyber-field text-white'
                        : 'border-cyber-border bg-cyber-secondary text-cyber-text hover:border-cyber-primary/60'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-bold text-xs ${
                        isSelected
                          ? 'bg-cyber-primary text-white'
                          : 'bg-cyber-card text-cyber-muted border border-cyber-border'
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
          <div className="border-t border-cyber-border pt-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-sm border border-cyber-border bg-cyber-secondary px-4 py-2.5 text-xs font-semibold text-cyber-text hover:border-cyber-primary transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs text-cyber-muted hidden sm:inline">
              Peserta: <strong className="text-white">{participant?.nickname}</strong> (Room {roomCode})
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 rounded-sm bg-cyber-secondary border border-cyber-border px-5 py-2.5 text-xs font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-1.5 rounded-sm bg-cyber-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
              >
                <span>Selesai & Kumpulkan</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* QUESTION NAVIGATION GRID (1 COL) */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Navigasi Nomor Soal</h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(answers[q.id]);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-sm font-mono text-xs font-semibold tabular-nums transition-colors ${
                      isCurrent
                        ? 'border-2 border-white bg-cyber-primary text-white'
                        : isAnswered
                        ? 'border border-cyber-primary bg-cyber-field text-white'
                        : 'border border-cyber-border bg-cyber-secondary text-cyber-muted hover:border-cyber-primary/60'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STATUS SUMMARY */}
          <div className="border-t border-cyber-border pt-4 space-y-2 text-xs text-cyber-muted">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyber-primary" /> Terjawab
              </span>
              <span className="font-semibold text-white font-mono tabular-nums">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyber-border" /> Belum Dijawab
              </span>
              <span className="font-semibold text-white font-mono tabular-nums">{unansweredCount}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span>Total Butir</span>
              <span className="font-semibold text-white font-mono tabular-nums">{questions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-md rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-5">
            <div className="flex items-center gap-3 text-cyber-primary">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-white">Kumpulkan Jawaban Anda?</h3>
            </div>

            <p className="text-xs text-cyber-muted leading-relaxed">
              Jawaban Anda akan langsung dinilai oleh server. Anda tidak dapat mengubah jawaban setelah dikirim.
            </p>

            <div className="rounded-sm bg-cyber-secondary p-4 space-y-2 text-xs border border-cyber-border">
              <div className="flex justify-between text-cyber-muted">
                <span>Soal Terjawab:</span>
                <span className="font-semibold text-cyber-success font-mono tabular-nums">{answeredCount} Soal</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Soal Belum Terjawab:</span>
                <span className="font-semibold text-cyber-danger font-mono tabular-nums">{unansweredCount} Soal</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Sisa Waktu Anda:</span>
                <span className="font-semibold text-white font-mono tabular-nums">{timerFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-sm border border-cyber-border bg-cyber-secondary py-2.5 text-xs font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleFinalSubmit(false);
                }}
                disabled={submitting}
                className="flex-1 rounded-sm bg-cyber-primary py-2.5 text-xs font-semibold text-white hover:bg-cyber-primaryHover transition-colors disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Kumpulkan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
