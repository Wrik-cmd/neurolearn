const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware.js');
const {
  getQuestions,
  submitQuiz,
  getResults,
  getHistory
} = require('../controller/quiz.controller.js'); 

router.get('/history', auth, getHistory);
router.get('/results/:attemptId', auth, getResults);
router.get('/:topicId/questions', getQuestions);
router.post('/:topicId/submit', auth, submitQuiz);

module.exports = router;


















/*
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Question = require('../models/Question');

// @route   GET /api/quiz/:topicId/questions
// @desc    Get questions for a topic
router.get('/:topicId/questions', auth, async (req, res) => {
  try {
    const questions = await Question.find({ 
      $or: [
        { topicId: req.params.topicId },
        { topic: req.params.topicId }
      ]
    });
    if (!questions.length) {
      // Fallback fallback if no seeded data
      return res.json([
        {
          id: 1, text: 'Fallback: What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correct: 1, topic: 'Algorithms'
        }
      ]);
    }
    
    res.json(questions.map(q => ({
      id: q._id, text: q.text, options: q.options, correct: q.correct, topic: q.topic
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/quiz/:topicId/submit
// @desc    Submit quiz answers
router.post('/:topicId/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    // In real app, calculate score based on req.body.answers matches with DB correct answers
    let score = Math.floor(Math.random() * 40) + 60; // Random score 60-100
    
    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.quizzesTaken += 1;
    user.stats.avgScore = ((user.stats.avgScore * (user.stats.quizzesTaken - 1)) + score) / user.stats.quizzesTaken;
    user.xp += score * 10;
    
    await user.save();
    res.json({ attemptId: Math.floor(Math.random() * 1000), score });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/quiz/results/:attemptId
// @desc    Get quiz results by attempt
router.get('/results/:attemptId', auth, (req, res) => {
  res.json({
    score: 85,
    details: 'You did well on algorithms but struggled with CSS.'
  });
});

// @route   GET /api/quiz/history
// @desc    Get quiz history
router.get('/history', auth, (req, res) => {
  res.json([
    { text: 'Completed Quiz: Arrays & Strings', score: 85, date: new Date() }
  ]);
});

module.exports = router;
*/