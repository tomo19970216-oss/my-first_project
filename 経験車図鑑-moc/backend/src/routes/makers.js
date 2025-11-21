import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const makers = db.prepare('SELECT * FROM makers').all();
    res.json({ makers });
  } catch (error) {
    console.error('Error fetching makers:', error);
    res.status(500).json({ error: 'Failed to fetch makers' });
  }
});

export default router;
