# Gradio Server - Mobile Optimized PC Builder

Experimental Gradio implementation for mobile device usage.
**Part of the Backend repository**

## ⚠️ Important Notes

- **Mobile Focus**: This implementation is optimized for mobile (phone) usage
- **Desktop Limitations**: Desktop support may be limited or unreliable
- **Experimental**: This is a test implementation to validate feasibility
- **Backend Integration**: Uses the same backend API (port 5000)

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js backend server running on port 5000 (same repository)

## Installation

1. Navigate to the gradio_server directory:
   ```bash
   cd backend/gradio_server
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

The Gradio server automatically uses the backend API from the same repository.

Environment variables (optional):
- `PORT`: Backend port (default: 5000)
- `GRADIO_PORT`: Port for Gradio server (default: 7860)
- `GRADIO_SHARE`: Set to `true` for public share link (default: `false`)

## Running the Server

### Option 1: Using npm script (Recommended)

From the backend root directory:
```bash
npm run gradio
```

### Option 2: Direct Python execution

1. Make sure the Node.js backend is running:
   ```bash
   cd backend
   npm start
   ```

2. In a separate terminal, start the Gradio server:
   ```bash
   cd backend/gradio_server
   python app.py
   ```

3. The server will start on `http://localhost:7860`

## Accessing the Interface

### Option 1: Through React App (Frontend)
- Navigate to `http://localhost:5173/gradio` in your browser
- The interface will be embedded in the React application

### Option 2: Direct Access
- Open `http://localhost:7860` directly in your browser
- This gives you the standalone Gradio interface

## Features

- 🔍 **Search Parts**: Search computer components by name or description
- 📦 **Category Filter**: Filter by component category (CPU, GPU, RAM, etc.)
- 💰 **Price Calculator**: Calculate total price for selected parts
- 📱 **Mobile Optimized**: Responsive design for mobile devices
- 🔄 **Real-time Updates**: Connects to backend API for live data

## Mobile Optimization

The interface includes:
- Touch-friendly controls
- Responsive layout
- Optimized font sizes
- Mobile-first design
- Reduced data usage

## Troubleshooting

### Server won't start
- Check if port 7860 is already in use
- Verify Python version: `python --version`
- Ensure all dependencies are installed

### Can't connect to backend
- Verify backend server is running on port 5000
- Check that both servers are in the same repository
- Ensure CORS is enabled on backend

### Interface not loading in React
- Check if Gradio server is running
- Verify `VITE_GRADIO_URL` in frontend `.env` (default: `http://localhost:7860`)
- Check browser console for errors

## Development

To modify the Gradio interface:

1. Edit `backend/gradio_server/app.py` to change the interface
2. Restart the server to see changes
3. The interface will auto-reload in the browser

## Notes

- This is an experimental implementation
- Performance on desktop may vary
- Primary focus is mobile device compatibility
- May require adjustments based on testing results
- Part of the Backend repository structure

