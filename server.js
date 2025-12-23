import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import partsRoutes from './routes/parts.js';
import configRequestsRoutes from './routes/configRequests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Check if we're on Render
const isRender = !!process.env.RENDER_EXTERNAL_URL || !!process.env.RENDER_URL;
const GRADIO_ENABLED = process.env.ENABLE_GRADIO !== 'false';
const GRADIO_INTERNAL_PORT = 7860;

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

// Gradio Proxy Route (works on Render!)
// This allows Gradio to be accessed through the same port as the backend
if (GRADIO_ENABLED) {
  // Set up proxy immediately - it will wait for Gradio to start
  app.use('/gradio', createProxyMiddleware({
    target: `http://localhost:${GRADIO_INTERNAL_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/gradio': '', // Remove /gradio prefix when forwarding
    },
    ws: true, // Enable websocket support for Gradio
    logLevel: 'silent',
    timeout: 30000, // 30 second timeout
    proxyTimeout: 30000,
    onError: (err, req, res) => {
      // Only log if it's not a connection error (Gradio might still be starting)
      if (err.code !== 'ECONNREFUSED') {
        console.log('⚠️  Gradio proxy error:', err.message);
      }
      if (!res.headersSent) {
        res.status(503).json({ 
          error: 'Gradio service is starting up. Please wait a moment and refresh.',
          message: 'Gradio is available at /gradio once it starts',
          retryAfter: 5
        });
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers for Gradio
      proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    }
  }));
  
  console.log(`✅ Gradio proxy configured at /gradio -> http://localhost:${GRADIO_INTERNAL_PORT}`);
  console.log(`💡 Gradio will be accessible at: /gradio (once it starts)`);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Start Gradio server automatically (if enabled)
      // Now works on Render too! Gradio runs on internal port and is proxied through Express
      if (GRADIO_ENABLED) {
        console.log('🚀 Starting Gradio server...');
        console.log(`📡 Gradio will be available at: ${isRender ? process.env.RENDER_EXTERNAL_URL : 'http://localhost:' + PORT}/gradio`);
        
        // Start Gradio on internal port (works on Render!)
        setTimeout(() => {
          import('./gradio_server/start_gradio.js')
            .then(() => {
              console.log('✅ Gradio server starting on internal port', GRADIO_INTERNAL_PORT);
              console.log('✅ Gradio accessible via proxy at /gradio');
            })
            .catch((err) => {
              console.log('⚠️  Gradio server not started:', err.message);
              console.log('💡 This is optional. The main API server is running.');
              console.log('💡 To disable Gradio, set ENABLE_GRADIO=false');
              console.log('💡 To install Gradio: npm run gradio:install');
            });
        }, 500); // Start Gradio quickly so proxy can connect
      } else {
        console.log('ℹ️  Gradio is disabled (ENABLE_GRADIO=false)');
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

