const mongoose = require('mongoose');
const Question = require('./models/Question.model');
const Course = require('./models/Course.model');

const MONGO_URI = 'mongodb://127.0.0.1:27017/neurolearn';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Update Course Titles and Categories
    const updates = [
      { old: 'Data Structures (DSA)', new: 'Data Structure' },
      { old: 'Computer Networks (CN)', new: 'CN' },
      { old: 'Operating Systems (OS)', new: 'OS' },
      { old: 'Database Management (DBMS)', new: 'DBMS' },
      { old: 'Computer Organization (COA)', new: 'COA' }
    ];

    for (const item of updates) {
      await Course.findOneAndUpdate(
        { title: { $in: [item.old, item.new] } },
        { title: item.new, category: 'Core Subjects' }
      );
    }
    console.log('Courses updated successfully');

    // 2. Clear old questions
    await Question.deleteMany({});
    console.log('Cleared old questions');

    // 3. Define Quizzes and Map Topic IDs
    const quizData = [
      { courseTitle: 'Data Structure', topics: [
          { topicName: 'Introduction to Big O Notation', text: 'What is the time complexity of a binary search in a sorted array?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correct: 1 },
          { topicName: 'Arrays & Strings', text: 'Which data structure is best for indexing elements by position?', options: ['Linked List', 'Stack', 'Array', 'Queue'], correct: 2 }
      ]},
      { courseTitle: 'OS', topics: [
          { topicName: 'Processes & Threads', text: 'What is a race condition?', options: ['Two threads access shared data simultaneously', 'Process finishes early', 'Network error', 'CPU scheduler error'], correct: 0 },
          { topicName: 'Memory Management', text: 'What does a page table do?', options: ['Stores files', 'Maps virtual to physical addresses', 'Counts CPU cycles', 'Controls I/O'], correct: 1 }
      ]},
      { courseTitle: 'CN', topics: [
          { topicName: 'OSI Model', text: 'Which layer routes packets across networks?', options: ['Data Link', 'Transport', 'Network', 'Application'], correct: 2 }
      ]}
    ];

    const questionsToInsert = [];

    for (const qSet of quizData) {
      const course = await Course.findOne({ title: qSet.courseTitle });
      if (!course) {
        console.log(`Course not found: ${qSet.courseTitle}`);
        continue;
      }

      for (const quizTopic of qSet.topics) {
        // Find the topic in the course subdocuments
        const topicObj = course.topics.find(t => t.title === quizTopic.topicName);
        if (topicObj) {
          questionsToInsert.push({
            text: quizTopic.text,
            options: quizTopic.options,
            correct: quizTopic.correct,
            topic: quizTopic.topicName,
            topicId: topicObj._id.toString()
          });
        } else {
          console.log(`Topic not found: ${quizTopic.topicName} in ${qSet.courseTitle}`);
        }
      }
    }

    if (questionsToInsert.length > 0) {
      await Question.insertMany(questionsToInsert);
      console.log(`Inserted ${questionsToInsert.length} questions`);
    } else {
      console.log('No questions to insert');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
