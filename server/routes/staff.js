import express from 'express';
import { db } from '../index.js';
import { authMiddleware } from './auth.js';

const router = express.Router();
router.use(authMiddleware);

// ===== GET STAFF LIST =====
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM doctors ORDER BY name');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// ===== NOTIFY STAFF =====
router.post('/notify', async (req, res, next) => {
  try {
    const { staffIds, message, type } = req.body;
    
    if (!staffIds || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Placeholder for notification logic
    // Implement email/SMS/push notification service here
    
    console.log(`Sending ${type} notification to ${staffIds.length} staff members`);
    
    res.json({ success: true, notified: staffIds.length });
  } catch (error) {
    next(error);
  }
});

export default router;
