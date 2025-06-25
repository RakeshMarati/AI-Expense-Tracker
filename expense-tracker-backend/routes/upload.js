import express from 'express';
import upload from '../middleware/upload.js';
import { uploadReceipt } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload.single('receipt'), uploadReceipt);
router.post('/upload', upload.single('receipt'), uploadReceipt);

export default router;