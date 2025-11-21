import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { maker_id } = req.query;
    
    if (!maker_id) {
      return res.status(400).json({ error: 'maker_id is required' });
    }
    
    const models = db.prepare(`
      SELECT car_id, model_name, segment, rarity 
      FROM car_masters 
      WHERE maker_id = ?
      ORDER BY model_name
    `).all(maker_id);
    
    res.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

export default router;
