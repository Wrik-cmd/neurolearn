const bcrypt = require('bcryptjs');
const User = require('../models/User.model.js');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    let user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAchievements = (req, res) => {
  res.json([
    { title: 'First Steps', desc: 'Complete first lesson', date: '2023-10-01' },
    { title: 'Quiz Master', desc: 'Score 100% on 3 quizzes', date: '2023-11-15' }
  ]);
};