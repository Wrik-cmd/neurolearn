const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware.js');
const {
  getAllCourses,
  getCourseById,
  getCourseTopics,
  enrollCourse,
  updateTopicProgress
} = require('../controller/course.controller.js');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/:id/topics', getCourseTopics);
router.post('/:id/enroll', auth, enrollCourse);
router.put('/:courseId/topics/:topicId/progress', auth, updateTopicProgress);

module.exports = router;


















/*
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// @route   GET /api/courses
// @desc    Get all courses (with optional progress)
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find();
    
    // In a real app, calculate actual progress from user progress log
    const user = await User.findById(req.user.id);
    
    const response = courses.map(c => ({
      _id: c._id,
      id: c._id, // frontend api.js check uses id sometimes
      title: c.title,
      topics: c.topicsCount,
      icon: c.icon,
      difficulty: c.difficulty,
      desc: c.desc || 'An amazing course designed to boost your skills.',
      category: c.category || 'algorithms',
      enrolled: c.enrolled || Math.floor(Math.random() * 10000) + 1000,
      progress: Math.floor(Math.random() * 100) // fake progress
    }));

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/courses/:id/topics
// @desc    Get course topics
router.get('/:id/topics', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.topics || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.enrolledCourses) user.enrolledCourses = [];
    
    // If not already enrolled
    if (!user.enrolledCourses.includes(req.params.id)) {
      user.enrolledCourses.push(req.params.id);
      await user.save();
    }
    
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/courses/:courseId/topics/:topicId/progress
// @desc    Update course topic progress
router.put('/:courseId/topics/:topicId/progress', auth, async (req, res) => {
  // Mocking the progress update
  res.json({ message: 'Progress updated successfully' });
});

module.exports = router;
*/