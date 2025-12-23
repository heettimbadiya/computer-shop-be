import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import http from 'http';
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

// Gradio health check endpoint
app.get('/api/gradio/health', (req, res) => {
  if (!GRADIO_ENABLED) {
    return res.json({ 
      status: 'disabled', 
      message: 'Gradio is disabled',
      enabled: false 
    });
  }
  
  // Flag to ensure we only send one response
  let responseSent = false;
  
  const sendResponse = (data) => {
    if (!responseSent) {
      responseSent = true;
      res.json(data);
    }
  };
  
  // Try to check if Gradio is running
  const options = {
    hostname: 'localhost',
    port: GRADIO_INTERNAL_PORT,
    path: '/gradio', // Use /gradio path since Gradio's root_path expects it
    method: 'GET',
    timeout: 2000
  };
  
  const gradioReq = http.request(options, (gradioRes) => {
    // Check status code
    if (gradioRes.statusCode >= 200 && gradioRes.statusCode < 300) {
      sendResponse({ 
        status: 'running', 
        message: 'Gradio is running',
        enabled: true,
        port: GRADIO_INTERNAL_PORT,
        url: '/gradio'
      });
    } else {
      sendResponse({ 
        status: 'not_running', 
        message: 'Gradio is not responding correctly',
        enabled: true,
        error: `HTTP ${gradioRes.statusCode}`,
        suggestion: 'Gradio may still be starting up. Please wait a moment and refresh.'
      });
    }
  });
  
  gradioReq.on('error', (err) => {
    sendResponse({ 
      status: 'not_running', 
      message: 'Gradio is not running yet',
      enabled: true,
      error: err.message,
      suggestion: 'Gradio may still be starting up. Please wait a moment and refresh.'
    });
  });
  
  gradioReq.on('timeout', () => {
    if (!responseSent) {
      gradioReq.destroy();
      sendResponse({ 
        status: 'timeout', 
        message: 'Gradio is not responding',
        enabled: true,
        suggestion: 'Gradio may still be starting up. Please wait a moment and refresh.'
      });
    }
  });
  
  gradioReq.setTimeout(2000);
  gradioReq.end();
});

// Gradio Proxy Route (works on Render!)
// This allows Gradio to be accessed through the same port as the backend
if (GRADIO_ENABLED) {
  // Set up proxy immediately - it will wait for Gradio to start
  app.use('/gradio', createProxyMiddleware({
    target: `http://localhost:${GRADIO_INTERNAL_PORT}`,
    changeOrigin: true,
    // Keep /gradio prefix - Gradio's root_path="/gradio" expects it
    pathRewrite: {
      '^/gradio': '/gradio', // Keep /gradio prefix for Gradio's root_path
    },
    ws: true, // Enable websocket support for Gradio
    logLevel: 'silent',
    timeout: 30000, // 30 second timeout
    proxyTimeout: 30000,
    followRedirects: true,
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
      proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
      proxyReq.setHeader('X-Forwarded-Host', req.get('host'));
      proxyReq.setHeader('X-Forwarded-Prefix', '/gradio');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers to response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
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

