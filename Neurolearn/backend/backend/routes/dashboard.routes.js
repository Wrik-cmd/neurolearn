const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware.js');
const {
  getStats,
  getActivity,
  getWeakTopics,
  getChartData
} = require('../controller/dashboard.controller.js');

router.get('/stats', auth, getStats);
router.get('/activity', auth, getActivity);
router.get('/weak-topics', auth, getWeakTopics);
router.get('/chart', auth, getChartData);

module.exports = router;


















/*
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity.model');

// @route   GET /api/dashboard/stats
// @desc    Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      quizzesTaken: user.stats.quizzesTaken || 47,
      avgScore: Math.round(user.stats.avgScore) || 78,
      streak: user.stats.streak || 12,
      coursesEnrolled: user.enrolledCourses ? user.enrolledCourses.length : 5
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get user activity
router.get('/activity', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
    if (!activities.length) {
      return res.json([
        { text: 'Completed Quiz: Arrays & Strings', time: '2m ago', type: 'quiz', color: 'cyan' },
        { text: 'Unlocked badge: "Speed Coder"', time: '1h ago', type: 'badge', color: 'purple' },
      ]);
    }
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/weak-topics
// @desc    Get user weak topics
router.get('/weak-topics', auth, async (req, res) => {
  try {
    // In a real app this would analyze the user's past quiz performances.
    // For now we'll send a dynamic selection or fall back.
    const topics = [
      { topic: 'Data Structures', score: 45, difficulty: 'Hard' },
      { topic: 'Algorithms', score: 52, difficulty: 'Hard' },
      { topic: 'CSS', score: 61, difficulty: 'Medium' },
      { topic: 'Web Fundamentals', score: 65, difficulty: 'Medium' }
    ];
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/chart
// @desc    Get chart data
router.get('/chart', auth, async (req, res) => {
  try {
    // Usually aggregated from Activity/Quiz scores by day
    res.json([55, 70, 65, 80, 72, 88, 78]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
*/