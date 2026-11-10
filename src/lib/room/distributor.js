import { loadAllQuestionBanks, shuffleArray } from '../questions/loader.js';

/**
 * Distributes unique, non-overlapping question sets to each team participant.
 *
 * @param {Object} params
 * @param {string[]} params.participantIds - Array of participant IDs (length 2 to 3)
 * @param {Object} params.configuration - Room configuration
 * @param {number} [params.configuration.questionCount=10] - Number of questions per participant
 * @param {string} [params.configuration.categoryMode='mixed'] - 'mixed', 'selected', or 'random'
 * @param {string[]} [params.configuration.categories=[]] - Categories selected by host
 * @param {string} [params.configuration.difficulty='mixed'] - 'easy', 'medium', 'hard', 'mixed'
 * @param {boolean} [params.configuration.randomizeQuestions=true] - Shuffle questions
 * @param {boolean} [params.configuration.randomizeOptions=true] - Shuffle option choices
 *
 * @returns {{ success: boolean, distributions?: Object.<string, Object[]>, error?: string }}
 */
export function distributeTeamQuestions({
  participantIds = [],
  configuration = {},
}) {
  const participantCount = participantIds.length;
  if (participantCount < 2 || participantCount > 3) {
    return {
      success: false,
      error: 'Pertandingan tim membutuhkan minimal 2 dan maksimal 3 peserta.',
    };
  }

  const questionCountPerPlayer = parseInt(configuration.questionCount, 10) || 10;
  const totalQuestionsNeeded = questionCountPerPlayer * participantCount;

  const { questionsMap } = loadAllQuestionBanks();
  let candidatePool = Array.from(questionsMap.values());

  const {
    categoryMode = 'mixed',
    categories = [],
    difficulty = 'mixed',
    randomizeQuestions = true,
    randomizeOptions = true,
  } = configuration;

  // Filter by selected categories if categoryMode is 'selected' or specific categories are given
  if (categoryMode === 'selected' && Array.isArray(categories) && categories.length > 0) {
    candidatePool = candidatePool.filter(
      (q) => categories.includes(q.categorySlug) || categories.includes(q.category)
    );
  }

  // Filter by difficulty if specified
  if (difficulty && difficulty !== 'mixed') {
    candidatePool = candidatePool.filter((q) => q.difficulty === difficulty.toLowerCase());
  }

  // Check if bank has enough questions for zero duplication across all players
  if (candidatePool.length < totalQuestionsNeeded) {
    return {
      success: false,
      error: `Bank soal tidak mencukupi untuk ${participantCount} peserta tanpa duplikasi. Dibutuhkan ${totalQuestionsNeeded} soal unik, namun hanya tersedia ${candidatePool.length} soal sesuai filter.`,
    };
  }

  // Shuffle the candidate pool
  const shuffledPool = shuffleArray(candidatePool);

  const distributions = {};

  // Slice unique non-overlapping segments for each participant
  participantIds.forEach((pId, idx) => {
    const startIdx = idx * questionCountPerPlayer;
    const endIdx = startIdx + questionCountPerPlayer;
    let playerQuestions = shuffledPool.slice(startIdx, endIdx);

    if (randomizeQuestions) {
      playerQuestions = shuffleArray(playerQuestions);
    }

    // Apply option randomization independently per player if configured
    playerQuestions = playerQuestions.map((q) => {
      let options = [...q.options];
      if (randomizeOptions) {
        options = shuffleArray(options);
      }
      return {
        ...q,
        options,
      };
    });

    distributions[pId] = playerQuestions;
  });

  return {
    success: true,
    distributions,
  };
}
