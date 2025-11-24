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

const DeckSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  user_id: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const CardSchema = new Schema({
  deck_id: { type: Schema.Types.ObjectId, ref: 'Deck', required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
  difficulty: { type: String, default: 'medium' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const StudySessionSchema = new Schema({
  user_id: { type: Number, required: true },
  deck_id: { type: Schema.Types.ObjectId, ref: 'Deck', required: true },
  cards_studied: { type: Number, required: true },
  total_cards: { type: Number, required: true },
  duration: { type: Number, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at' } });

const AchievementSchema = new Schema({
  user_id: { type: Number, required: true },
  achievement_type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  points: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'unlocked_at' } });

const Deck = mongoose.models.Deck || mongoose.model('Deck', DeckSchema);
const Card = mongoose.models.Card || mongoose.model('Card', CardSchema);
const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', StudySessionSchema);
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

module.exports = { initializeDatabase, Deck, Card, StudySession, Achievement, mongoose };
