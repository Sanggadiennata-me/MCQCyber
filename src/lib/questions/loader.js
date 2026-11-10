import fs from 'fs';
import path from 'path';

/**
 * In-memory cache for parsed question files in serverless instance
 */
let cachedCategories = null;
let cachedQuestionsMap = null;

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Loads and caches all questions from the static JSON questions directory
 */
export function loadAllQuestionBanks() {
  if (cachedCategories && cachedQuestionsMap) {
    return { categories: cachedCategories, questionsMap: cachedQuestionsMap };
  }

  const questionsDir = path.join(process.cwd(), 'questions');
  const categories = [];
  const questionsMap = new Map();

  if (!fs.existsSync(questionsDir)) {
    return { categories: [], questionsMap };
  }

  const entries = fs.readdirSync(questionsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const catDirPath = path.join(questionsDir, entry.name);
    const files = fs.readdirSync(catDirPath);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const filePath = path.join(catDirPath, file);

      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);

        if (!parsed.category || !Array.isArray(parsed.questions)) {
          continue;
        }

        const categorySlug = parsed.slug || entry.name;
        let existingCategory = categories.find((c) => c.slug === categorySlug);

        if (!existingCategory) {
          existingCategory = {
            name: parsed.category,
            slug: categorySlug,
            description: parsed.description || '',
            questionsCount: 0,
            difficulties: { easy: 0, medium: 0, hard: 0 },
          };
          categories.push(existingCategory);
        }

        for (const q of parsed.questions) {
          if (!q.id || !q.question || !Array.isArray(q.options) || !q.answer) {
            continue;
          }

          const normalizedQuestion = {
            id: q.id,
            category: parsed.category,
            categorySlug,
            difficulty: (q.difficulty || 'medium').toLowerCase(),
            question: q.question,
            options: q.options.map((opt) => ({
              id: opt.id,
              text: opt.text,
            })),
            answer: q.answer,
            explanation: q.explanation || 'Pembahasan tidak tersedia.',
          };

          questionsMap.set(q.id, normalizedQuestion);
          existingCategory.questionsCount++;
          if (existingCategory.difficulties[normalizedQuestion.difficulty] !== undefined) {
            existingCategory.difficulties[normalizedQuestion.difficulty]++;
          }
        }
      } catch (err) {
        console.error(`Error loading question file ${filePath}:`, err);
      }
    }
  }

  cachedCategories = categories;
  cachedQuestionsMap = questionsMap;

  return { categories, questionsMap };
}

/**
 * Returns available categories and their statistics
 */
export function getCategories() {
  const { categories } = loadAllQuestionBanks();
  return categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    questionsCount: c.questionsCount,
    difficulties: c.difficulties,
  }));
}

/**
 * Selects questions according to configuration filters
 */
export function getFilteredQuestions({
  categories = [], // array of category slugs or 'all'
  difficulty = 'mixed', // 'easy', 'medium', 'hard', 'mixed'
  limit = 10,
  randomizeQuestions = true,
  randomizeOptions = true,
} = {}) {
  const { questionsMap } = loadAllQuestionBanks();
  let pool = Array.from(questionsMap.values());

  // Filter by categories
  if (Array.isArray(categories) && categories.length > 0 && !categories.includes('all')) {
    pool = pool.filter((q) => categories.includes(q.categorySlug) || categories.includes(q.category));
  }

  // Filter by difficulty
  if (difficulty && difficulty !== 'mixed') {
    pool = pool.filter((q) => q.difficulty === difficulty.toLowerCase());
  }

  if (randomizeQuestions) {
    pool = shuffleArray(pool);
  }

  // Slice to limit
  const selected = limit > 0 ? pool.slice(0, limit) : pool;

  // Process options randomization if requested
  return selected.map((q) => {
    let options = [...q.options];
    if (randomizeOptions) {
      options = shuffleArray(options);
    }
    return {
      ...q,
      options,
    };
  });
}

/**
 * SECURITY INVARIANT:
 * Strips answers and explanations from question objects before transmitting to frontend
 */
export function stripAnswers(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.map((q) => ({
    id: q.id,
    category: q.category,
    categorySlug: q.categorySlug,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  }));
}

/**
 * Retrieves authoritative answer details for a list of question IDs
 */
export function getAnswerDetails(questionIds) {
  const { questionsMap } = loadAllQuestionBanks();
  const result = {};

  for (const id of questionIds) {
    const q = questionsMap.get(id);
    if (q) {
      result[id] = {
        id: q.id,
        answer: q.answer,
        explanation: q.explanation,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
        category: q.category,
      };
    }
  }

  return result;
}
