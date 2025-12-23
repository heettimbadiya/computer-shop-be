import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import partsRoutes from './routes/parts.js';
import configRequestsRoutes from './routes/configRequests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/parts', partsRoutes);
app.use('/api/config-requests', configRequestsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Start Gradio server automatically (if enabled)
      if (process.env.ENABLE_GRADIO !== 'false') {
        // Use setTimeout to start Gradio after backend is fully ready
        setTimeout(() => {
          import('./gradio_server/start_gradio.js')
            .then(() => {
              console.log('✅ Gradio server starting...');
            })
            .catch((err) => {
              console.log('⚠️  Gradio server not started:', err.message);
              console.log('💡 This is optional. The main API server is running.');
              console.log('💡 To disable Gradio, set ENABLE_GRADIO=false');
            });
        }, 1000); // Wait 1 second for backend to be fully ready
      } else {
        console.log('ℹ️  Gradio is disabled (ENABLE_GRADIO=false)');
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

