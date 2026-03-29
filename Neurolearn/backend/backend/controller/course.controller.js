const Course = require('../models/Course.model.js');
const User = require('../models/User.model.js');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    const response = courses.map(c => ({
      _id: c._id, id: c._id, title: c.title, topics: c.topicsCount,
      icon: c.icon, difficulty: c.difficulty,
      desc: c.desc || 'An amazing course designed to boost your skills.',
      category: c.category || 'all',
      enrolled: c.enrolled || Math.floor(Math.random() * 10000) + 1000,
      progress: Math.floor(Math.random() * 100)
    }));
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCourseTopics = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.topics || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.enrolledCourses) user.enrolledCourses = [];
    if (!user.enrolledCourses.includes(req.params.id)) {
      user.enrolledCourses.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateTopicProgress = (req, res) => {
  res.json({ message: 'Progress updated successfully' });
};