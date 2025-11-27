const mongoose = require('mongoose');
require('dotenv').config();

// Use MONGO_URI if provided, otherwise build from DB_HOST/DB_USER/DB_PASSWORD/DB_NAME
const getMongoUri = () => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || '';
  const pass = process.env.DB_PASSWORD || '';
  const db = process.env.DB_NAME || 'memora';
  if (user && pass) {
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}/${db}?authSource=admin`;
  }
  return `mongodb://${host}/${db}`;
};

const mongoUri = getMongoUri();

const initializeDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// Schemas
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const DeckSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Deck = mongoose.models.Deck || mongoose.model('Deck', DeckSchema);

module.exports = { initializeDatabase, User, Deck, mongoose };
