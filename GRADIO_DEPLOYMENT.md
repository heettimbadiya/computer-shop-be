# Gradio Deployment Guide for Render

## Overview

Gradio is now integrated to start automatically with the backend server. This guide explains how it works and how to configure it for Render deployment.

## How It Works

1. **Automatic Startup**: When the backend server starts, it automatically launches the Gradio server as a child process
2. **Same Repository**: Gradio is part of the backend repository
3. **Shared Configuration**: Uses the same environment variables and backend API

## Render Deployment

### Option 1: Single Service (Recommended for Testing)

The backend and Gradio run in the same service:

1. **Environment Variables in Render:**
   ```
   PORT=10000
   ENABLE_GRADIO=true
   GRADIO_PORT=7860
   MONGO_URI=your_mongodb_uri
   ```

2. **Build Command:**
   ```bash
   npm install
   ```

3. **Start Command:**
   ```bash
   npm start
   ```

4. **Note**: Render may not allow multiple ports. In this case, you may need to:
   - Run Gradio on a separate Render service, OR
   - Disable Gradio on Render and use it only locally

### Option 2: Separate Services (Recommended for Production)

1. **Backend Service:**
   - Type: Web Service
   - Build: `npm install`
   - Start: `npm start`
   - Port: 10000 (Render default)

2. **Gradio Service (Separate):**
   - Type: Web Service
   - Build: `pip install -r gradio_server/requirements.txt`
   - Start: `python gradio_server/app.py`
   - Port: 7860
   - Environment: Set `RENDER_URL` to your backend URL

### Disabling Gradio on Render

If you don't want Gradio on Render:

Set environment variable:
```
ENABLE_GRADIO=false
```

## Local Development

Gradio starts automatically when you run:
```bash
npm start
```

To disable locally:
```bash
ENABLE_GRADIO=false npm start
```

To run Gradio separately:
```bash
npm run gradio:standalone
```

## Troubleshooting

### Gradio Not Starting

1. Check Python is installed: `python --version`
2. Install dependencies: `pip install -r gradio_server/requirements.txt`
3. Check logs for error messages
4. Verify `ENABLE_GRADIO` is not set to `false`

### Port Conflicts

- Gradio uses port 7860 by default
- Change with `GRADIO_PORT` environment variable
- On Render, you may need separate services for different ports

### Render Limitations

- Render free tier may not support multiple ports
- Consider using a separate Render service for Gradio
- Or disable Gradio on Render and use only locally

## Configuration

### Environment Variables

- `ENABLE_GRADIO`: Enable/disable Gradio (default: true)
- `GRADIO_PORT`: Port for Gradio server (default: 7860)
- `RENDER_URL`: Auto-detected on Render, or set manually
- `GRADIO_SHARE`: Enable public share link (default: false)

## Notes

- Gradio is experimental and mobile-focused
- Desktop support may be limited
- On Render, consider using separate services for better isolation

