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

