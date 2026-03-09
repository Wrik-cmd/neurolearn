const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  topic: { type: String, required: true },
  topicId: { type: String, required: true }
});

module.exports = mongoose.model('Question', QuestionSchema);
