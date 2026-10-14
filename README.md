# EventHive – Event Booking Platform

EventHive is a full-stack MERN web application for managing event packages and booking inquiries for birthdays, weddings, and corporate events.

## Features

- Browse, search, and filter event packages.
- View package details, pricing, and inclusions.
- Submit booking inquiries.
- Admin login with JWT authentication.
- Manage bookings and update their status.
- Add, edit, and delete event packages.
- Responsive design for mobile and desktop.

## Tech Stack

- **Frontend:** React, Vite, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Validation:** express-validator

## Project Structure

```text
EventHive/
├── client/    # React frontend
└── server/    # Express backend
```

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/Adityaa871/EventHive-Event-Booking-Platform.git
cd EventHive-Event-Booking-Platform
```

**2. Configure environment variables**

Create `.env` files in the `client` and `server` directories using the provided `.env.example` files.

**3. Install dependencies**

```bash
npm run install:all
```

**4. Seed sample data (optional)**

```bash
npm run seed
```

**5. Start the application**

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## API

Base URL: `/api/v1`

- `/auth` – Admin authentication
- `/packages` – Event package management
- `/bookings` – Booking management
- `/health` – API health check

## Deployment

- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway
- **Database:** MongoDB Atlas

## Future Improvements

- Online payments
- Email notifications
- Calendar availability
- Customer reviews and ratings

---

**Note:** Never upload `.env` files containing secrets or passwords to GitHub.
