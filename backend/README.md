# KaamExpress Backend

This is the backend for KaamExpress, built with Express.js and MongoDB. It provides RESTful APIs for users, workers, customers, services, bookings, payments, disputes, and analytics. Includes JWT authentication, secure password storage, and role-based access control.

## Features

- Express.js REST API
- MongoDB with Mongoose
- JWT authentication
- Secure password hashing (bcrypt)
- Role-based access: admin, worker, customer
- Modular folder structure
- Security best practices (helmet, CORS, rate limiting)

## Getting Started

1. Install dependencies: `npm install`
2. Create a `.env` file (see `.env.example`)
3. Start the server: `npm run dev`

## Folder Structure

- `/src`
  - `/config` - DB and environment config
  - `/controllers` - Route controllers
  - `/middleware` - Auth, error, security
  - `/models` - Mongoose schemas
  - `/routes` - Express routers
  - `/utils` - Helpers (JWT, email, etc)
  - `/app.js` - Express app setup
  - `/server.js` - Entry point

## API Overview

- `/api/auth` - Register, login, JWT
- `/api/users` - User management
- `/api/workers` - Worker management
- `/api/customers` - Customer management
- `/api/services` - Services CRUD
- `/api/bookings` - Bookings CRUD
- `/api/payments` - Payments
- `/api/disputes` - Dispute resolution
- `/api/analytics` - Stats endpoints

---

Replace this README as you build out the backend.
