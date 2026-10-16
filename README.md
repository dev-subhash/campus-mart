# Campus Mart

A full-stack MERN college marketplace: students can list items, browse and search
listings, and chat with each other in real time.

## Features

- **Auth** — register/login/logout, email OTP password reset, JWT-based sessions, bcrypt password hashing,
  protected routes on both frontend and backend, `user`/`admin` roles.
- **Products** — create/read/update/delete listings, multiple images per listing,
  search (MongoDB text index), filter by category/condition/price, sort, pagination.
  Only the owner (or an admin) can edit/delete a listing.
- **Profiles** — edit name and profile photo, view any user's public profile, "My
  Listings" page.
- **Real-time chat** — Socket.IO powered one-to-one messaging tied to product
  listings, live delivery, typing indicators, online/offline presence, unread
  counts, persisted message history.
- **Notifications** — new-message notifications delivered live via socket and
  persisted in MongoDB, unread badge in the navbar.
- **Admin dashboard** — marketplace stats, user management (promote/demote,
  activate/deactivate), remove any listing. Protected on both frontend and backend.
- **Image uploads** — Cloudinary, via `multer-storage-cloudinary`.

## Tech stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Socket.IO client
**Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, Socket.IO, Cloudinary

## Architecture

```
Frontend (Vite/React) → REST API (Express) → MongoDB (Mongoose)
                       → Socket.IO (real-time chat & notifications)
                       → Cloudinary (image storage)
```

## Folder structure

```
campus-mart/
├── backend/
│   ├── config/        # db.js, cloudinary.js
│   ├── controllers/   # request handlers
│   ├── middleware/     # auth, admin, upload, validation, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── socket/          # Socket.IO auth + event handlers
│   ├── utils/            # generateToken, ApiError
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/   # reusable UI
│       ├── context/       # AuthContext, SocketContext
│       ├── layouts/        # MainLayout
│       ├── pages/           # route-level views
│       ├── services/         # axios API wrappers
│       └── App.jsx / main.jsx
└── README.md
```

## Environment variables

### backend/.env (copy from `backend/.env.example`)
```
MONGO_URI=mongodb://localhost:27017/campus-mart
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
RESET_EMAIL_FROM=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### frontend/.env (copy from `frontend/.env.example`)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Setup & running locally

### 1. MongoDB
Run MongoDB locally (`mongod`) or use a hosted cluster (e.g. MongoDB Atlas) and
put the connection string in `MONGO_URI`.

### 2. Cloudinary
Create a free account at cloudinary.com, then copy your **Cloud name**, **API
key**, and **API secret** from the dashboard into `backend/.env`.

### 3. Backend
```bash
cd backend
cp .env.example .env    # then fill in real values
npm install
npm run dev              # nodemon, http://localhost:5000
```

### 4. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

### 5. Create an admin user
There's no public "become admin" endpoint (by design — admin escalation must not
be self-service). Register a normal account, then promote it directly in MongoDB:
```js
// in mongosh, connected to your campus-mart database
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## API overview

| Prefix                | Purpose                                   |
|------------------------|--------------------------------------------|
| `/api/auth`            | register, login, logout, me, password reset |
| `/api/users`           | profile, avatar, my listings, public profile |
| `/api/products`        | CRUD, search/filter/sort/pagination         |
| `/api/conversations`   | find-or-create, list, get one               |
| `/api/messages`        | send, get history (marks as read)           |
| `/api/notifications`   | list, mark read, mark all read              |
| `/api/admin`           | stats, user management, product moderation  |

All protected routes require `Authorization: Bearer <token>`. Admin routes
additionally require `role: "admin"` — enforced server-side, not just hidden in
the UI.

Password reset sends a verification code to the account email. In development,
if SMTP credentials are not configured, the generated code is returned in the
reset response to make local testing possible. In production, SMTP must be
configured and codes are never returned by the API. Twilio variables may remain
configured for future SMS features but are not used by password reset.

## Socket.IO architecture

- One socket connection per logged-in user (opened once in `SocketContext`,
  closed on logout — no duplicate connections).
- Authenticated via the same JWT as REST, verified in a `io.use()` middleware
  before the connection is accepted.
- Server keeps an in-memory `Map<userId, socketId>` (`onlineUsers`) attached to
  the Express app so REST controllers (e.g. `sendMessage`) can emit directly to
  a specific user's socket.
- Events: `message:new`, `message:read`, `notification:new`, `typing:start`,
  `typing:stop`, `presence:update`.

## Known limitations / what to verify yourself

This was built in a sandboxed environment without internet access, so the
following could not be executed here and should be verified on your machine:

- `npm install` for both `frontend/` and `backend/` (dependencies were never
  actually installed or resolved against the npm registry here).
- A live MongoDB connection — models and queries are correct Mongoose usage,
  but were never run against a real database.
- Live Cloudinary uploads — the SDK is wired up correctly with env vars, but
  no real upload has been exercised.
- `npm run build` for the frontend (Vite/Tailwind production build).
- End-to-end Socket.IO behavior between two real browser clients.

All source files were syntax-checked (`node --check` for backend `.js` files)
and all frontend imports/exports were verified to resolve correctly, but this
is not a substitute for actually running the app.

## Future improvements

- Rate limiting on auth endpoints
- Refresh tokens / token rotation
- Image compression before upload
- Full-text search relevance tuning
- Push notifications (web push) in addition to in-app notifications
- Automated test suite (Jest/Supertest for backend, React Testing Library for frontend)

## Screenshots

_Add screenshots here once you've run the app locally._
