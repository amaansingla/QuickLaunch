# QuickLaunch

QuickLaunch is a full-stack tool that turns a one-line product idea into a live, shareable waitlist landing page in minutes — with real accounts, an admin dashboard, and Excel export of everyone who signs up.

**Live demo:** https://quick-launch-eight.vercel.app

## Demo

<!-- Drop a screen recording here, e.g. demo.mp4, the same way VisaTrack does it -->
`[demo video here]`

## Preview

**Entry gate — guest or account**
<img width="1508" height="824" alt="entry-gate" src="https://github.com/user-attachments/assets/282b2e7a-2b34-4a58-9045-289db640ffce" />


**My Products — admin dashboard**
<img width="1512" height="830" alt="my-products-empty" src="https://github.com/user-attachments/assets/c67c21be-7667-4062-8cb9-5221d828a331" />


**AI-assisted editor with live preview**
<img width="1512" height="827" alt="ai-generate-editor" src="https://github.com/user-attachments/assets/ab748ec8-1559-4dbb-a898-8e31bd24f5b2" />


**Page created — links to the public page and admin dashboard**
<img width="1512" height="825" alt="page-created" src="https://github.com/user-attachments/assets/ae2686a2-7cd7-4c19-a670-cafd0372a131" />

**Public waitlist page**
<img width="1512" height="824" alt="public-page-filled" src="https://github.com/user-attachments/assets/ea4d7f65-66c5-43fe-8d4b-bad860ea723e" />
<img width="1508" height="822" alt="public-page" src="https://github.com/user-attachments/assets/66c86f7a-07cd-4f2a-842c-ff29e53a4329" />


**Signups dashboard with Excel export**
<img width="1512" height="824" alt="signups-dashboard" src="https://github.com/user-attachments/assets/5f219748-38f8-41bf-8b69-b3ad20b12457" />
<img width="1512" height="982" alt="excel-export" src="https://github.com/user-attachments/assets/459479a3-50c5-426f-9b52-d31ebd318733" />


## Features

- 🚪 Entry gate — every visitor chooses guest mode or an account before landing on the builder
- 🤖 AI-assisted editor — describe your idea in one line, Groq generates a product name, one-liner, and 3 feature bullets, all editable with a live preview
- 🔗 Auto-generated public landing page at a unique URL (`/p/your-product`)
- ✅ Waitlist signups capture name + email, with duplicate-email prevention per product
- 🔐 Accounts — email/password signup and login, JWT-based auth
- 📊 My Products dashboard — every product you've made in one place, with a button to create another
- 📥 One-click Excel (.xlsx) export of a product's full signup list (name, email, timestamp)
- 🗑️ Delete an individual product, with confirmation
- ❌ Delete your account, with confirmation — wipes the account and every product it owns
- 🧭 Consistent nav (Home / My Products / Log in) on every page

## Why?

Most no-code landing page builders are paid, overkill for validating a single idea, or take longer to set up than the idea takes to explain. QuickLaunch strips it down to the one thing a founder actually needs before writing any real code: a page people can find, understand in one glance, and sign up on — plus a way to see and export who did.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Auth | JWT (jsonwebtoken) + bcrypt |
| AI generation | Groq |
| Database | PostgreSQL (Railway) |
| Excel export | SheetJS (xlsx) |
| Deployment | Vercel (frontend), Railway (backend + DB) |

## Architecture

```
Browser → React frontend (Vercel)
             ↓ fetch
        Express API (Railway)
             ↓ SQL queries
        PostgreSQL (Railway)
```

## Installation

Clone the repository.

```bash
git clone https://github.com/amaansingla/QuickLaunch.git
cd QuickLaunch
```

Install backend dependencies.

```bash
cd backend
npm install
```

Set up the backend environment. Create `backend/.env`:

```
DATABASE_URL=your_postgres_connection_string
PORT=4000
NODE_ENV=development
JWT_SECRET=your_random_secret
GROQ_API_KEY=your_groq_api_key
```

Create the database tables (safe to re-run anytime — only adds what's missing).

```bash
node run-schema.js
```

Start the backend.

```bash
node server.js
```

Install frontend dependencies.

```bash
cd ../frontend
npm install
```

Set up the frontend environment. Create `frontend/.env`:

```
VITE_API_URL=http://localhost:4000
```

Start the frontend.

```bash
npm run dev
```

You're ready to go — open the URL Vite prints (usually `http://localhost:5173`).

## API Routes

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

## Project Structure

```
QuickLaunch/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js               # Postgres connection pool
│   ├── schema.sql          # Table definitions + migrations
│   ├── run-schema.js       # Applies schema.sql
│   ├── authMiddleware.js   # requireAuth — blocks unauthenticated requests
│   ├── optionalAuth.js     # optionalAuth — attaches user if logged in, allows guests
│   └── routes/
│       ├── auth.js         # signup / login / delete account
│       ├── products.js     # create / list / delete products, signups, Excel data
│       └── generate.js     # Groq AI idea → name/one-liner/bullets
└── frontend/
    └── src/
        ├── App.jsx          # Routes + homepage
        ├── AuthContext.jsx  # Auth state (token, user) shared across the app
        ├── EntryGate.jsx    # Guest vs log in popup
        ├── SiteHeader.jsx   # Shared nav header
        ├── ProductForm.jsx  # AI-assist + manual editor
        ├── PagePreview.jsx  # Live preview panel
        ├── PublicPage.jsx   # Public /p/:slug waitlist page
        ├── MyProducts.jsx   # Admin dashboard — list of owned products
        ├── Dashboard.jsx    # Per-product signups table + Excel export
        ├── Signup.jsx       # Account creation form
        └── Login.jsx        # Login form
```

## Roadmap

- Ephemeral guest pages (auto-delete on tab close, rather than persisting ownerless)
- Custom domains per waitlist page
- Email notifications to the founder on new signups
- Analytics on page views vs. conversion rate

## Author

Built by [Amaan Singla](https://github.com/amaansingla) as part of a summer portfolio project series.
