const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
