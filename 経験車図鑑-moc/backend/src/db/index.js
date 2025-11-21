import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../../data/dev.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');
const SEEDS_PATH = join(__dirname, 'seeds.sql');

const dataDir = join(__dirname, '../../data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='car_masters'").get();

if (!tableCheck) {
  console.log('Initializing database...');
  
  const schema = readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);
  console.log('Schema created successfully');
  
  const seeds = readFileSync(SEEDS_PATH, 'utf8');
  db.exec(seeds);
  console.log('Seed data inserted successfully');
  
  console.log('Database initialization complete');
} else {
  console.log('Database already initialized');
}

export default db;
