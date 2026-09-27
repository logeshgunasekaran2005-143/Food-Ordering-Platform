# Food Ordering App (MERN Stack)

A full-stack food ordering system with user/admin roles, JWT auth, menu browsing,
cart, checkout, and order status tracking.

## Tech Stack
- **Frontend:** React (Vite) + Bootstrap 5 + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Project Structure
```
food-ordering-app/
├── backend/     Express API, MongoDB models, routes, auth
└── frontend/    React app (Vite)
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB URI and a JWT secret:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/food-ordering-app
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

(Optional) Seed sample menu items and an admin account:
```bash
node seed.js
```
This creates admin login: `admin@foodapp.com` / `admin123`

Start the backend:
```bash
npm run dev
```
Runs on http://localhost:5000

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Start the frontend:
```bash
npm run dev
```
Runs on http://localhost:5173

## Features
- User signup/login with JWT auth (passwords hashed with bcrypt)
- Role-based access: regular users vs admin
- Browse menu with search and category filter
- Cart stored in localStorage, checkout creates an order
- Order history for logged-in users
- Admin dashboard: add/edit/delete menu items, view all orders, update order status
  (pending → preparing → delivered)

## API Overview

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/menu | Public |
| POST | /api/menu | Admin |
| PUT | /api/menu/:id | Admin |
| DELETE | /api/menu/:id | Admin |
| POST | /api/orders | Logged in |
| GET | /api/orders/myorders | Logged in |
| GET | /api/orders | Admin |
| PUT | /api/orders/:id/status | Admin |

## Notes for Presentation / Viva
- Auth uses JWT stored in localStorage, sent via Authorization header
- Passwords are hashed with bcrypt before saving — never stored in plain text
- Admin routes are protected by two middleware layers: `protect` (valid JWT) then `admin` (role check)
- Cart is client-side only (localStorage) until checkout, when it's converted to a server-side Order
- To make the admin manually: in MongoDB, set a user's `role` field to `"admin"`, or use the seed script
