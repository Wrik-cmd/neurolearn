const mongoose = require('mongoose');
const Course = require('./models/Course.model.js');
const topicsMap = require('./temp_topics.js');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/neurolearn');
  for (const [title, topicList] of Object.entries(topicsMap)) {
    const topicDocs = topicList.map(t => ({
      title: t,
      description: 'Module covering ' + t,
      content: 'Detailed interactive content for ' + t + ' goes here.'
    }));
    await Course.updateOne({ title }, { $set: { topics: topicDocs } });
  }
  console.log('Successfully updated topics.');
  process.exit();
}

run().catch(console.error);
