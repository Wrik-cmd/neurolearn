const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  reason: { type: String, required: true },
  icon: { type: String, required: true },
  xp: { type: Number, required: true },
  isComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
