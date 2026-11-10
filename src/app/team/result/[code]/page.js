'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Home,
  Trash2,
  RefreshCw,
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
    const interval = setInterval(fetchResults, 4000);
    return () => clearInterval(interval);
  }, [fetchResults]);

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

    sessionStorage.removeItem(`room_${roomCode}_host_token`);
    sessionStorage.removeItem(`room_${roomCode}_participant_token`);
    sessionStorage.removeItem(`room_${roomCode}_participant_id`);
    sessionStorage.removeItem(`room_${roomCode}_nickname`);

    router.replace('/');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-cyber-muted text-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-cyber-primary" />
          <span>Menghitung akumulasi skor tim...</span>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-sm text-cyber-muted">Data hasil pertandingan tidak ditemukan.</div>
        <Link href="/" className="text-xs font-semibold text-cyber-primary hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const { teamScore, participants = [], allFinished, callerBreakdown } = resultData;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      {/* TEAM SCORE HERO CARD */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold text-cyber-primary">
            Hasil Pertandingan Tim • Room {roomCode}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Total Skor Kolektif Tim
          </h1>

          <div className="pt-2">
            <div className="text-6xl sm:text-7xl font-black text-white font-mono tabular-nums tracking-tight flex items-baseline gap-3">
              <span>{teamScore}</span>
              <span className="text-sm font-semibold text-cyber-muted">Poin Total</span>
            </div>
            <p className="text-xs text-cyber-muted mt-2 font-mono">
              Rumus Akumulasi: Team Score = P1 + P2 + P3
            </p>
          </div>
        </div>

        {/* STATUS BANNER */}
        {!allFinished && (
          <div className="rounded-sm border border-cyber-border bg-cyber-field p-4 text-xs text-cyber-text flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyber-primary shrink-0" />
            <span>Sebagian rekan tim masih dalam proses menyelesaikan soal. Skor diperbarui otomatis saat rekan tim selesai.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-cyber-border">
          <button
            onClick={handleLeaveAndCleanup}
            disabled={cleaningUp}
            className="flex items-center gap-2 rounded-sm bg-cyber-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-cyber-primaryHover transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>{cleaningUp ? 'Membersihkan...' : 'Keluar & Bersihkan Sesi'}</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm border border-cyber-border bg-cyber-secondary px-5 py-2.5 text-xs font-semibold text-cyber-text hover:border-cyber-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* INDIVIDUAL PARTICIPANTS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-cyber-primary" />
            <span>Pencapaian Anggota Tim ({participants.length} Orang)</span>
          </h2>
          <span className="text-xs text-cyber-muted">Kontribusi Poin Masing-masing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {participants.map((p, idx) => {
            const mins = Math.floor(p.timeTakenSeconds / 60);
            const secs = p.timeTakenSeconds % 60;
            const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

            return (
              <div
                key={p.id}
                className="rounded-sm border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between space-y-6 hover:border-cyber-primary transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-cyber-field text-white font-bold text-xs border border-cyber-primary/40 font-mono">
                        P{idx + 1}
                      </div>
                      <span className="font-bold text-white text-base truncate max-w-[130px]">{p.nickname}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono tabular-nums">{p.score}</div>
                      <div className="text-[10px] text-cyber-muted font-semibold">POIN</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-cyber-border pt-4">
                    <div className="flex justify-between text-cyber-muted">
                      <span>Akurasi:</span>
                      <span className="font-semibold text-white font-mono tabular-nums">{p.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted">
                      <span>Benar:</span>
                      <span className="font-semibold text-cyber-success font-mono tabular-nums">{p.correctCount} Soal</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted">
                      <span>Salah:</span>
                      <span className="font-semibold text-cyber-danger font-mono tabular-nums">{p.incorrectCount} Soal</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted">
                      <span>Tidak Dijawab:</span>
                      <span className="font-semibold text-white font-mono tabular-nums">{p.unansweredCount} Soal</span>
                    </div>
                    <div className="flex justify-between text-cyber-muted pt-1 border-t border-cyber-border">
                      <span>Waktu Selesai:</span>
                      <span className="font-semibold text-white font-mono tabular-nums">{timeStr}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-center py-1.5 px-3 rounded-sm bg-cyber-secondary border border-cyber-border text-xs text-cyber-muted">
                    {p.status === 'COMPLETED' ? 'Selesai Mengerjakan' : 'Sedang Mengerjakan'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PERSONAL QUESTION BREAKDOWN (If Available) */}
      {callerBreakdown && callerBreakdown.length > 0 && (
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyber-primary" />
              <h2 className="text-lg font-bold text-white">Pembahasan Soal Milik Anda</h2>
              <span className="text-xs text-cyber-muted">({callerBreakdown.length} Butir)</span>
            </div>
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="text-xs font-semibold text-cyber-primary hover:underline"
            >
              {showExplanations ? 'Tutup Pembahasan' : 'Buka Pembahasan Lengkap'}
            </button>
          </div>

          {showExplanations && (
            <div className="space-y-6 pt-4 border-t border-cyber-border">
              {callerBreakdown.map((item) => (
                <div
                  key={item.id}
                  className="rounded-sm border border-cyber-border bg-cyber-secondary p-5 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-cyber-border pb-2">
                    <span className="font-mono font-bold text-cyber-primary">{item.id} • {item.category}</span>
                    {item.isCorrect ? (
                      <span className="text-cyber-success font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Benar (+{item.pointsEarned} poin)
                      </span>
                    ) : (
                      <span className="text-cyber-danger font-semibold flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Salah ({item.pointsEarned} poin)
                      </span>
                    )}
                  </div>

                  <p className="font-medium text-white text-sm">{item.question}</p>

                  <div className="space-y-1.5 pt-1">
                    {item.options.map((opt) => {
                      const isRight = item.correctOption === opt.id;
                      const isChosen = item.selectedOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-sm border text-xs flex items-center justify-between ${
                            isRight
                              ? 'border-cyber-success bg-cyber-card text-white'
                              : isChosen
                              ? 'border-cyber-danger bg-cyber-field text-white'
                              : 'border-cyber-border bg-cyber-card text-cyber-muted'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-bold">{opt.id}.</span>
                            <span>{opt.text}</span>
                          </span>
                          {isRight && <span className="font-semibold text-xs text-cyber-success">Kunci</span>}
                          {isChosen && !isRight && <span className="font-semibold text-xs text-cyber-danger">Pilihan Anda</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-cyber-card p-3 rounded-sm border border-cyber-border text-cyber-muted leading-relaxed">
                    <strong className="text-white">Penjelasan:</strong> {item.explanation}
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
