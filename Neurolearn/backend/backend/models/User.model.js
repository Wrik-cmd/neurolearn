const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  avatar: { type: String, default: 'AC' },
  stats: {
    quizzesTaken: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('User', UserSchema);
