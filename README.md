# EventHive

A full-stack **MERN** (MongoDB, Express.js, React, Node.js) web app for an event management business. It showcases event packages (birthdays, weddings, corporate events) and captures client bookings as leads.

## Features

**For clients**
- Browse event packages, filter by category, and search by name
- View package details (price, inclusions, capacity, duration)
- Submit a booking inquiry with contact details and event requirements
- Responsive on mobile, tablet, and desktop

**For admins** (login required)
- Dashboard with lead and package counts
- View, search, and filter bookings; update lead status (`new` → `contacted` → `confirmed` / `cancelled`); add internal notes
- Add, edit, and delete event packages

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, Bootstrap 5
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (Atlas or local)
- **Auth:** JWT and bcrypt
- **Validation:** express-validator on the server, form validation in React

## Project Structure

```
eventhive/
├── client/      # React frontend (Vite)
└── server/      # Express REST API
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- MongoDB Atlas account or a local MongoDB server
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/eventhive.git
cd eventhive

# 2. Create environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Install dependencies
npm run install:all

# 4. (Optional) Seed sample packages and an admin user
npm run seed

# 5. Start the API and the frontend together
npm run dev
```

The API runs at `http://localhost:5000` and the client at `http://localhost:5173`.

### Environment Variables

**`server/.env`**

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend URL, used for CORS |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by the seed script |

**`client/.env`**

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL, e.g. `http://localhost:5000/api/v1` |

Never commit real `.env` files. Only the `.env.example` templates belong in the repository.

### Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start API and client together |
| `npm run seed` | Seed sample packages and admin user |
| `npm run build` | Build the frontend for production |
| `npm run install:all` | Install dependencies for root, server, and client |

## API Overview

Base URL: `/api/v1`. All responses are JSON.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Admin login, returns JWT |
| GET | `/auth/me` | Admin | Current admin profile |
| GET | `/packages` | Public | List packages (filter, search, paginate) |
| GET | `/packages/:id` | Public | Single package |
| POST | `/packages` | Admin | Create package |
| PUT | `/packages/:id` | Admin | Update package |
| DELETE | `/packages/:id` | Admin | Delete package |
| POST | `/bookings` | Public | Submit a booking inquiry |
| GET | `/bookings` | Admin | List leads |
| GET | `/bookings/:id` | Admin | Single lead |
| PATCH | `/bookings/:id` | Admin | Update status or notes |
| DELETE | `/bookings/:id` | Admin | Delete lead |
| GET | `/bookings/stats/summary` | Admin | Lead counts per status |
| GET | `/health` | Public | Health check |

Postman collection: `/docs/postman/`

## Default Admin (Development Only)

After running `npm run seed`:

- **Email:** `admin@eventhive.com`
- **Password:** `Admin@12345`

Change these credentials before deploying.

## Deployment

| Part | Suggested Platform |
| --- | --- |
| Database | MongoDB Atlas |
| Backend | Render or Railway |
| Frontend | Vercel or Netlify |

Set the environment variables in each platform's dashboard. Point `CLIENT_URL` on the backend to the deployed frontend, and `VITE_API_BASE_URL` on the frontend to the deployed API.

- **Live site:** TBD
- **API:** TBD

## Git Workflow

- Branches: `main` (stable), `develop` (integration), and `feature/<name>` branches
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/), e.g. `feat: add booking form validation`
- Features merge into `develop` through pull requests with a teammate review

## Future Scope

- Online payments for advance bookings
- Live chat support
- Email confirmations for clients and admins
- Calendar availability and date blocking
- Reviews, ratings, and image uploads (Cloudinary)
- Multiple admin roles and an analytics dashboard


