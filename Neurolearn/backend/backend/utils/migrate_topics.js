const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const ObjectAst = require('vm'); // Actually, let's just parse the HTML text

dotenv.config();

const html = fs.readFileSync('../frontend/course.html', 'utf8');
const match = html.match(/const topicsMap = (\{[\s\S]*?\});/);
if (!match) throw new Error('Could not find topicsMap in course.html');

let topicsMap = {};
eval('topicsMap = ' + match[1]); // Safe since it's our own code

const Course = require('./models/Course'); // Ensure this points to right model

async function seedTopics() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn');
  console.log('Connected to DB');

  const courses = await Course.find();
  let totalTopics = 0;

  for (let c of courses) {
    const courseTitle = c.title;
    const subtopics = topicsMap[courseTitle] || Array.from({length: c.topicsCount || 10}, (_, i) => `Topic ${i+1}`);
    
    c.topics = subtopics.map(topicTitle => {
      totalTopics++;
      
      // We will generate a smart generic HTML content for lessons based on the topic tile
      let extraHtml = '';
      if (topicTitle.toLowerCase().includes('binary search')) {
        extraHtml = `<p>The algorithm works by maintaining two pointers — <code style="color:var(--neon-green);background:rgba(57,255,20,0.08);padding:0.1rem 0.4rem;border-radius:4px;">left</code> and <code style="color:var(--neon-green);background:rgba(57,255,20,0.08);padding:0.1rem 0.4rem;border-radius:4px;">right</code>.</p>
        <div class="code-block">
          <span class="code-lang">JavaScript</span>
          <pre>function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while(left <= right){
    let mid = Math.floor((left+right)/2);
    if(arr[mid]===target) return mid;
    arr[mid] < target ? left=mid+1 : right=mid-1;
  }
  return -1;
}</pre>
        </div>`;
      } else {
        extraHtml = `
          <p>Key learning objectives for <strong>${topicTitle}</strong> include grasping the core syntax and understanding its fundamental principles. This foundational knowledge is essential for mastering the broader context of ${courseTitle}.</p>
          <div class="callout tip">
            <span class="callout-icon">💡</span>
            <div class="callout-body"><strong>Pro Tip:</strong> Focus on practicing this concept iteratively. Hands-on application reinforces theoretical understanding significantly!</div>
          </div>
          <h3>Practical Applications</h3>
          <p>This subtopic forms the critical framework for many real-world architectures. Ensuring you memorize the best practices associated with it will save you hours debugging later down the line.</p>
        `;
      }

      return {
        title: topicTitle,
        description: `Deep dive comprehensively into ${topicTitle} within the context of ${courseTitle}. Master all critical nuances and best practices required to leverage this skill at a professional level.`,
        content: `
          <p>Welcome to the ultimate mastery module on <strong>${topicTitle}</strong>. Here you will learn how it forms the backbone of ${courseTitle} and how senior engineers leverage it to solve complex challenges.</p>
          ${extraHtml}
        `
      }
    });

    c.topicsCount = subtopics.length;
    await c.save();
    console.log(`Updated Course: ${courseTitle} with ${subtopics.length} topics`);
  }

  console.log(`Successfully migrated ${totalTopics} subtopics into the database!`);
  process.exit(0);
}

seedTopics().catch(err => {
  console.error(err);
  process.exit(1);
});
