# Brentfield Gate Repository Overview

## Project Summary
**Brentfield Gate** is a Next.js web application for managing gate access to Brentfield Estate. Residents verify their phone numbers to access daily gate pass codes and view estate announcements.

---

## Technology Stack

| Category | Technologies |
|----------|---------------|
| **Framework** | Next.js 16.0.5 (App Router) |
| **Frontend** | React 19.2.0, React DOM 19.2.0 |
| **Language** | TypeScript 5 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (OTP via Twilio SMS) |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React 0.555.0 |
| **Phone Input** | react-phone-number-input 3.4.14 |
| **Date Formatting** | date-fns 4.1.0 |
| **Notifications** | react-hot-toast 2.6.0 |
| **SMS** | Twilio 5.10.6 |
| **Cookie Management** | cookies-next 6.1.1 |
| **Linting** | ESLint 9 |
| **Deployment** | Vercel |

---

## Project Structure

```
brentfieldgate/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── send-otp/route.ts       # SMS OTP endpoint
│   │   │       └── verify-otp/route.ts     # OTP verification endpoint
│   │   │   └── cron/
│   │   │       └── daily-code/route.ts     # Daily gate code cron job
│   │   ├── admin/
│   │   │   └── page.tsx                    # Admin dashboard (restricted)
│   │   ├── gate/
│   │   │   └── page.tsx                    # Main gate pass display
│   │   ├── layout.tsx                      # Root layout
│   │   ├── page.tsx                        # Home/phone verification page
│   │   ├── globals.css                     # Global styles
│   │   └── manifest.json                   # PWA manifest
│   ├── components/
│   │   ├── Button.tsx                      # Reusable button component
│   │   ├── Header.tsx                      # Header component
│   │   ├── CopyButton.tsx                  # Copy-to-clipboard button
│   │   ├── VerifyPhone.tsx                 # Phone verification form
│   │   └── VerifyPhone.old.tsx             # Legacy version
│   └── utils/
│       └── supabase/
│           ├── server.ts                   # Server-side Supabase client
│           ├── client.ts                   # Client-side Supabase client
│           └── types.ts                    # Generated types from Supabase
├── public/
│   ├── images/                             # Estate photos
│   └── *.svg, *.json                       # Assets and config
├── middleware.ts                           # Route protection & auth logic
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
├── next.config.ts                          # Next.js config
├── postcss.config.mjs                      # PostCSS config
├── eslint.config.mjs                       # ESLint config
└── README.md                               # Original setup guide
```

---

## Core Features

### 1. **Phone Verification (Home Page)**
- **Route**: `/` (public)
- **Component**: `src/components/VerifyPhone.tsx`
- Residents enter phone number
- System sends OTP via Twilio SMS
- Upon successful verification, phone stored in cookie (`verified_phone`)

### 2. **Gate Pass Display**
- **Route**: `/gate` (protected)
- **Component**: `src/app/gate/page.tsx`
- Displays today's gate access code (fetched from Supabase `gate_passes` table)
- Falls back to "No code yet – check back at 1 AM" if no code exists
- **CopyButton** allows quick code copying
- Shows current date with formatted display
- Displays last 5 announcements from Supabase

### 3. **Announcements**
- Stored in Supabase `announcements` table
- Fetched on `/gate` page load
- Sorted by creation date (newest first)
- Displays title and message

### 4. **Admin Dashboard**
- **Route**: `/admin` (restricted to admins only)
- **Component**: `src/app/admin/page.tsx`
- Protected by middleware — checks if user's phone is in `residents` table with `is_admin = true`
- Phone normalization logic handles different formats (+234, 234, 0...)

### 5. **Daily Cron Job**
- **Route**: `/api/cron/daily-code`
- Auto-generates gate passes daily at 1 AM
- Triggered by external cron service (Vercel, Render, etc.)

### 6. **Authentication API**
- **Send OTP**: `POST /api/auth/send-otp` — triggers Twilio SMS
- **Verify OTP**: `POST /api/auth/verify-otp` — validates OTP and sets cookie

---

## Route Protection (Middleware)

**File**: `src/middleware.ts`

| Route | Access | Logic |
|-------|--------|-------|
| `/` | Public | No restrictions |
| `/gate` | Phone verified | Requires `verified_phone` cookie |
| `/admin` | Admin only | Requires verified phone + admin status in DB |

---

## Database Schema (Supabase)

### `residents`
- `phone` (text, PK) — e.g., "08012345678"
- `is_admin` (boolean) — admin flag

### `gate_passes`
- `id` (uuid, PK)
- `date` (date) — e.g., "2025-12-07"
- `code` (text) — daily access code

### `announcements`
- `id` (uuid, PK)
- `title` (text)
- `message` (text)
- `created_at` (timestamp)

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sloefqrygmcuaismeiix.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Twilio
TWILIO_ACCOUNT_SID=<account-sid>
TWILIO_AUTH_TOKEN=<auth-token>
TWILIO_PHONE_NUMBER=<verified-twilio-number>
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint

# Database
npm run gen:types        # Generate Supabase TypeScript types
```

---

## Key Design Patterns

1. **Server Components**: Pages use async server components for secure DB access
2. **Middleware**: Route protection at request level
3. **Cookie-based Auth**: `verified_phone` cookie stores verified numbers
4. **Revalidation**: `revalidate = 0` in `/gate` for real-time code display
5. **Phone Normalization**: Handles various phone format inputs (+234, 234, 0)
6. **Component Reusability**: Button, CopyButton, VerifyPhone as isolated components

---

## Deployment
- **Platform**: Vercel
- **Config**: `vercel.json` in root
- Automatic deployments from git pushes

---

## Old/Legacy Files
- `src/app/layout.old.tsx`, `page.old.tsx`, `gate/page.old.tsx` — previous versions (can be removed)
- `src/components/VerifyPhone.old.tsx` — legacy phone verification

---

## Next Steps / Known Considerations
1. Ensure Supabase tables exist with correct schema
2. Set up Twilio account for SMS delivery
3. Configure cron job trigger for daily gate code generation
4. Test phone number verification flow end-to-end
5. Verify admin role enforcement on `/admin` routes
