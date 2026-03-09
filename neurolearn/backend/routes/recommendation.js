const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET /api/recommendation
// @desc    Get recommendations
router.get('/', auth, (req, res) => {
  res.json([
    { id: 1, topic: 'Recursion', difficulty: 'Medium', reason: 'Weak area detected', icon: '🔄', xp: 120 },
    { id: 2, topic: 'Memoization', difficulty: 'Medium', reason: 'Next in sequence', icon: '💾', xp: 150 },
    { id: 3, topic: 'Binary Search Trees', difficulty: 'Hard', reason: 'High impact topic', icon: '🌲', xp: 200 },
  ]);
});

// @route   DELETE /api/recommendation/:id
// @desc    Dismiss a recommendation
router.delete('/:id', auth, (req, res) => {
  res.json({ message: 'Dismissed successfully' });
});

// @route   PUT /api/recommendation/:id/complete
// @desc    Mark recommendation complete
router.put('/:id/complete', auth, (req, res) => {
  res.json({ message: 'Marked as complete' });
});

module.exports = router;
