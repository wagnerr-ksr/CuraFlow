import express from 'express';
import ExcelJS from 'exceljs';
import { db } from '../index.js';
import { authMiddleware } from './auth.js';

const router = express.Router();
router.use(authMiddleware);

// ===== EXPORT SCHEDULE TO EXCEL =====
router.post('/export', async (req, res, next) => {
  try {
    const { scheduleData, month, year } = req.body;
    
    if (!scheduleData || !month || !year) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dienstplan');
    
    // Add headers and data (simplified version)
    worksheet.columns = [
      { header: 'Datum', key: 'date', width: 12 },
      { header: 'Tag', key: 'day', width: 10 },
      { header: 'Dienst', key: 'shift', width: 20 },
      { header: 'Mitarbeiter', key: 'staff', width: 25 }
    ];
    
    // Add schedule data
    scheduleData.forEach(entry => {
      worksheet.addRow(entry);
    });
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Dienstplan_${year}-${month}.xlsx"`);
    res.send(buffer);
    
  } catch (error) {
    next(error);
  }
});

// ===== SEND SCHEDULE NOTIFICATIONS =====
router.post('/notify', async (req, res, next) => {
  try {
    const { scheduleId, type } = req.body;
    
    // Placeholder - implement actual notification logic
    // Could use email service, push notifications, etc.
    
    res.json({ success: true, message: 'Notifications sent' });
  } catch (error) {
    next(error);
  }
});

export default router;
