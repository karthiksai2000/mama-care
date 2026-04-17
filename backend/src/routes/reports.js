import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import Report from '../models/Report.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 10);
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSizeBytes },
});

router.post('/upload', optionalAuth, upload.single('report'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Missing report file.' });
  }

  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not ready.' });
    }

    const bucket = new GridFSBucket(db, { bucketName: 'reports' });
    const uniqueName = `${crypto.randomBytes(16).toString('hex')}-${req.file.originalname}`;

    const uploadStream = bucket.openUploadStream(uniqueName, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        uploadedBy: req.user?.id || null,
      },
    });

    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', (file) => resolve(file._id));
      uploadStream.on('error', reject);
      uploadStream.end(req.file.buffer);
    });

    const report = await Report.create({
      userId: req.user?.id || null,
      fileId,
      filename: uniqueName,
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
    });

    return res.json({
      success: true,
      reportId: report._id,
      fileId: report.fileId,
      message: 'Report uploaded.',
    });
  } catch (error) {
    console.error('[MaMa Care] Report upload failed:', error);
    return res.status(500).json({ success: false, message: 'Upload failed.' });
  }
});

export default router;
