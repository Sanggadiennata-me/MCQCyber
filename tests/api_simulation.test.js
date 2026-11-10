import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFilteredQuestions, stripAnswers } from '../src/lib/questions/loader.js';
import { evaluateQuizSubmission } from '../src/lib/scoring/evaluator.js';
import { distributeTeamQuestions } from '../src/lib/room/distributor.js';
import { generateRoomCode, generateSessionToken, hashToken, sanitizeNickname } from '../src/lib/security/tokens.js';

test('Nickname sanitization enforces rules', () => {
  assert.equal(sanitizeNickname('').valid, false);
  assert.equal(sanitizeNickname('a').valid, false);
  assert.equal(sanitizeNickname('Valid_Nick-123').valid, true);
  assert.equal(sanitizeNickname('Hacker <script>').valid, false);
  assert.equal(sanitizeNickname('SuperLongNicknameExceedingMaximumAllowedLength25').valid, false);
});

test('Token generation and SHA-256 hashing', () => {
  const token = generateSessionToken();
  assert.equal(token.length, 64);
  const hash1 = hashToken(token);
  const hash2 = hashToken(token);
  assert.equal(hash1, hash2);
  assert.notEqual(hash1, token);
  assert.equal(hash1.length, 64);
});

test('Room code generation produces 6 uppercase characters', () => {
  for (let i = 0; i < 20; i++) {
    const code = generateRoomCode();
    assert.equal(code.length, 6);
    assert.match(code, /^[2-9A-HJ-NP-Z]{6}$/);
  }
});

test('Solo practice workflow simulation', () => {
  // 1. Start solo practice with 10 questions
  const questions = getFilteredQuestions({
    difficulty: 'mixed',
    limit: 10,
    randomizeQuestions: true,
    randomizeOptions: true,
  });
  assert.equal(questions.length, 10);

  const safeQuestions = stripAnswers(questions);
  assert.equal(safeQuestions.length, 10);

  // Verify answer is not present in safe questions
  for (const q of safeQuestions) {
    assert.equal(q.answer, undefined);
    assert.equal(q.explanation, undefined);
  }

  // 2. Prepare user answers
  const userAnswers = {};
  for (let i = 0; i < 7; i++) {
    // 7 answered correctly
    userAnswers[questions[i].id] = questions[i].answer;
  }
  for (let i = 7; i < 9; i++) {
    // 2 answered wrongly
    const wrong = questions[i].options.find((o) => o.id !== questions[i].answer);
    userAnswers[questions[i].id] = wrong.id;
  }
  // 1 unanswered (index 9)

  const evaluation = evaluateQuizSubmission({
    assignedQuestionIds: questions.map((q) => q.id),
    userAnswers,
    negativeMarking: false,
    correctPoints: 50,
  });

  assert.equal(evaluation.totalQuestions, 10);
  assert.equal(evaluation.correctCount, 7);
  assert.equal(evaluation.incorrectCount, 2);
  assert.equal(evaluation.unansweredCount, 1);
  assert.equal(evaluation.totalScore, 350); // 7 * 50
  assert.equal(evaluation.accuracyPercentage, 70.0);
});

test('Multiplayer Team Question Distribution ensures 100% unique questions for each player', () => {
  const pIds = ['participant_alpha', 'participant_beta', 'participant_gamma'];
  const distribution = distributeTeamQuestions({
    participantIds: pIds,
    configuration: {
      questionCount: 15,
      categoryMode: 'mixed',
      difficulty: 'mixed',
    },
  });

  assert.equal(distribution.success, true);
  assert.equal(distribution.distributions.participant_alpha.length, 15);
  assert.equal(distribution.distributions.participant_beta.length, 15);
  assert.equal(distribution.distributions.participant_gamma.length, 15);

  const allIds = [
    ...distribution.distributions.participant_alpha.map((q) => q.id),
    ...distribution.distributions.participant_beta.map((q) => q.id),
    ...distribution.distributions.participant_gamma.map((q) => q.id),
  ];

  const uniqueSet = new Set(allIds);
  assert.equal(uniqueSet.size, 45, 'All 45 questions assigned to the 3 players must be distinct');
});
