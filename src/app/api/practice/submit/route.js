import { NextResponse } from 'next/server';
import { evaluateQuizSubmission } from '@/lib/scoring/evaluator';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      assignedQuestionIds = [],
      userAnswers = {},
      negativeMarking = false,
      startedAt = null,
      finishedAt = new Date().toISOString(),
      nickname = 'Peserta',
    } = body;

    if (!Array.isArray(assignedQuestionIds) || assignedQuestionIds.length === 0) {
      return NextResponse.json(
        { error: 'Daftar ID soal tidak valid atau kosong.' },
        { status: 400 }
      );
    }

    const evaluation = evaluateQuizSubmission({
      assignedQuestionIds,
      userAnswers: typeof userAnswers === 'object' && userAnswers !== null ? userAnswers : {},
      negativeMarking: Boolean(negativeMarking),
      startedAt,
      finishedAt,
    });

    return NextResponse.json({
      success: true,
      nickname,
      result: evaluation,
    });
  } catch (error) {
    console.error('Error submitting solo quiz:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengevaluasi hasil pengerjaan.' },
      { status: 500 }
    );
  }
}
