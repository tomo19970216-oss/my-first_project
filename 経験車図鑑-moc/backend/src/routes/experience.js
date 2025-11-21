import express from 'express';
import db from '../db/index.js';

const router = express.Router();

const EXPERIENCE_POINTS = {
  'saw': 1,      // 見た
  'rode': 2,     // 乗った
  'drove': 5,    // 運転した
  'owned': 10    // 所持した
};

router.get('/', (req, res) => {
  try {
    const user_id = 1; // Fixed for MoC
    
    const experiences = db.prepare(`
      SELECT 
        e.id,
        e.user_id,
        e.car_id,
        e.experience_type,
        e.points,
        e.note,
        e.created_at,
        c.maker_name,
        c.model_name,
        c.segment,
        c.rarity
      FROM experiences e
      JOIN car_masters c ON e.car_id = c.car_id
      WHERE e.user_id = ?
      ORDER BY e.created_at DESC
    `).all(user_id);
    
    res.json({ experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user_id = 1; // Fixed for MoC
    
    const experience = db.prepare(`
      SELECT 
        e.id,
        e.user_id,
        e.car_id,
        e.experience_type,
        e.points,
        e.note,
        e.created_at,
        c.maker_name,
        c.model_name,
        c.segment,
        c.rarity
      FROM experiences e
      JOIN car_masters c ON e.car_id = c.car_id
      WHERE e.id = ? AND e.user_id = ?
    `).get(id, user_id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    res.json({ experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

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

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { car_id, experience_type, note } = req.body;
    const user_id = 1; // Fixed for MoC
    
    const existingExperience = db.prepare(`
      SELECT * FROM experiences WHERE id = ? AND user_id = ?
    `).get(id, user_id);
    
    if (!existingExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    const updatedCarId = car_id !== undefined ? car_id : existingExperience.car_id;
    const updatedExperienceType = experience_type !== undefined ? experience_type : existingExperience.experience_type;
    const updatedNote = note !== undefined ? note : existingExperience.note;
    
    if (!EXPERIENCE_POINTS[updatedExperienceType]) {
      return res.status(400).json({ error: 'Invalid experience_type' });
    }
    
    const car = db.prepare('SELECT rarity FROM car_masters WHERE car_id = ?').get(updatedCarId);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    const basePoints = EXPERIENCE_POINTS[updatedExperienceType];
    const points = basePoints * car.rarity;
    
    db.prepare(`
      UPDATE experiences 
      SET car_id = ?, experience_type = ?, points = ?, note = ?
      WHERE id = ? AND user_id = ?
    `).run(updatedCarId, updatedExperienceType, points, updatedNote, id, user_id);
    
    const experience = db.prepare(`
      SELECT * FROM experiences WHERE id = ?
    `).get(id);
    
    res.json({ experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user_id = 1; // Fixed for MoC
    
    const experience = db.prepare(`
      SELECT * FROM experiences WHERE id = ? AND user_id = ?
    `).get(id, user_id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    db.prepare(`
      DELETE FROM experiences WHERE id = ? AND user_id = ?
    `).run(id, user_id);
    
    res.json({ message: 'Experience deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

export default router;
