const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = path.join(__dirname, 'database');

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

async function exportDatabase() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn');
  console.log('Connected to DB');

  const collections = await mongoose.connection.db.listCollections().toArray();
  
  for (let collection of collections) {
    const name = collection.name;
    const documents = await mongoose.connection.db.collection(name).find({}).toArray();
    
    const filePath = path.join(dbPath, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
    console.log(`Exported ${documents.length} documents from ${name} to ${filePath}`);
  }

  console.log('Database exported successfully!');
  process.exit(0);
}

exportDatabase().catch(err => {
  console.error(err);
  process.exit(1);
});
