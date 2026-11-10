import { NextResponse } from 'next/server';
import { getFilteredQuestions, stripAnswers } from '@/lib/questions/loader';
import { sanitizeNickname } from '@/lib/security/tokens';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nickname: rawNickname,
      categories = [],
      difficulty = 'mixed',
      questionCount = 10,
      durationMinutes = 15,
      randomizeQuestions = true,
      randomizeOptions = true,
      negativeMarking = false,
    } = body;

    const nicknameValidation = sanitizeNickname(rawNickname);
    if (!nicknameValidation.valid) {
      return NextResponse.json(
        { error: nicknameValidation.error },
        { status: 400 }
      );
    }

    const limit = Math.max(5, Math.min(100, parseInt(questionCount, 10) || 10));
    const duration = Math.max(5, Math.min(120, parseInt(durationMinutes, 10) || 15));

    const selectedQuestions = getFilteredQuestions({
      categories,
      difficulty,
      limit,
      randomizeQuestions: Boolean(randomizeQuestions),
      randomizeOptions: Boolean(randomizeOptions),
    });

    if (selectedQuestions.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada soal yang sesuai dengan kategori dan tingkat kesulitan yang dipilih.' },
        { status: 400 }
      );
    }

    // SECURITY: Strip answers and explanations completely before sending to client
    const safeQuestions = stripAnswers(selectedQuestions);
    const assignedQuestionIds = safeQuestions.map((q) => q.id);

    const session = {
      sessionId: `solo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      nickname: nicknameValidation.nickname,
      durationMinutes: duration,
      durationSeconds: duration * 60,
      negativeMarking: Boolean(negativeMarking),
      questionCount: safeQuestions.length,
      assignedQuestionIds,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration * 60 * 1000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      session,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error('Error starting solo practice:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memulai sesi latihan.' },
      { status: 500 }
    );
  }
}
