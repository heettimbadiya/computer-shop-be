# Gradio Server - Quick Reference

The Gradio server is now part of the **Backend repository**.

## Location
```
backend/
└── gradio_server/
    ├── app.py
    ├── requirements.txt
    └── README.md
```

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend/gradio_server
   pip install -r requirements.txt
   ```

2. **Start backend first:**
   ```bash
   cd backend
   npm start
   ```

3. **Start Gradio (in new terminal):**
   ```bash
   cd backend
   npm run gradio
   ```

## Configuration

The Gradio server automatically connects to the backend API on the same port (5000).

Optional environment variables in `backend/.env`:
```env
PORT=5000              # Backend port
GRADIO_PORT=7860       # Gradio server port
GRADIO_SHARE=false     # Public share link
```

## Access

- **Direct**: `http://localhost:7860`
- **Through Frontend**: `http://localhost:5173/gradio`

## Notes

- Part of Backend repository
- Uses same backend API
- Mobile-optimized
- Experimental implementation

