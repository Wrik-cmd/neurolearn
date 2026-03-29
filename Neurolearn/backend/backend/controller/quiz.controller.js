const User = require('../models/User.model.js');
const Question = require('../models/Question.model.js');

// GET /api/quiz/:topicId/questions
// topicId is actually the topic name (e.g. "Arrays & Strings")
exports.getQuestions = async (req, res) => {
  try {
    const topicParam = decodeURIComponent(req.params.topicId);

    // Try exact name match first (case-insensitive)
    let questions = await Question.find({
      topic: { $regex: new RegExp(`^${topicParam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    // If nothing found by exact, try a partial / contains match
    if (!questions.length) {
      questions = await Question.find({
        topic: { $regex: new RegExp(topicParam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
      });
    }

    // If STILL nothing found, fallback to finding questions that contain keywords in their text
    if (!questions.length) {
      const searchTerms = topicParam.replace(/[.*+?^${}()|[\]\\]/g, '').split(' ').filter(w => w.length > 2);
      if (searchTerms.length > 0) {
        questions = await Question.find({
          text: { $regex: new RegExp(searchTerms.join('|'), 'i') }
        });
      }
    }

    if (!questions.length) {
      return res.json([]);
    }

    // Shuffle and return up to 10
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    res.json(shuffled.map(q => ({
      id: q._id,
      text: q.text,
      options: q.options,
      correct: q.correct,
      topic: q.topic
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /api/quiz/:topicId/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    // Calculate real score from submitted answers
    let correctCount = 0;
    if (Array.isArray(answers)) {
      answers.forEach(a => {
        if (a.selected === a.correct) correctCount++;
      });
    }
    const total = answers ? answers.length : 10;
    const score = Math.round((correctCount / total) * 100);

    // Update user stats
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.stats.quizzesTaken += 1;
        user.stats.avgScore = Math.round(
          ((user.stats.avgScore * (user.stats.quizzesTaken - 1)) + score) / user.stats.quizzesTaken
        );
        user.xp += correctCount * 15;
        await user.save();
      }
    } catch (_) {}

    res.json({ attemptId: Date.now(), score, correct: correctCount, total });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getResults = (req, res) => {
  res.json({ score: 85, details: 'Quiz results stored.' });
};

exports.getHistory = (req, res) => {
  res.json([{ text: 'Completed Quiz', score: 85, date: new Date() }]);
};