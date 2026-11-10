'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Home,
  Trash2,
  RefreshCw,
  Award,
} from 'lucide-react';
import { getBrowserSupabase } from '@/lib/supabase/client';

export default function TeamResultPage({ params }) {
  const router = useRouter();
  const roomCode = (params.code || '').trim().toUpperCase();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cleaningUp, setCleaningUp] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const fetchResults = useCallback(async () => {
    try {
      const token =
        sessionStorage.getItem(`room_${roomCode}_participant_token`) ||
        sessionStorage.getItem(`room_${roomCode}_host_token`) ||
        '';

      const res = await fetch(`/api/rooms/${roomCode}/results?token=${token}`);
      const data = await res.json();

      if (data.success) {
        setResultData(data);
      }
    } catch (err) {
      console.error('Error fetching team results:', err);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    fetchResults();
    // Poll every 4 seconds in case other players are still finishing
    const interval = setInterval(fetchResults, 4000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  // Realtime subscription
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`team_results_${roomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants' },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, fetchResults]);

  const handleLeaveAndCleanup = async () => {
    setCleaningUp(true);
    try {
      await fetch('/api/rooms/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode }),
      });
    } catch (err) {
      console.error('Cleanup request failed:', err);
    }

    // Clear session storage for this room
    sessionStorage.removeItem(`room_${roomCode}_host_token`);
    sessionStorage.removeItem(`room_${roomCode}_participant_token`);
    sessionStorage.removeItem(`room_${roomCode}_participant_id`);
    sessionStorage.removeItem(`room_${roomCode}_nickname`);

    router.replace('/');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-cyber-electric text-sm animate-pulse">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Menghitung akumulasi skor tim...</span>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-sm text-cyber-muted">Data hasil pertandingan tidak ditemukan.</div>
        <Link href="/" className="text-xs font-semibold text-cyber-electric hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const { teamScore, participants = [], allFinished, callerBreakdown } = resultData;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* TEAM SCORE HERO CARD */}
      <div className="rounded-3xl border border-cyber-border bg-gradient-to-b from-cyber-card to-cyber-secondary p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="h-64 w-64 text-cyber-accent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-accent/30 bg-cyber-accent/10 px-3.5 py-1 text-xs font-semibold text-cyber-accent">
            <Trophy className="h-3.5 w-3.5" />
            <span>Hasil Pertandingan Tim • Room {roomCode}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            TOTAL SKOR TIM
          </h1>

          <div className="pt-2">
            <div className="text-6xl sm:text-7xl font-black text-cyber-accent tracking-tight flex items-baseline gap-2">
              <span>{teamScore}</span>
              <span className="text-sm font-bold text-cyber-muted uppercase tracking-wider">Poin Kolektif</span>
            </div>
            <p className="text-xs text-cyber-muted mt-2">
              Rumus Akumulasi: <code className="text-cyber-electric font-mono">TEAM SCORE = P1 + P2 + P3</code>
            </p>
          </div>
        </div>

        {/* STATUS BANNER */}
        {!allFinished && (
          <div className="relative z-10 mt-6 rounded-xl border border-cyber-accent/40 bg-cyber-accent/10 p-4 text-xs text-cyber-text flex items-center gap-2 animate-pulse">
            <Clock className="h-4 w-4 text-cyber-accent shrink-0" />
            <span>Sebagian rekan tim masih dalam proses menyelesaikan soal. Skor akan terus bertambah secara real-time.</span>
          </div>
        )}

        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-8">
          <button
            onClick={handleLeaveAndCleanup}
            disabled={cleaningUp}
            className="flex items-center gap-2 rounded-xl bg-cyber-primary px-5 py-3 text-xs font-bold text-white shadow-glow hover:bg-cyber-electric transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>{cleaningUp ? 'Membersihkan...' : 'Keluar & Bersihkan Sesi'}</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-cyber-border bg-cyber-secondary px-5 py-3 text-xs font-semibold text-cyber-text hover:bg-cyber-hover transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* INDIVIDUAL PARTICIPANTS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-cyber-electric" />
            <span>Pencapaian Anggota Tim ({participants.length} Orang)</span>
          </h2>
          <span className="text-xs text-cyber-muted">Kontribusi Masing-masing Peserta</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {participants.map((p, idx) => {
            const mins = Math.floor(p.timeTakenSeconds / 60);
            const secs = p.timeTakenSeconds % 60;
            const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between space-y-6 hover:border-cyber-border/80 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-primary/20 text-cyber-electric font-bold text-xs border border-cyber-primary/40">
                        P{idx + 1}
                      </div>
                      <span className="font-bold text-white text-base truncate max-w-[130px]">{p.nickname}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-cyber-accent">{p.score}</div>
                      <div className="text-[10px] text-cyber-darkMuted font-bold uppercase">POIN</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-cyber-border/60 pt-4">
                    <div className="flex justify-between text-cyber-muted">
                      <span>Akurasi:</span>
                      <span className="font-semibold text-cyber-electric">{p.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted">
                      <span>Benar:</span>
                      <span className="font-semibold text-cyber-success">{p.correctCount} Soal</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted">
                      <span>Salah:</span>
                      <span className="font-semibold text-cyber-danger">{p.incorrectCount} Soal</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted">
                      <span>Tidak Dijawab:</span>
                      <span className="font-semibold text-white">{p.unansweredCount} Soal</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted pt-1 border-t border-cyber-border/40">
                      <span>Waktu Selesai:</span>
                      <span className="font-semibold text-white">{timeStr}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-center py-1.5 px-3 rounded-lg bg-cyber-secondary border border-cyber-border/60 text-[11px] font-semibold text-cyber-muted">
                    {p.status === 'COMPLETED' ? '✓ Telah Menyelesaikan Ujian' : '⏳ Sedang Mengerjakan'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PERSONAL QUESTION BREAKDOWN (If Available) */}
      {callerBreakdown && callerBreakdown.length > 0 && (
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyber-electric" />
              <h2 className="text-lg font-bold text-white">Pembahasan Soal Milik Anda</h2>
              <span className="text-xs text-cyber-muted">({callerBreakdown.length} Butir)</span>
            </div>
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="text-xs font-semibold text-cyber-electric hover:underline"
            >
              {showExplanations ? 'Tutup Pembahasan' : 'Buka Pembahasan Lengkap'}
            </button>
          </div>

          {showExplanations && (
            <div className="space-y-6 pt-4 border-t border-cyber-border/60">
              {callerBreakdown.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-cyber-border bg-cyber-secondary/50 p-5 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2">
                    <span className="font-mono font-bold text-cyber-electric">{item.id} • {item.category}</span>
                    {item.isCorrect ? (
                      <span className="text-cyber-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Benar (+{item.pointsEarned} poin)
                      </span>
                    ) : (
                      <span className="text-cyber-danger font-bold flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Salah ({item.pointsEarned} poin)
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-white text-sm">{item.question}</p>

                  <div className="space-y-1.5 pt-1">
                    {item.options.map((opt) => {
                      const isRight = item.correctOption === opt.id;
                      const isChosen = item.selectedOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            isRight
                              ? 'border-cyber-success bg-cyber-success/15 text-white'
                              : isChosen
                              ? 'border-cyber-danger bg-cyber-danger/15 text-white'
                              : 'border-cyber-border/40 bg-cyber-bg/40 text-cyber-muted'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-bold">{opt.id}.</span>
                            <span>{opt.text}</span>
                          </span>
                          {isRight && <span className="font-bold text-[10px] text-cyber-success uppercase">Kunci</span>}
                          {isChosen && !isRight && <span className="font-bold text-[10px] text-cyber-danger uppercase">Pilihan Anda</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-cyber-bg p-3 rounded-lg border border-cyber-border/60 text-cyber-muted leading-relaxed">
                    <strong className="text-cyber-accent">Penjelasan:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
