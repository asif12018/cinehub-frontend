<h1 align="center">
  🎬 CineTube
</h1>

<p align="center">
  A full-featured, Netflix-inspired movie streaming platform built with Next.js 16, React 19, and TypeScript.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.3-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [Admin Dashboard](#admin-dashboard)
- [Deployment](#deployment)

---

## Overview

**CineTube** is a modern movie discovery and streaming web application. Users can browse movies and series, write reviews, manage a personal watchlist, and subscribe to premium plans. Admins have a dedicated dashboard to manage content, actors, reviews, and monitor platform activity.

---

## ✨ Features

### 👤 User-Facing
- **Splash Intro** — Cinematic video intro on first visit (shown once per session, with an 8s fallback for slow connections)
- **Hero Banner** — Dynamic, full-screen featured movie showcase on the home page
- **Movie Discovery** — Curated rows: *Trending Now*, *Top Rated This Week*, *Newly Added*, *Editor's Picks*
- **Search** — Real-time search with URL query params; falls back to a responsive grid layout
- **Movie Detail Page** — Full metadata, cast, director info, trailer player, and community reviews
- **Reviews & Ratings** — Submit reviews (with spoiler warnings), rate out of 10, like reviews, and view community scores
- **Watchlist** — Save movies to a personal watchlist, accessible from the user profile
- **Notifications** — Real-time notification panel with auto-polling and "mark all as read"
- **Subscription & Pricing** — Tiered pricing plans with payment integration
- **Payment History** — View past transactions and subscription status
- **Authentication** — Register, login, email verification via OTP, forgot/reset password flows

### 🛡️ Admin Dashboard
- Overview stats and analytics
- Add / manage movies (title, genre, tags, director, cast)
- Add / manage actors with profile images
- Review moderation — approve, unpublish, or delete reviews via custom confirmation modals
- User management

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui + Radix UI |
| Server State | TanStack React Query v5 |
| Form Handling | TanStack React Form |
| HTTP Client | Axios |
| Video Player | react-player |
| Validation | Zod v4 |
| Notifications | Sonner (toast library) |
| Icons | Lucide React |
| Auth | JWT (access + refresh tokens, verified server-side via Next.js middleware) |
| Image Hosting | Cloudinary |
| Image Source | TMDB |
| Deployment | Vercel |

---

## 📁 Project Structure

```
cinehub-frontend/
├── public/
│   └── cinehub-intro.mp4        # Splash intro video asset
├── src/
│   ├── app/
│   │   ├── (commonLayout)/      # Public-facing pages
│   │   │   ├── page.tsx         # Home page (hero, movie rows, pricing)
│   │   │   ├── movie/           # Movie listing & detail pages
│   │   │   ├── watchList/       # User watchlist
│   │   │   ├── pricing/         # Subscription plans
│   │   │   ├── payment-success/ # Post-payment confirmation
│   │   │   ├── payment-history/ # Transaction history
│   │   │   └── (authRouteGroup)/
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       ├── verify-email/
│   │   │       ├── forgot-password/
│   │   │       ├── reset-password/
│   │   │       └── sendOtpVerification/
│   │   └── (dashboardLayout)/   # Admin-protected pages
│   │       └── dashboard/
│   │           ├── page.tsx     # Admin overview & stats
│   │           ├── addMovies/
│   │           ├── manageMovies/
│   │           ├── addActor/
│   │           └── reviews/
│   ├── components/
│   │   ├── ui/                  # Shared UI primitives (navbar, hero, movie-card, etc.)
│   │   └── module/              # Feature-specific components (dashboard, review)
│   ├── service/                 # API service functions (one file per domain)
│   │   ├── auth.service.ts
│   │   ├── media.service.ts
│   │   ├── review.service.ts
│   │   ├── actor.service.ts
│   │   ├── payment.service.ts
│   │   ├── watchlist.service.ts
│   │   ├── notification.service.ts
│   │   └── ...
│   ├── providers/               # React context providers (QueryClient, Theme, etc.)
│   ├── lib/                     # Utility helpers
│   ├── types/                   # Global TypeScript type definitions
│   ├── zod/                     # Shared Zod validation schemas
│   └── proxy.ts                 # Next.js server-side proxy / middleware helpers
├── next.config.ts
├── components.json              # shadcn/ui config
└── .env                         # Environment variables (see below)
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (or `pnpm` / `yarn`)
- A running instance of the **CineTube backend** API (or use the deployed URL)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/asif12018/cinetube-frontend.git
   cd cinehub-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below).

4. **Place the intro video asset**

   Add your `cinehub-intro.mp4` file into the `/public` directory. The splash screen will display it on first visit.

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Create a `.env.local` file at the project root with the following keys:

```env
# Base URL for the CineTube REST API
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api/v1

# JWT secrets — must match what the backend uses
JWT_ACCESS_SECRET=your_access_token_secret_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

> **Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secrets in `NEXT_PUBLIC_` variables.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server (webpack mode) |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |

---

## 🗺️ Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — hero banner, curated movie rows, pricing |
| `/?search=query` | Search results grid |
| `/movie` | Full movie listing |
| `/movie/[id]` | Movie detail — info, trailer, cast, reviews |
| `/watchList` | Authenticated user's saved watchlist |
| `/pricing` | Subscription plan selection |
| `/payment-success` | Post-payment confirmation page |
| `/payment-history` | User's transaction history |
| `/login` | Login form |
| `/register` | Registration form |
| `/verify-email` | Email verification via OTP |
| `/sendOtpVerification` | Request a new OTP |
| `/forgot-password` | Initiate password reset |
| `/reset-password` | Set a new password |

---

## 🛡️ Admin Dashboard

Accessible at `/dashboard` (requires admin role).

| Route | Description |
|---|---|
| `/dashboard` | Stats overview — users, content, revenue |
| `/dashboard/addMovies` | Add new movies/series with full metadata |
| `/dashboard/manageMovies` | Edit or delete existing titles |
| `/dashboard/addActor` | Add actor profiles with photos |
| `/dashboard/reviews` | Moderate user reviews — approve, unpublish, delete |

---

## ☁️ Deployment

This project is deployed on **Vercel**.

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly through the [Vercel dashboard](https://vercel.com/new).

### Required Vercel Environment Variables

Set the same variables from your `.env.local` in your Vercel project settings under **Settings → Environment Variables**.

---

## 📄 License

This project was built as an academic assignment. All rights reserved by the author.
