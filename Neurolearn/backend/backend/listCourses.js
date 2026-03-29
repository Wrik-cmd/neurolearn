require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course.model');

async function list() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn');
    const courses = await Course.find({}, 'title difficulty');
    console.log("courses:");
    courses.forEach(c => console.log(`${c.title}: ${c.difficulty}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

list();
