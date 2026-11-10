import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAllQuestionBanks, getCategories, getFilteredQuestions, stripAnswers } from '../src/lib/questions/loader.js';
import { evaluateQuizSubmission } from '../src/lib/scoring/evaluator.js';
import { distributeTeamQuestions } from '../src/lib/room/distributor.js';

test('loadAllQuestionBanks loads all 9 categories with 182 questions', () => {
  const { categories, questionsMap } = loadAllQuestionBanks();
  assert.equal(categories.length, 9, 'Should have 9 categories');
  assert.equal(questionsMap.size, 182, 'Should have 182 questions in total');
});

test('stripAnswers strictly removes answer and explanation', () => {
  const questions = getFilteredQuestions({ limit: 5 });
  assert.ok(questions[0].answer, 'Original has answer');
  const sanitized = stripAnswers(questions);
  for (const q of sanitized) {
    assert.equal(q.answer, undefined, 'Sanitized question must NOT contain answer');
    assert.equal(q.explanation, undefined, 'Sanitized question must NOT contain explanation');
    assert.ok(q.id, 'Has question id');
    assert.ok(q.question, 'Has question text');
    assert.equal(q.options.length, 4, 'Has 4 options');
  }
});

test('evaluateQuizSubmission accurately calculates scores and handles negative marking', () => {
  const { questionsMap } = loadAllQuestionBanks();
  const qList = Array.from(questionsMap.values()).slice(0, 4);
  const qIds = qList.map((q) => q.id);

  // User answers: q0 correct, q1 wrong, q2 wrong, q3 unanswered
  const userAnswers = {
    [qIds[0]]: qList[0].answer,
    [qIds[1]]: qList[1].answer === 'A' ? 'B' : 'A',
    [qIds[2]]: qList[2].answer === 'A' ? 'B' : 'A',
  };

  // Standard scoring (+50 per correct, 0 penalty)
  const resultStandard = evaluateQuizSubmission({
    assignedQuestionIds: qIds,
    userAnswers,
    negativeMarking: false,
    correctPoints: 50,
  });

  assert.equal(resultStandard.totalQuestions, 4);
  assert.equal(resultStandard.correctCount, 1);
  assert.equal(resultStandard.incorrectCount, 2);
  assert.equal(resultStandard.unansweredCount, 1);
  assert.equal(resultStandard.totalScore, 50);
  assert.equal(resultStandard.accuracyPercentage, 25.0);

  // Negative marking (+50 correct, -15 wrong)
  const resultNegative = evaluateQuizSubmission({
    assignedQuestionIds: qIds,
    userAnswers,
    negativeMarking: true,
    correctPoints: 50,
    penaltyPoints: 15,
  });

  // 1 correct (+50), 2 wrong (-30) = 20 total
  assert.equal(resultNegative.totalScore, 20);
});

test('distributeTeamQuestions ensures zero duplication across 3 players', () => {
  const participantIds = ['p1', 'p2', 'p3'];
  const res = distributeTeamQuestions({
    participantIds,
    configuration: {
      questionCount: 10,
      categoryMode: 'mixed',
      difficulty: 'mixed',
    },
  });

  assert.equal(res.success, true);
  assert.ok(res.distributions.p1);
  assert.ok(res.distributions.p2);
  assert.ok(res.distributions.p3);

  const set1 = new Set(res.distributions.p1.map((q) => q.id));
  const set2 = new Set(res.distributions.p2.map((q) => q.id));
  const set3 = new Set(res.distributions.p3.map((q) => q.id));

  assert.equal(set1.size, 10);
  assert.equal(set2.size, 10);
  assert.equal(set3.size, 10);

  // Invariant: Non-overlapping
  for (const id of set1) {
    assert.ok(!set2.has(id), 'P1 and P2 must not share question ' + id);
    assert.ok(!set3.has(id), 'P1 and P3 must not share question ' + id);
  }
  for (const id of set2) {
    assert.ok(!set3.has(id), 'P2 and P3 must not share question ' + id);
  }
});
