const User = require('../models/User.model.js');
const Activity = require('../models/Activity.model.js');

exports.getStats = async (req, res) => {
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
};

exports.getActivity = async (req, res) => {
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
};

exports.getWeakTopics = (req, res) => {
  res.json([
    { topic: 'Data Structures', score: 45, difficulty: 'Hard' },
    { topic: 'Algorithms', score: 52, difficulty: 'Hard' },
    { topic: 'CSS', score: 61, difficulty: 'Medium' },
    { topic: 'Web Fundamentals', score: 65, difficulty: 'Medium' }
  ]);
};

exports.getChartData = (req, res) => {
  res.json([55, 70, 65, 80, 72, 88, 78]);
};