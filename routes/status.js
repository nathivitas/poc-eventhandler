import express from 'express';
import { getStatusesByMcId, updateStatuses } from '../services/dbService.js';

const router = express.Router();

const getRandomResult = () => Math.floor(Math.random() * 3);

router.post('/', async (req, res) => {
  const { mc_id } = req.body;

  console.log(`[INFO] Received /fulfill/status request for mc_id: ${mc_id}`);

  if (!mc_id) {
    console.error('[ERROR] mc_id not provided');
    return res.status(400).json({ error: 'mc_id is required' });
  }

  try {
    const originalData = await getStatusesByMcId(mc_id);

    if (!originalData.length) {
      console.warn(`[WARN] No records found for mc_id: ${mc_id}`);
      return res.status(404).json({ message: 'No records found' });
    }

    const result = getRandomResult();
    const statusMap = {
      0: 'Pending',
      1: 'Submitted to Publisher',
      2: 'Complete'
    };
    const newStatus = statusMap[result];

    console.log(`[INFO] Random result: ${result} → Updating to '${newStatus}'`);

    const affected = await updateStatuses(mc_id, newStatus);

    console.log(`[INFO] Updated ${affected} rows for mc_id: ${mc_id}`);

    res.json({
      mc_id,
      applied_status: newStatus,
      updated_rows: affected,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
