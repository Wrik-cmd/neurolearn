const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

async function updateDescriptions() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn');
  console.log('Connected to DB');

  const courses = await Course.find();
  let totalUpdated = 0;

  for (let c of courses) {
    let modified = false;
    
    if (c.topics && c.topics.length > 0) {
      c.topics.forEach(topic => {
        // Generate a larger, more detailed description
        topic.description = `In this comprehensive module, we will explore the fundamental concepts and advanced intricacies of ${topic.title} as it applies to your overall mastery of ${c.title}. You will learn the theoretical underpinnings, examine real-world use cases, and understand how to architect robust solutions utilizing these principles. By the end of this module, you will have developed the practical intuition needed to avoid common anti-patterns and implement industry-standard best practices with absolute confidence. This knowledge forms a critical building block in your journey to becoming a highly proficient engineer in this domain.`;
        
        // Also let's increase the size of the content a little bit for the learn page
        if (!topic.content.includes("Practical Hands-on Examples")) {
          topic.content += `
            <div style="margin-top:2rem;">
              <h3>Practical Hands-on Examples</h3>
              <p>Engineers encountering <strong>${topic.title}</strong> in the wild must quickly identify the optimal approach to integrate it into existing systems. We highly recommend experimenting in a safe sandbox environment to understand its behavior under various edge conditions. When scaling applications, these subtle nuances dictate whether your codebase remains maintainable or becomes a bottleneck.</p>
              <div class="callout warn mt-3">
                <span class="callout-icon">⚡</span>
                <div class="callout-body"><strong>Action Item:</strong> Spend at least 30 minutes coding examples related to this concept today. Active recall and muscle memory are vital!</div>
              </div>
            </div>
          `;
        }
        
        totalUpdated++;
      });
      modified = true;
    }
    
    if (modified) {
      await c.save();
    }
  }

  console.log(`Successfully expanded descriptions and content for ${totalUpdated} topics!`);
  process.exit(0);
}

updateDescriptions().catch(err => {
  console.error(err);
  process.exit(1);
});
