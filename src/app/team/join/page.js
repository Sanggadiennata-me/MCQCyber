'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertTriangle, ArrowRight, KeyRound } from 'lucide-react';

export default function JoinRoomPage() {
  const router = useRouter();

  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCode = roomCode.trim().toUpperCase();
    const cleanNick = nickname.trim();

    if (!cleanCode) {
      setErrorMessage('Silakan masukkan Room Code.');
      return;
    }

    if (!cleanNick) {
      setErrorMessage('Silakan masukkan Nickname Anda.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: cleanCode,
          nickname: cleanNick,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Gagal bergabung ke room.');
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem(`room_${cleanCode}_participant_token`, data.participantToken);
      sessionStorage.setItem(`room_${cleanCode}_participant_id`, data.participantId);
      sessionStorage.setItem(`room_${cleanCode}_nickname`, cleanNick);

      router.push(`/team/room/${cleanCode}`);
    } catch (err) {
      console.error('Error joining room:', err);
      setErrorMessage('Terjadi kesalahan jaringan saat mencoba bergabung.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Gabung ke Room</h1>
        <p className="text-sm text-cyber-muted mt-2">
          Masukkan kode room 6 karakter yang dibagikan oleh Host tim Anda.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-sm border border-cyber-danger bg-cyber-field p-4 text-xs text-cyber-text">
          <AlertTriangle className="h-4 w-4 text-cyber-danger shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleJoin} className="rounded-sm border border-cyber-border bg-cyber-card p-6 sm:p-8 space-y-6">
        {/* ROOM CODE */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            Kode Room (Room Code) <span className="text-cyber-primary">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Contoh: 7K9X2A"
              maxLength={12}
              required
              className="w-full rounded-sm border border-cyber-border bg-cyber-bg px-4 py-3.5 text-center font-mono text-2xl font-bold tracking-widest text-white placeholder-cyber-muted uppercase focus:border-cyber-primary focus:outline-none transition-colors"
            />
            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-muted pointer-events-none" />
          </div>
        </div>

        {/* NICKNAME */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            Nickname Anda <span className="text-cyber-primary">*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: NetDefender, CodeBreaker"
            maxLength={25}
            required
            className="w-full rounded-sm border border-cyber-border bg-cyber-bg px-4 py-3 text-sm text-white placeholder-cyber-muted focus:border-cyber-primary focus:outline-none transition-colors"
          />
          <p className="text-xs text-cyber-muted">
            Nickname harus unik dalam satu room dan belum digunakan oleh anggota lain.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-sm bg-cyber-primary py-3.5 text-sm font-semibold text-white hover:bg-cyber-primaryHover transition-colors disabled:opacity-50"
        >
          {submitting ? (
            <span>Memeriksa Room...</span>
          ) : (
            <>
              <span>Masuk ke Lobby Room</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
