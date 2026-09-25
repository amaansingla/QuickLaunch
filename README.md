# QuickLaunch

A full-stack SaaS tool that lets founders create a landing page and waitlist for their product idea in under 5 minutes — no code required.

**Live demo:** https://quick-launch-eight.vercel.app

## The problem

Every founder validating a new idea needs a landing page with email capture. Existing tools are either paid, overkill, or take too long to set up. QuickLaunch goes from idea to a live, shareable waitlist page in minutes.

## Features

- **Guest or account mode:** an entry gate lets visitors either try it instantly as a guest, or sign up / log in for an account
- **Accounts:** email + password signup and login (JWT-based), with a protected admin dashboard
- AI-assisted editor: describe your idea and Groq generates a product name, one-liner, and 3 feature bullets — all editable, with a live preview
- Auto-generated public landing page at a unique URL (`/p/your-product`)
- Waitlist signups capture both name and email, with duplicate-email prevention per product
- **My Products dashboard:** logged-in users see every product they've made, can jump into any one's signup list, or create a new one
- Per-product signup dashboard showing total count, name/email/timestamp per signup, and a **one-click Excel (.xlsx) export**
- Delete an individual product (with confirmation)
- Delete your account (with confirmation) — wipes the account and every product it owns
- Consistent navigation header (Home / My Products / Log in) on every page

## Tech stack

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express, JWT auth (jsonwebtoken + bcrypt)
- **AI:** Groq (idea → name/one-liner/bullets generation)
- **Database:** PostgreSQL (hosted on Railway)
- **Excel export:** SheetJS (xlsx)
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
# create a .env file with DATABASE_URL, PORT, NODE_ENV, JWT_SECRET, GROQ_API_KEY
node run-schema.js   # sets up / updates database tables (safe to re-run anytime)
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

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create an account |
| POST | `/api/auth/login` | — | Log in, returns a JWT |
| DELETE | `/api/auth/account` | required | Delete the logged-in user's account and all their products |
| POST | `/api/generate` | — | AI-generate a name/one-liner/bullets from a one-line idea (Groq) |
| POST | `/api/products` | optional | Create a new product page (owned if logged in, ownerless if guest) |
| GET | `/api/products/mine` | required | List all products owned by the logged-in user |
| GET | `/api/products/:slug` | — | Get a product by its URL slug |
| DELETE | `/api/products/:id` | required | Delete a product you own |
| POST | `/api/products/:slug/signups` | — | Add a name + email to a product's waitlist |
| GET | `/api/products/:slug/signups` | — | Get signup count and full list (name, email, timestamp) for a product |

## Author

Built by [Amaan Singla](https://github.com/amaansingla) as part of a summer portfolio project series.