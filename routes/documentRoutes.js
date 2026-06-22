import express from 'express';
import { getMyDocuments, ingestUrl } from '../controllers/documentController';
import { protect } from '../middleware/auth.js';

const router= express.Router();
router.use(protect);

router.post('/ingest', ingestUrl);
router.get('/', getMyDocuments);

export default router;