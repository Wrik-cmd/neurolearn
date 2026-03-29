exports.getRecommendations = (req, res) => {
  res.json([
    { id: 1, topic: 'Recursion', difficulty: 'Medium', reason: 'Weak area detected', icon: '🔄', xp: 120 },
    { id: 2, topic: 'Memoization', difficulty: 'Medium', reason: 'Next in sequence', icon: '💾', xp: 150 },
    { id: 3, topic: 'Binary Search Trees', difficulty: 'Hard', reason: 'High impact topic', icon: '🌲', xp: 200 },
  ]);
};

exports.dismissRecommendation = (req, res) => {
  res.json({ message: 'Dismissed successfully' });
};

exports.completeRecommendation = (req, res) => {
  res.json({ message: 'Marked as complete' });
};