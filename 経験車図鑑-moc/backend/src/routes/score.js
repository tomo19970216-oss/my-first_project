import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const user_id = 1; // Fixed for MoC
    
    const scoreData = db.prepare(`
      SELECT * FROM user_score WHERE user_id = ?
    `).get(user_id);
    
    if (!scoreData) {
      return res.json({
        user_id,
        score: 0,
        total_cars: 0,
        saw_count: 0,
        rode_count: 0,
        drove_count: 0,
        owned_count: 0
      });
    }
    
    res.json(scoreData);
  } catch (error) {
    console.error('Error fetching score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
});

export default router;
