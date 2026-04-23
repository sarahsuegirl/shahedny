const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  data: Object
});
const Store = mongoose.model('Store', storeSchema);

const INITIAL_STATE = {
  users: [],
  products: [],
  bookings: [],
  availability: {
    days: ['Monday', 'Wednesday', 'Friday'],
    times: { start: '09:00', end: '17:00' }
  },
  ledger: []
};

let memoryCache = { ...INITIAL_STATE };
let isLoaded = false;

// Will be called by server.js exactly once on boot
async function loadDatabaseFromMongo() {
  try {
    const doc = await Store.findOne({ key: 'shahedny_db' });
    if (doc && doc.data) {
      memoryCache = { ...INITIAL_STATE, ...doc.data };
      console.log('[DB] Loaded data from MongoDB cluster!');
    } else {
      console.log('[DB] No data found in Mongo, initializing fresh DB...');
      await Store.create({ key: 'shahedny_db', data: memoryCache });
    }
  } catch (err) {
    console.error('[DB] Failed to load from Mongo:', err);
  }
}

// Write the entire database back to Mongo silently
function writeToMongo() {
  Store.updateOne({ key: 'shahedny_db' }, { data: memoryCache }, { upsert: true })
    .catch(err => console.error('[DB] Failed background Mongo sync:', err));
}

const db = {
  get: (collection) => {
    return memoryCache[collection];
  },

  set: (collection, value) => {
    memoryCache[collection] = value;
    writeToMongo();
    return value;
  },

  push: (collection, item) => {
    if (!Array.isArray(memoryCache[collection])) memoryCache[collection] = [];
    memoryCache[collection].push(item);
    writeToMongo();
    return item;
  },
  
  loadDatabaseFromMongo
};

module.exports = db;
