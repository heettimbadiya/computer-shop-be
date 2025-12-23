# Computer Shop Management System - Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/computer-shop
```

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run seed` - Seed the database with sample parts data
- `npm run gradio` - Start the Gradio server (experimental mobile interface)

## Gradio Server (Experimental)

The backend includes an experimental Gradio server for mobile-optimized PC component browsing.

### Setup Gradio

**First time setup - Install dependencies:**

1. Install Python dependencies:
   ```bash
   cd backend/gradio_server
   pip install -r requirements.txt
   ```
   
   Or use npm script:
   ```bash
   npm run gradio:install
   ```

2. Verify installation:
   ```bash
   python -c "import gradio; print('OK')"
   ```

**Running Gradio:**

Gradio starts **automatically** when you start the backend:
```bash
npm start
```

Gradio will start on `http://localhost:7860` automatically.

**Manual start (optional):**
```bash
npm run gradio
```

**Disable Gradio:**
Set environment variable:
```env
ENABLE_GRADIO=false
```

See `gradio_server/README.md` and `gradio_server/INSTALL.md` for more details.

## API Endpoints

### Parts
- `GET /api/parts` - Get all parts (optional query: `category`, `compatibleWith`)
- `GET /api/parts/:id` - Get single part
- `POST /api/parts` - Create new part (admin)
- `PUT /api/parts/:id` - Update part (admin)
- `DELETE /api/parts/:id` - Delete part (admin)

### Configuration Requests
- `POST /api/config-requests` - Submit configuration request
- `GET /api/config-requests` - Get all requests (admin)
- `GET /api/config-requests/:id` - Get single request
- `PUT /api/config-requests/:id/status` - Update request status (admin)

## Database Models

### Part
- name, category, price, stock
- compatibility rules (socket, ddrVersion, formFactor, etc.)

### ConfigRequest
- selectedParts (object with part IDs)
- estimatedPrice
- customerName, customerEmail, customerPhone
- status (pending, reviewed, completed)

