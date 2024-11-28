import express from 'express';
import {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getTransactions);
router.get('/initialize', initializeDatabase);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);
router.get('/combined', getCombinedData);

export default router;
