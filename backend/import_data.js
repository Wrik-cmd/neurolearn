const fs = require('fs');
const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/neurolearn';
const dir = require('path').resolve(__dirname, '../database/database') + '/';
const files = ['courses', 'questions', 'users', 'activities'];

function convertObjectIds(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = convertObjectIds(obj[i]);
    }
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name === 'ObjectId') return obj;
    for (let key in obj) {
      if (key === '_id' && typeof obj[key] === 'string' && obj[key].length === 24) {
        obj[key] = new mongoose.Types.ObjectId(obj[key]);
      } else if (key.endsWith('Id') && typeof obj[key] === 'string' && obj[key].length === 24) {
        obj[key] = new mongoose.Types.ObjectId(obj[key]);
      } else {
        obj[key] = convertObjectIds(obj[key]);
      }
    }
  }
  return obj;
}

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;

    for (let file of files) {
      const path = `${dir}${file}.json`;
      if (fs.existsSync(path)) {
        console.log(`Reading ${path}...`);
        const raw = fs.readFileSync(path, 'utf8');
        if (!raw.trim()) continue;
        
        const data = JSON.parse(raw);
        console.log(`Parsed ${data.length} records for ${file}. Converting ObjectIds...`);
        
        const convertedData = convertObjectIds(data);
        
        if (file === 'courses' || file === 'questions') {
          await db.collection(file).deleteMany({});
        }

        if (convertedData.length > 0) {
          // If the file is 'users', we should be careful to only insert if the user doesn't already exist.
          // For simplicity, we can use insertMany with ordered: false so duplicates (by _id or email) are just skipped.
          try {
            await db.collection(file).insertMany(convertedData, { ordered: false });
            console.log(`Successfully imported records into ${file} collection.`);
          } catch(e) {
            console.log(`Some records in ${file} might already exist or had issues (often normal for existing users).`);
          }
        }
      }
    }
    
    console.log('Import complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error during import:', err);
    process.exit(1);
  }
}

run();
