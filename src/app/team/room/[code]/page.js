'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Copy,
  Check,
  Play,
  Shield,
  Clock,
  Layers,
  AlertTriangle,
  UserCheck,
  UserPlus,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { getBrowserSupabase } from '@/lib/supabase/client';

export default function RoomLobbyPage({ params }) {
  const router = useRouter();
  const roomCode = (params.code || '').trim().toUpperCase();

  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  const hostTokenRef = useRef(null);
  const participantTokenRef = useRef(null);

  // Retrieve stored tokens from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      hostTokenRef.current = sessionStorage.getItem(`room_${roomCode}_host_token`);
      participantTokenRef.current = sessionStorage.getItem(`room_${roomCode}_participant_token`);
    }
  }, [roomCode]);

  // Fetch current room state from server
  const fetchRoomState = useCallback(async () => {
    try {
      const token = hostTokenRef.current || participantTokenRef.current || '';
      const res = await fetch(`/api/rooms/${roomCode}?token=${token}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal memuat data room.');
        setInitialLoading(false);
        return;
      }

      setRoomData(data.room);
      setParticipants(data.participants || []);
      setIsHost(data.isHost);

      // If room is already IN_PROGRESS, redirect to quiz immediately
      if (data.room?.status === 'IN_PROGRESS') {
        router.replace(`/team/quiz/${roomCode}`);
      } else if (data.room?.status === 'COMPLETED') {
        router.replace(`/team/result/${roomCode}`);
      }
    } catch (err) {
      console.error('Error fetching room state:', err);
    } finally {
      setInitialLoading(false);
    }
  }, [roomCode, router]);

  // Initial fetch and periodic polling fallback (every 3 seconds)
  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 3000);
    return () => clearInterval(interval);
  }, [fetchRoomState]);

  // Setup Supabase Realtime channel subscription
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`room_lobby_${roomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` },
        (payload) => {
          if (payload.new && payload.new.status === 'IN_PROGRESS') {
            router.replace(`/team/quiz/${roomCode}`);
          } else if (payload.new) {
            setRoomData((prev) => ({ ...prev, ...payload.new }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants' },
        () => {
          fetchRoomState();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, router, fetchRoomState]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartMatch = async () => {
    setErrorMessage('');
    if (!hostTokenRef.current) {
      setErrorMessage('Anda tidak memiliki izin host untuk memulai pertandingan.');
      return;
    }

    if (participants.length < 2) {
      setErrorMessage('Minimal 2 peserta diperlukan untuk memulai pertandingan.');
      return;
    }

    setStarting(true);

    try {
      const res = await fetch(`/api/rooms/${roomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken: hostTokenRef.current }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal memulai pertandingan.');
        setStarting(false);
        return;
      }

      // Transition to quiz interface
      router.replace(`/team/quiz/${roomCode}`);
    } catch (err) {
      console.error('Error starting match:', err);
      setErrorMessage('Terjadi kesalahan jaringan saat memulai pertandingan.');
      setStarting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-cyber-electric text-sm animate-pulse">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Menghubungkan ke Room Lobby...</span>
        </div>
      </div>
    );
  }

  const config = roomData?.configuration || {};
  const canStart = isHost && participants.length >= 2 && participants.length <= 3;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ROOM CODE HERO CARD */}
      <div className="rounded-3xl border border-cyber-border bg-gradient-to-b from-cyber-card to-cyber-secondary p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-bg px-3 py-1 text-xs font-semibold text-cyber-electric">
            <Users className="h-3.5 w-3.5" />
            <span>Room Lobby • Status: {roomData?.status}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Bagikan Room Code ke Tim Anda</h1>
          <p className="text-xs text-cyber-muted">
            Maksimal 3 peserta. Pertandingan dapat dimulai segera setelah minimal 2 orang bergabung.
          </p>
        </div>

        {/* COPY CODE BUTTON */}
        <div className="flex items-center gap-3 bg-cyber-bg border border-cyber-border rounded-2xl p-3 px-5 shadow-inner">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-cyber-electric">
            {roomCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-xl bg-cyber-secondary border border-cyber-border px-3.5 py-2 text-xs font-semibold text-white hover:bg-cyber-primary hover:border-cyber-primary transition-all"
            title="Salin Room Code"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-cyber-success" />
                <span className="text-cyber-success">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-cyber-muted" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-cyber-danger/50 bg-cyber-danger/10 p-4 text-xs text-cyber-text">
          <AlertTriangle className="h-4 w-4 text-cyber-danger shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PARTICIPANTS & CONFIGURATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PARTICIPANTS LIST (2 COLS) */}
        <div className="md:col-span-2 rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-cyber-electric" />
              <span>Daftar Anggota Tim ({participants.length}/3)</span>
            </h2>
            <span className="text-[11px] text-cyber-muted">
              {participants.length >= 2 ? 'Siap dimulai' : 'Menunggu anggota lain...'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Slot 1, 2, 3 */}
            {[0, 1, 2].map((slotIdx) => {
              const participant = participants[slotIdx];
              if (participant) {
                const isCurrent = participant.id === sessionStorage.getItem(`room_${roomCode}_participant_id`);
                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-cyber-border/80 bg-cyber-secondary/70 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-primary/20 text-cyber-electric font-bold text-xs border border-cyber-primary/40">
                        P{slotIdx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          <span>{participant.nickname}</span>
                          {isCurrent && (
                            <span className="rounded bg-cyber-electric/20 border border-cyber-electric/40 px-1.5 py-0.2 text-[10px] text-cyber-electric font-semibold">
                              Anda
                            </span>
                          )}
                          {slotIdx === 0 && (
                            <span className="rounded bg-cyber-accent/20 border border-cyber-accent/40 px-1.5 py-0.2 text-[10px] text-cyber-accent font-semibold">
                              Host
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-cyber-muted mt-0.5">Status: Terhubung & Siap</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyber-success bg-cyber-success/10 border border-cyber-success/30 px-2.5 py-1 rounded-full">
                      <Check className="h-3 w-3" />
                      <span>READY</span>
                    </div>
                  </div>
                );
              }

              // Empty Slot
              return (
                <div
                  key={`empty_${slotIdx}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-dashed border-cyber-border/50 bg-cyber-bg/40 text-cyber-darkMuted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-secondary/50 border border-cyber-border/40 text-xs font-semibold">
                      P{slotIdx + 1}
                    </div>
                    <div className="text-xs italic">Menunggu peserta bergabung...</div>
                  </div>
                  <UserPlus className="h-4 w-4 opacity-40" />
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-2">
            {isHost ? (
              <button
                onClick={handleStartMatch}
                disabled={!canStart || starting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyber-primary py-3.5 text-sm font-bold text-white shadow-glow hover:bg-cyber-electric transition-all disabled:opacity-40"
              >
                {starting ? (
                  <span>Membagikan Soal...</span>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Mulai Pertandingan Sekarang</span>
                  </>
                )}
              </button>
            ) : (
              <div className="rounded-xl border border-cyber-border/70 bg-cyber-secondary p-3.5 text-center text-xs text-cyber-muted flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-cyber-electric animate-spin" />
                <span>Menunggu Host ({participants[0]?.nickname || 'Host'}) memulai pertandingan...</span>
              </div>
            )}
          </div>
        </div>

        {/* ROOM CONFIGURATION CARD (1 COL) */}
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-cyber-border/60 pb-3">
              Informasi Pertandingan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-cyber-muted">
                <span>Soal Per Anggota:</span>
                <span className="font-semibold text-white">{config.questionCount || 10} Butir</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Durasi Individual:</span>
                <span className="font-semibold text-white">{config.durationMinutes || 15} Menit</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Tingkat Kesulitan:</span>
                <span className="font-semibold text-white capitalize">{config.difficulty || 'Campuran'}</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Distribusi Soal:</span>
                <span className="font-semibold text-white capitalize">{config.categoryMode || 'Mixed'}</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Negative Marking:</span>
                <span className={`font-semibold ${config.negativeMarking ? 'text-cyber-danger' : 'text-white'}`}>
                  {config.negativeMarking ? 'Aktif (-15 poin)' : 'Nonaktif'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-cyber-secondary p-3.5 text-[11px] text-cyber-darkMuted border border-cyber-border/40 space-y-1">
            <div className="font-semibold text-cyber-text">Catatan Multiplayer:</div>
            <div>• Soal yang dibagikan kepada tiap anggota 100% berbeda tanpa duplikasi.</div>
            <div>• Jawaban tidak dapat dilihat oleh rekan tim selama ujian berlangsung.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
