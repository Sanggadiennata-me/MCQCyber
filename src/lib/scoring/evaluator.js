import { getAnswerDetails } from '../questions/loader.js';

/**
 * Server-authoritative quiz score evaluator
 *
 * @param {Object} params
 * @param {string[]} params.assignedQuestionIds - Ordered question IDs assigned to participant
 * @param {Object} params.userAnswers - Map of question ID to chosen option ID (e.g. { "WEB-001": "A" })
 * @param {boolean} [params.negativeMarking=false] - Whether wrong answers deduct points
 * @param {number} [params.correctPoints=50] - Points rewarded per correct answer
 * @param {number} [params.penaltyPoints=15] - Points deducted per wrong answer if negative marking is enabled
 * @param {Date|string|number} [params.startedAt] - When the participant started
 * @param {Date|string|number} [params.finishedAt] - When the participant submitted
 */
export function evaluateQuizSubmission({
  assignedQuestionIds = [],
  userAnswers = {},
  negativeMarking = false,
  correctPoints = 50,
  penaltyPoints = 15,
  startedAt = null,
  finishedAt = null,
} = {}) {
  const answerDetails = getAnswerDetails(assignedQuestionIds);

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalScore = 0;

  const breakdown = [];

  for (const qId of assignedQuestionIds) {
    const q = answerDetails[qId];
    if (!q) continue;

    const selectedOption = userAnswers[qId] || null;
    const isAnswered = Boolean(selectedOption);
    const isCorrect = isAnswered && selectedOption === q.answer;

    let pointsEarned = 0;

    if (isCorrect) {
      correctCount++;
      pointsEarned = correctPoints;
      totalScore += correctPoints;
    } else if (isAnswered) {
      incorrectCount++;
      if (negativeMarking) {
        pointsEarned = -penaltyPoints;
        totalScore -= penaltyPoints;
      }
    } else {
      unansweredCount++;
    }

    breakdown.push({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      selectedOption,
      correctOption: q.answer,
      isCorrect,
      isAnswered,
      pointsEarned,
      explanation: q.explanation,
    });
  }

  // Ensure score doesn't drop below 0 if negative marking causes a net negative
  if (totalScore < 0) {
    totalScore = 0;
  }

  const totalQuestions = assignedQuestionIds.length;
  const maxPossibleScore = totalQuestions * correctPoints;
  const accuracyPercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 1000) / 10 : 0;

  let timeTakenSeconds = 0;
  if (startedAt && finishedAt) {
    const startMs = new Date(startedAt).getTime();
    const endMs = new Date(finishedAt).getTime();
    if (!isNaN(startMs) && !isNaN(endMs) && endMs >= startMs) {
      timeTakenSeconds = Math.round((endMs - startMs) / 1000);
    }
  }

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalScore,
    maxPossibleScore,
    accuracyPercentage,
    timeTakenSeconds,
    negativeMarking,
    breakdown,
  };
}
