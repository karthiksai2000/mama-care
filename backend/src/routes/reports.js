import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import Report from '../models/Report.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 10);
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSizeBytes },
});

router.post('/upload', requireAuth, upload.single('report'), async (req, res) => {
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
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
      uploadStream.end(req.file.buffer);
    });

    const report = await Report.create({
      userId: req.user.id,
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

router.get('/', requireAuth, async (req, res) => {
  const reports = await Report.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .select('originalName size contentType createdAt analysisStatus');

  return res.json({ reports });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, userId: req.user.id });
  if (!report) {
    return res.status(404).json({ message: 'Report not found.' });
  }

  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: 'Database not ready.' });
    }

    const bucket = new GridFSBucket(db, { bucketName: 'reports' });
    await bucket.delete(report.fileId);
    await report.deleteOne();

    return res.json({ success: true });
  } catch (error) {
    console.error('[MaMa Care] Report delete failed:', error);
    return res.status(500).json({ message: 'Failed to delete report.' });
  }
});

export default router;
