const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Models
const Course = require('./models/Course.model');
const Question = require('./models/Question.model');

// Data
const coursesData = require('../database/database/courses.json');
const questionsData = require('../database/database/questions.json');

const MONGO_URI = 'mongodb://127.0.0.1:27017/neurolearn';

async function seedBulk() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing courses and questions.');

    // Adjust Core Subjects
    const coreMapping = {
      'Data Structures & Algorithms': { newTitle: 'Data Structure', cat: 'Core Subjects' },
      'Computer Networks': { newTitle: 'CN', cat: 'Core Subjects' },
      'Operating Systems': { newTitle: 'OS', cat: 'Core Subjects' },
      'Database Design': { newTitle: 'DBMS', cat: 'Core Subjects' },
      'Computer Organization': { newTitle: 'COA', cat: 'Core Subjects' }
    };

    // Prepare courses
    coursesData.forEach(c => {
      // Create new ObjectIds if they are string IDs, else use as is
      // But we can just pass the raw data in and Mongoose creates correct ObjectIds 
      delete c.__v;
      
      if (coreMapping[c.title]) {
        const mapping = coreMapping[c.title];
        c.title = mapping.newTitle;
        c.category = mapping.cat;
      }
    });

    const insertedCourses = await Course.insertMany(coursesData);
    console.log(`Successfully inserted ${insertedCourses.length} courses.`);

    // Build a map of Topic Title -> new Topic ID
    const topicIdMap = {};
    insertedCourses.forEach(course => {
      course.topics.forEach(topic => {
        topicIdMap[topic.title] = topic._id.toString();
      });
    });

    // Prepare questions
    const finalQuestions = [];
    let unmatched = 0;

    questionsData.forEach(q => {
      delete q.__v;
      delete q._id; // Let Mongo generate new question IDs to avoid conflicts
      
      const realTopicId = topicIdMap[q.topic];
      if (realTopicId) {
        q.topicId = realTopicId;
        finalQuestions.push(q);
      } else {
        unmatched++;
      }
    });

    if (finalQuestions.length > 0) {
      await Question.insertMany(finalQuestions);
      console.log(`Successfully inserted ${finalQuestions.length} questions.`);
    }

    if (unmatched > 0) {
      console.log(`Warning: ${unmatched} questions could not be matched to their topic.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error during bulk seed:', err);
    process.exit(1);
  }
}

seedBulk();
