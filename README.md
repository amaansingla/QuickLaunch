# QuickLaunch

A full-stack SaaS tool that lets founders create a landing page and waitlist for their product idea in under 5 minutes — no code required.

**Live demo:** https://quick-launch-eight.vercel.app

## The problem

Every founder validating a new idea needs a landing page with email capture. Existing tools are either paid, overkill, or take too long to set up. QuickLaunch goes from idea to a live, shareable waitlist page in minutes.

## Features

- Simple editor: product name, one-liner, and 3 feature bullets
- Live preview that updates as you type
- Auto-generated public landing page at a unique URL (`/p/your-product`)
- Real email capture with duplicate prevention
- Founder dashboard showing total signups and who signed up, with timestamps

## Tech stack

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (hosted on Railway)
- **Deployment:** Vercel (frontend), Railway (backend + database)

## Architecture

```
Browser → React frontend (Vercel)
             ↓ fetch
        Express API (Railway)
             ↓ SQL queries
        PostgreSQL (Railway)
```

## Running locally

**Backend**
```bash
cd backend
npm install
# create a .env file with DATABASE_URL, PORT, NODE_ENV
node run-schema.js   # sets up database tables (first time only)
node server.js
```

**Frontend**
```bash
cd frontend
npm install
# create a .env file with VITE_API_URL=http://localhost:4000
npm run dev
```

## API routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/products` | Create a new product page |
| GET | `/api/products/:slug` | Get a product by its URL slug |
| POST | `/api/products/:slug/signups` | Add an email to a product's waitlist |
| GET | `/api/products/:slug/signups` | Get signup count and list for a product |

## Author

Built by [Amaan Singla](https://github.com/amaansingla) as part of a summer portfolio project series.