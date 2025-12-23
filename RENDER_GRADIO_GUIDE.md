# Gradio on Render - Important Information

## ⚠️ Render Limitation

**Render's free tier does NOT support multiple ports per service.**

This means:
- Your backend runs on port 10000 (Render's default)
- Gradio needs port 7860
- **You cannot run both on the same Render service**

## Solutions

### Option 1: Disable Gradio on Render (Recommended)

Set this environment variable in Render:
```
ENABLE_GRADIO=false
```

This way:
- ✅ Backend works perfectly on Render
- ✅ Gradio is disabled (no errors)
- ✅ Use Gradio locally when needed

### Option 2: Separate Render Service for Gradio

Create a **new Web Service** in Render for Gradio:

1. **New Service Settings:**
   - **Name**: `pc-builder-gradio` (or similar)
   - **Environment**: Python
   - **Build Command**: `pip install -r gradio_server/requirements.txt`
   - **Start Command**: `python gradio_server/app.py`

2. **Environment Variables:**
   ```
   PORT=7860
   RENDER_URL=https://your-backend.onrender.com
   BACKEND_API_URL=https://your-backend.onrender.com/api
   ```

3. **Update Frontend:**
   In your frontend `.env`:
   ```
   VITE_GRADIO_URL=https://your-gradio-service.onrender.com
   ```

### Option 3: Use Locally Only

- Run backend locally to use Gradio
- Deploy backend to Render for production
- Use standard Configurator/Items pages on Render

## Current Behavior

When Gradio tries to start on Render:
- ❌ It will fail (port 7860 not accessible)
- ✅ Backend continues running normally
- ✅ Frontend shows helpful message
- ✅ No crashes or errors

## Recommendation

**For production on Render:**
1. Set `ENABLE_GRADIO=false` in Render environment variables
2. Use the standard React interface (Configurator/Items)
3. Run Gradio locally for development/testing

**For development:**
- Run everything locally
- Gradio works perfectly on localhost

## Frontend Detection

The frontend now automatically detects Render URLs and shows a helpful message explaining why Gradio isn't available, with links to alternative pages.

