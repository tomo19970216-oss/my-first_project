import express from 'express';
import db from '../db/index.js';

const router = express.Router();

const EXPERIENCE_POINTS = {
  'saw': 1,      // 見た
  'rode': 2,     // 乗った
  'drove': 5,    // 運転した
  'owned': 10    // 所持した
};

router.post('/', (req, res) => {
  try {
    const { car_id, experience_type, note } = req.body;
    const user_id = 1; // Fixed for MoC
    
    if (!car_id || !experience_type) {
      return res.status(400).json({ error: 'car_id and experience_type are required' });
    }
    
    if (!EXPERIENCE_POINTS[experience_type]) {
      return res.status(400).json({ error: 'Invalid experience_type' });
    }
    
    const car = db.prepare('SELECT rarity FROM car_masters WHERE car_id = ?').get(car_id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    const basePoints = EXPERIENCE_POINTS[experience_type];
    const points = basePoints * car.rarity;
    
    const result = db.prepare(`
      INSERT INTO experiences (user_id, car_id, experience_type, points, note)
      VALUES (?, ?, ?, ?, ?)
    `).run(user_id, car_id, experience_type, points, note || null);
    
    const experience = db.prepare(`
      SELECT * FROM experiences WHERE id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({ experience });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

export default router;
