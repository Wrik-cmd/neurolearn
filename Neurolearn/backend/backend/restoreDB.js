const mongoose = require('mongoose');
const fs = require('fs');

const Course = require('./models/Course.model.js');
const Question = require('./models/Question.model.js');
const User = require('./models/User.model.js');
const Activity = require('./models/Activity.model.js');

async function restore() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/neurolearn');
    console.log('Connected to DB');

    // Read JSON files
    const coursesData = JSON.parse(fs.readFileSync('../database/database/courses.json', 'utf8'));
    const questionsData = JSON.parse(fs.readFileSync('../database/database/questions.json', 'utf8'));
    
    // Convert string IDs if necessary, or just insert them raw if MongoDB accepts
    // We can use insertMany
    await Course.deleteMany({});
    await Question.deleteMany({});

    // Ensure user request categories are maintained
    // Data Structures, OS, DBMS, CN, Computer Organization -> 'Core Subjects'
    const coreTitles = ['Data Structures & Algorithms', 'Operating Systems', 'Database Design', 'Computer Networks', 'Computer Organization'];
    const webTitles = ['JavaScript Mastery', 'Web Fundamentals', 'React.js Essentials', 'Node.js Mastery', 'Express.js Framework', 'MongoDB Deep Dive'];

    const readyCourses = coursesData.map(c => {
      let doc = { ...c };
      if (doc._id && typeof doc._id === 'object') doc._id = doc._id['$oid'] || doc._id;
      if (doc.__v !== undefined) delete doc.__v;
      
      if (coreTitles.includes(doc.title)) {
        doc.category = 'Core Subjects';
      }
      if (webTitles.includes(doc.title)) {
        doc.category = 'web';
      }
      return doc;
    });

    const readyQuestions = questionsData.map(q => {
      let doc = { ...q };
      if (doc._id && typeof doc._id === 'object') doc._id = doc._id['$oid'] || doc._id;
      if (doc.__v !== undefined) delete doc.__v;
      return doc;
    });

    await Course.insertMany(readyCourses);
    console.log(`Inserted ${readyCourses.length} courses.`);

    await Question.insertMany(readyQuestions);
    console.log(`Inserted ${readyQuestions.length} questions.`);
    
    // Note: We might want to fix user accounts but users.json probably has everything
    
    console.log('Restore complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

restore();
