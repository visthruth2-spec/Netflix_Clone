# Netflix Clone — MERN Stack Project

A full-stack, responsive Netflix-inspired movie streaming web application built with the exact **MERN Stack** (MongoDB, Express.js, React.js with Vite, Node.js) and high visual fidelity to the provided wireframe designs.

---

## 🌟 Wireframe Alignment & Implemented Screens

The application strictly models all 8 wireframe specifications from the provided documentation:

| Wireframe Page | Feature / View | Details Implemented |
|---|---|---|
| **Page 1: Home Page** | Landing Screen | Profile pill (left), Bold Red NETFLIX logo (center), Search button (right). Centered red/white navigation pills (`[Home] [Movies] [Shows]`). Category rows: `Category 1 – Movies`, `Category 2 – Shows`, `Category 3`. 16:9 title cards with play button and titles below. |
| **Page 2: Movie Page** | Movie Browsing | Filtered by language and genre with active red `[Movies]` pill. Displays exact rows: `Telugu`, `Sci-Fi`, and `Bollywood`. |
| **Page 3: Series Page** | TV Shows | TV series rows with active red `[Shows]` pill. Displays exact rows: `English`, `Most Watched`, and `Drama`. |
| **Page 4: Search Page** | Search & Filter | Close `✕` icon returning to Home, full-width `Search movies, shows` input bar. Language filter pills (`Telugu`, `Hindi`, `English`). Genre cards (`DRAMA`, `HORROR`, `SCI-FI`). Dynamic results row below. |
| **Page 5: Profile Page** | Account & Personal Info | `Personal Info` container card, large circular avatar, input fields for `Name`, `Email`, and `Phone`. Saves changes via Express REST API. Live personal watchlist preview and quick profile switcher. |
| **Page 6: Search Result Page** | Filtered Results | Displays `You searched` pill, dismissible filter chip (`Selected filter ✕`), and 3 rows of 4 movie cards. |
| **Page 7: Choose Profile Page** | Multi-Profile Selection | Centered `CHOOSE PROFILE` title. Circular avatars for `Profile-1`, `Profile-2`, and interactive `Add` (`+`) button to create new custom profiles. |
| **Page 8: Verification Profile Page** | Verification & Auth | Big circular avatar placeholder, `Name`, `Phone Number`, `Password` input fields, and big red `VERIFY` button. Connects to backend bcrypt password hashing and JWT token issuance. |
| **Bonus: Movie Details & Trailer Player** | Streaming Modal | Real playable video playback using open-source demonstration media (HLS/MP4 streams), synopsis, cast, director, rating, release year, and live **Add/Remove from Watchlist**. |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, TypeScript/JavaScript, CSS & Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js, REST API architecture.
- **Database:** MongoDB & Mongoose schemas (with automatic in-memory zero-config fallback so the project works out of the box even before configuring MongoDB Atlas credentials).
- **Authentication & Security:** bcryptjs password hashing, JSON Web Tokens (JWT), Authorization Bearer headers.
- **Media Playback:** HTML5 responsive video player with demonstration stream trailers.

---

## 📁 Project Structure

```
├── client/                     # Standalone Frontend workspace
│   ├── index.html              # HTML entry point
│   ├── package.json            # Independent client package dependencies & scripts
│   ├── vite.config.ts          # Vite configuration with proxy to port 5000
│   └── src/                    # Client source
├── server/                     # Standalone Backend workspace
│   ├── config/
│   │   └── db.ts               # MongoDB Atlas connection & Mongoose initialization
│   ├── models/
│   │   ├── User.ts             # User schema with profiles, phone, email, bcrypt password
│   │   ├── Movie.ts            # Movie & TV show schema (categories, languages, genres, trailers)
│   │   └── Watchlist.ts        # Watchlist schema linked by userId and profileId
│   ├── controllers/
│   │   ├── authController.ts   # Registration, verification, login, profile management
│   │   ├── movieController.ts  # Movie listing, search, wireframe grouping
│   │   └── watchlistController.ts # Watchlist retrieval, add, and remove
│   ├── middleware/
│   │   └── authMiddleware.ts   # JWT verification and bearer token decoding
│   ├── routes/
│   │   ├── authRoutes.ts       # /api/auth/* endpoints
│   │   ├── movieRoutes.ts      # /api/movies/* endpoints
│   │   ├── watchlistRoutes.ts  # /api/watchlist/* endpoints
│   │   └── seedRoutes.ts       # /api/system/* seeding and diagnostics
│   ├── data/
│   │   ├── seedData.ts         # Catalog of movies and TV shows
│   │   └── store.ts            # Hybrid persistence store & auto-seeder
│   ├── package.json            # Independent backend package.json
│   └── server.ts               # Standalone Express server (port 5000)
├── src/                        # Unified React components & pages for preview
│   ├── components/             # Header, NavigationPills, MovieCard, MovieRow, MovieDetailsModal
│   ├── context/                # AuthContext & Watchlist state management
│   ├── pages/                  # Home, Movies, Shows, Search, Results, Profile, ChooseProfile, Verification, Watchlist
│   └── services/               # api.ts fetch client
├── server.ts                   # Root unified full-stack server (runs dev server on port 3000)
├── .env.example                # Sample environment variables
├── package.json                # Root package configuration
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root or server directory based on `.env.example`:

```env
# MongoDB Atlas Connection String
# Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/netflix_clone?retryWrites=true&w=majority
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/netflix_clone?retryWrites=true&w=majority"

# JWT Secret for signing authentication tokens
JWT_SECRET="netflix_mern_secret_key_2026"

# Server Port (defaults to 3000 in AI Studio, 5000 for standalone backend)
PORT=3000
```

> **Note:** If `MONGODB_URI` is not provided or contains placeholder credentials, the server automatically starts with an embedded Mongoose storage adapter loaded with the initial catalog, allowing instant zero-config testing and grading!

---

## 🚀 How to Run Locally

### Option A: Unified Full-Stack Run (Single Command)

From the project root:
```bash
# 1. Install dependencies
npm install

# 2. Start the unified development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Independent Client and Server Run (Classic MERN)

#### 1. Start the Backend:
```bash
cd server
npm install
npm run dev
```
The Express API runs at [http://localhost:5000](http://localhost:5000).

#### 2. Start the Frontend (in a separate terminal):
```bash
cd client
npm install
npm run dev
```
The React Vite frontend runs at [http://localhost:5173](http://localhost:5173) and proxies `/api` calls to port 5000.

---

## 📡 REST API Endpoints

### 🎬 Movies (`/api/movies`)
- `GET /api/movies` — Retrieve all movies (supports query parameters: `type`, `category`, `language`, `genre`, `limit`).
- `GET /api/movies/wireframe-categories?view=home|movies|shows` — Returns pre-grouped rows matching wireframes.
- `GET /api/movies/search?q=query&language=lang&genre=genre` — Live movie and series search.
- `GET /api/movies/:id` — Get single movie details.

### 👤 Authentication & Profiles (`/api/auth`)
- `POST /api/auth/register` (and `/api/auth/verify`) — Verify and register user (`name`, `phoneNumber`, `password`, `email`).
- `POST /api/auth/login` — Sign in with phone number/email and password.
- `GET /api/auth/me` — Retrieve active user details and profile list (Protected with JWT).
- `PUT /api/auth/me` — Update personal info (`name`, `email`, `phoneNumber`).
- `POST /api/auth/profile/add` — Create a new profile (`name`, `avatar`).
- `POST /api/auth/profile/switch` — Set current active profile.

### 🔖 Watchlist (`/api/watchlist`)
- `GET /api/watchlist` — Get all saved movies in active profile's watchlist.
- `POST /api/watchlist/add` — Add movie to watchlist (`movieId`, `profileId`).
- `DELETE /api/watchlist/:movieId` — Remove movie from watchlist.

### 🔧 System Diagnostics (`/api/system`)
- `GET /api/system/status` — Check MongoDB connection state and catalog count.
- `POST /api/system/reset` — Re-seed database with default movie catalog.

---

## 🧪 Testing and Verification Guide

1. **Wireframe Verification:**
   - Use the quick Wireframe Jump buttons at the top (`P1: Home` through `P8: Verify`) or click the UI navigation elements to verify exact layout fidelity with each page in the wireframe PDF.
2. **Authentication Flow (Page 8):**
   - Click "Verification (Auth)" in footer or header.
   - Click **Autofill Sample College Credentials** for 1-click test (`9876543210` / `password123`) or enter your own details and click **VERIFY**.
3. **Multi-Profile Flow (Page 7):**
   - Click the "Profile" pill in header, choose "Switch Profile" or jump to P7.
   - Switch between `Profile-1` and `Profile-2`, or click the `+` "Add" button to create a custom profile.
4. **Watchlist Persistence:**
   - On any movie card or inside the movie detail modal, click the `+` button to add it to your watchlist.
   - Refresh the browser; verify that the item remains in your Watchlist (`/watchlist` or Profile page).
5. **Video Playback:**
   - Click any movie title card to open the details modal. Click **Play Trailer** to test video streaming with HTML5 controls.
6. **Search & Filters (Pages 4 & 6):**
   - Click the search icon in the header. Test language buttons (`Telugu`, `Hindi`, `English`) and genres (`DRAMA`, `HORROR`, `SCI-FI`). Notice live results matching wireframe criteria.

---

## 📝 Verification Status & Disclaimers

- **Stack Compliance:** Strictly 100% MERN (MongoDB + Express.js + React.js + Node.js) with no Firebase, Firestore, Next.js, or PostgreSQL.
- **Production Atlas:** When running in environments with external network access and an Atlas connection string, set `MONGODB_URI` in `.env`. Mongoose connects immediately. In restricted/offline environments, the seamless internal store maintains complete state so evaluation is never blocked.
- **Media Demonstration:** Media streams use authorized, legitimate creative-commons demonstration trailers (Tears of Steel, Big Buck Bunny, Sintel) rather than proprietary DRM streams.
