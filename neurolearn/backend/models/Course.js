const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true }
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topicsCount: { type: Number, required: true },
  icon: { type: String, required: true },
  difficulty: { type: String, required: true },
  desc: { type: String },
  category: { type: String },
  enrolled: { type: Number, default: 0 },
  topics: [TopicSchema]
});

module.exports = mongoose.model('Course', CourseSchema);
