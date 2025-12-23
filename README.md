# Computer Shop Management System - Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and set your MongoDB URI:
   ```env
   MONGO_URI=mongodb://localhost:27017/computer-shop
   ```
   
   **📝 Note**: See `ENV_SETUP.md` for detailed documentation and `ENV_UPDATE_NOTIFICATION.md` for update history.
   
   **🔔 Important**: The `.env` file is in `.gitignore` - never commit it!

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

