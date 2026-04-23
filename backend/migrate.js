const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const storeSchema = new mongoose.Schema({ key: { type: String, unique: true }, data: Object });
  const Store = mongoose.model('Store', storeSchema);
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const data = JSON.parse(raw);
  
  await Store.updateOne({ key: 'shahedny_db' }, { data: data }, { upsert: true });
  console.log('Successfully migrated local data!');
  process.exit(0);
});
