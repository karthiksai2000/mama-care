import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`[MaMa Care] API running on port ${port}`);
    });
  } catch (error) {
    console.error('[MaMa Care] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
