'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Copy,
  Check,
  Play,
  Clock,
  AlertTriangle,
  UserPlus,
  RefreshCw,
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      hostTokenRef.current = sessionStorage.getItem(`room_${roomCode}_host_token`);
      participantTokenRef.current = sessionStorage.getItem(`room_${roomCode}_participant_token`);
    }
  }, [roomCode]);

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

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 3000);
    return () => clearInterval(interval);
  }, [fetchRoomState]);

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
        <div className="flex items-center gap-3 text-cyber-muted text-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-cyber-primary" />
          <span>Menghubungkan ke Room Lobby...</span>
        </div>
      </div>
    );
  }

  const config = roomData?.configuration || {};
  const canStart = isHost && participants.length >= 2 && participants.length <= 3;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* ROOM CODE HERO CARD */}
      <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="text-xs font-semibold text-cyber-primary">
            Lobby Pertandingan Tim • Status: {roomData?.status}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Bagikan Kode Room ke Tim Anda</h1>
          <p className="text-xs sm:text-sm text-cyber-muted">
            Kapasitas maksimal 3 peserta. Pertandingan dapat dimulai segera setelah minimal 2 orang hadir di lobby.
          </p>
        </div>

        {/* COPY CODE BUTTON */}
        <div className="flex items-center gap-3 bg-cyber-secondary border border-cyber-border rounded-sm p-3 px-5">
          <span className="font-mono text-3xl sm:text-4xl font-bold tracking-widest text-white">
            {roomCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-sm bg-cyber-field border border-cyber-primary/40 px-3.5 py-2 text-xs font-semibold text-white hover:bg-cyber-primary hover:text-cyber-ink transition-colors"
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
        <div className="flex items-start gap-3 rounded-sm border border-cyber-danger bg-cyber-field p-4 text-xs text-cyber-text">
          <AlertTriangle className="h-4 w-4 text-cyber-danger shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PARTICIPANTS & CONFIGURATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PARTICIPANTS LIST (2 COLS) */}
        <div className="md:col-span-2 rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-cyber-primary" />
              <span>Daftar Anggota Tim ({participants.length}/3)</span>
            </h2>
            <span className="text-xs text-cyber-muted">
              {participants.length >= 2 ? 'Siap dimulai' : 'Menunggu anggota lain...'}
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2].map((slotIdx) => {
              const participant = participants[slotIdx];
              if (participant) {
                const isCurrent = participant.id === (typeof window !== 'undefined' ? sessionStorage.getItem(`room_${roomCode}_participant_id`) : null);
                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 rounded-sm border border-cyber-border bg-cyber-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-cyber-field text-white font-bold text-xs border border-cyber-primary/40 font-mono">
                        P{slotIdx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          <span>{participant.nickname}</span>
                          {isCurrent && (
                            <span className="rounded-sm bg-cyber-field border border-cyber-primary/50 px-1.5 py-0.5 text-[10px] text-white font-semibold">
                              Anda
                            </span>
                          )}
                          {slotIdx === 0 && (
                            <span className="rounded-sm bg-cyber-field border border-cyber-primary/50 px-1.5 py-0.5 text-[10px] text-cyber-primary font-semibold">
                              Host
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-cyber-muted mt-0.5">Status: Terhubung & Siap</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyber-success bg-cyber-card border border-cyber-border px-2.5 py-1 rounded-sm">
                      <Check className="h-3 w-3" />
                      <span>SIAP</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={`empty_${slotIdx}`}
                  className="flex items-center justify-between p-4 rounded-sm border border-dashed border-cyber-border bg-cyber-bg text-cyber-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-cyber-secondary border border-cyber-border text-xs font-semibold font-mono">
                      P{slotIdx + 1}
                    </div>
                    <div className="text-xs">Menunggu peserta bergabung...</div>
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
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-cyber-primary py-3.5 text-sm font-bold text-cyber-ink hover:bg-cyber-primaryHover transition-colors disabled:opacity-40 shadow-sm"
              >
                {starting ? (
                  <span>Membagikan Soal...</span>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Mulai Pertandingan Sekarang</span>
                  </>
                )}
              </button>
            ) : (
              <div className="rounded-sm border border-cyber-border bg-cyber-secondary p-3.5 text-center text-xs text-cyber-muted flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-cyber-primary" />
                <span>Menunggu Host ({participants[0]?.nickname || 'Host'}) memulai pertandingan...</span>
              </div>
            )}
          </div>
        </div>

        {/* ROOM CONFIGURATION CARD (1 COL) */}
        <div className="rounded-sm border border-cyber-border bg-cyber-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-cyber-border pb-3">
              Informasi Pertandingan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-cyber-muted">
                <span>Soal Per Anggota:</span>
                <span className="font-semibold text-white font-mono tabular-nums">{config.questionCount || 10} Butir</span>
              </div>
              <div className="flex justify-between text-cyber-muted">
                <span>Durasi Individual:</span>
                <span className="font-semibold text-white font-mono tabular-nums">{config.durationMinutes || 15} Menit</span>
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

          <div className="rounded-sm bg-cyber-secondary p-3.5 text-xs text-cyber-muted border border-cyber-border space-y-1">
            <div className="font-semibold text-white">Catatan Multiplayer:</div>
            <div>• Soal tiap anggota 100% berbeda tanpa duplikasi.</div>
            <div>• Sesi dibersihkan otomatis setelah seluruh tim selesai.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
