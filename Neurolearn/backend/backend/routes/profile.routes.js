const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware.js');
const {
  getProfile,
  updateProfile,
  updatePassword,
  getAchievements
} = require('../controller/profile.controller.js');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.put('/password', auth, updatePassword);
router.get('/achievements', auth, getAchievements);

module.exports = router;


















/*
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
router.put('/', auth, async (req, res) => {
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
});

// @route   PUT /api/profile/password
// @desc    Update password
router.put('/password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    let user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid current password' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/profile/achievements
// @desc    Get achievements
router.get('/achievements', auth, (req, res) => {
  res.json([
    { title: 'First Steps', desc: 'Complete first lesson', date: '2023-10-01' },
    { title: 'Quiz Master', desc: 'Score 100% on 3 quizzes', date: '2023-11-15' }
  ]);
});

module.exports = router;
*/