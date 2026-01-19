import express from 'express';
import { db } from '../index.js';
import { authMiddleware, adminMiddleware } from './auth.js';

const router = express.Router();
router.use(authMiddleware);
router.use(adminMiddleware);

// ===== GET SYSTEM LOGS =====
router.get('/logs', async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;
    
    // Could query a logs table or return server logs
    const [rows] = await db.execute(
      'SELECT * FROM system_logs ORDER BY created_date DESC LIMIT ?',
      [parseInt(limit)]
    );
    
    res.json(rows);
  } catch (error) {
    // If logs table doesn't exist, return empty array
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.json([]);
    }
    next(error);
  }
});

// ===== DATABASE MANAGEMENT =====
router.post('/database/backup', async (req, res, next) => {
  try {
    // Placeholder for database backup logic
    res.json({ success: true, message: 'Backup initiated' });
  } catch (error) {
    next(error);
  }
});

router.get('/database/stats', async (req, res, next) => {
  try {
    const [tables] = await db.execute('SHOW TABLES');
    const stats = [];
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [rows] = await db.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      stats.push({ table: tableName, rows: rows[0].count });
    }
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// ===== SYSTEM SETTINGS =====
router.get('/settings', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM system_settings');
    res.json(rows);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.json([]);
    }
    next(error);
  }
});

router.post('/settings', async (req, res, next) => {
  try {
    const { key, value } = req.body;
    
    await db.execute(
      'INSERT INTO system_settings (id, setting_key, setting_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [crypto.randomUUID(), key, value, value]
    );
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
