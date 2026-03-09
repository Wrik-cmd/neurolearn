const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

async function addMoreQuestions() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn');
  console.log('Connected to DB');

  // get existing unique topics to know where to add
  const baseQuestions = await Question.find({});
  const topicsMap = {};
  
  // Count how many questions each topic has
  const topicsCountMap = {};
  
  baseQuestions.forEach(q => {
    if (!topicsMap[q.topic]) {
      topicsMap[q.topic] = q.topicId;
    }
    topicsCountMap[q.topic] = (topicsCountMap[q.topic] || 0) + 1;
  });
  
  const newQuestions = [];
  const genericQuestions = [
    { text: "What is the primary architectural purpose behind using {topic}?", options: ["To strictly enforce procedural programming constraints.", "To solve specific computational or design problems efficiently.", "To arbitrarily increase the complexity of the codebase.", "To bypass modern security standards entirely."], correct: 1 },
    { text: "When dealing with {topic}, which anti-pattern should developers strictly avoid?", options: ["Ignoring edge-cases and failing silently.", "Writing comprehensive unit tests.", "Refactoring redundant code logic.", "Documenting constraints properly."], correct: 0 },
    { text: "Which debugging technique is most critical when troubleshooting {topic}?", options: ["Deleting the repository and starting over.", "Relying entirely on end-user bug reports.", "Isolating variables, checking application logs, and using breakpoints.", "Randomly changing parameters until it works."], correct: 2 },
    { text: "How does mastering {topic} impact your overall system infrastructure?", options: ["It causes immediate server crashes.", "It generally makes the code run 10x slower but safer.", "It significantly improves performance, maintainability, and scalability.", "It completely eliminates the need for any other technologies."], correct: 2 },
    { text: "Which foundational concept heavily interacts with {topic}?", options: ["General Object-Oriented Principles.", "The underlying runtime environment mechanisms.", "Both A and B depending on the ecosystem.", "Hardware register assignments."], correct: 2 },
    { text: "What defines the lifecycle of objects or operations associated with {topic}?", options: ["Event loops and memory allocators.", "Manual garbage collection only.", "They persist forever unconditionally.", "Random timeouts."], correct: 0 },
    { text: "In a collaborative environment, how should {topic} be managed?", options: ["Kept secret from junior developers.", "Documented thoroughly with reproducible examples.", "Changes made directly into the main branch.", "Only configured locally."], correct: 1 },
    { text: "What is a common misconception about {topic}?", options: ["It is a magical silver bullet for all problems.", "It requires an understanding of basic syntax.", "It can be optimized with proper logic.", "It was developed by software engineers."], correct: 0 },
    { text: "When scaling an application relying on {topic}, developers must monitor:", options: ["The font size of the application.", "Resource allocation, bottlenecks, and memory footprints.", "How many monitors the developers are using.", "Nothing, it scales automatically endlessly."], correct: 1 }
  ];
  
  for (const [topic, topicId] of Object.entries(topicsMap)) {
    let currentQuestionsCount = topicsCountMap[topic] || 0;
    
    // We want exactly 10 total questions per topic
    if (currentQuestionsCount < 10) {
      let needed = 10 - currentQuestionsCount;
      
      for (let i = 0; i < needed; i++) {
        // pick a generic template, looping around if we run out
        const qTemplate = genericQuestions[(currentQuestionsCount - 1 + i) % genericQuestions.length];
        
        newQuestions.push({
            text: qTemplate.text.replace(/{topic}/g, topic),
            options: qTemplate.options,
            correct: qTemplate.correct,
            topic: topic,
            topicId: topicId
        });
      }
    }
  }

  if (newQuestions.length > 0) {
    await Question.insertMany(newQuestions);
    console.log(`Successfully generated and inserted ${newQuestions.length} new dynamic questions! Each topic now has 10 total questions.`);
  } else {
     console.log('All topics already have 10 questions.');
  }
  
  process.exit(0);
}

addMoreQuestions().catch(err => {
  console.error(err);
  process.exit(1);
});
