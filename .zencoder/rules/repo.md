---
description: Repository Information Overview
alwaysApply: true
---

# Brentfield Gate - Application Information

## Summary

Brentfield Gate is a Next.js-based residential management application that provides phone-based authentication, an admin dashboard, announcements system, and emergency contact management. Built with TypeScript, React 19, and Supabase for backend services.

## Structure

**Main Directories**:
- `src/app/`: Next.js App Router pages and layouts (dashboard, admin, auth, offline)
- `src/components/`: Reusable React components (UI, dashboard, system components)
- `src/context/`: React Context providers
- `src/utils/`: Utility functions including Supabase client configuration
- `tests/e2e/`: Playwright end-to-end test specifications
- `public/`: Static assets (images, design files, SVGs)

## Language & Runtime

**Language**: TypeScript 5  
**Runtime**: Node.js with React 19.2.1  
**Framework**: Next.js 16.0.7 (App Router)  
**Build System**: Next.js built-in build system  
**Package Manager**: npm (with package-lock.json)  
**Target**: ES2017

## Dependencies

**Main Dependencies**:
- `@supabase/supabase-js` (^2.86.0), `@supabase/ssr` (^0.8.0) - Backend auth and database
- `firebase` (^12.6.0) - Additional backend services
- `react` (^19.2.1), `react-dom` (^19.2.1), `next` (^16.0.7)
- `@tailwindcss/postcss` (^4), `tailwindcss` (^4) - CSS framework
- `lucide-react` (^0.555.0) - Icon library
- `react-phone-number-input` (^3.4.14), `libphonenumber-js` (^1.12.29) - Phone validation
- `twilio` (^5.10.6) - SMS/communication services
- `@google-cloud/recaptcha-enterprise` (^6.3.1) - Security
- `date-fns` (^4.1.0) - Date utilities
- `react-hot-toast` (^2.6.0) - Toast notifications
- `cookies-next` (^6.1.1) - Cookie management

**Development Dependencies**:
- `@playwright/test` (^1.57.0) - E2E testing
- `eslint` (^9), `eslint-config-next` (16.0.7) - Linting
- `typescript` (^5) - Type checking
- `supabase` (^2.64.1) - Supabase CLI
- `@types/*` - TypeScript type definitions for React, Node, Firebase, etc.

## Build & Installation

```bash
npm install
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run gen:types    # Generate Supabase TypeScript types
```

## Main Files & Resources

**Entry Points**:
- `src/app/page.tsx` - Home page (phone entry)
- `src/app/dashboard/page.tsx` - User dashboard
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/auth/login/page.tsx` - Login page

**Configuration Files**:
- `middleware.ts` - Route protection, authentication checks, admin verification
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript compiler options (path alias: `@/*` → `src/*`)
- `playwright.config.ts` - E2E test configuration
- `eslint.config.mjs` - ESLint rules
- `postcss.config.mjs` - PostCSS configuration
- `.env.local` - Environment variables (local development)

## Testing

**Framework**: Playwright (^1.57.0)  
**Test Location**: `tests/e2e/`  
**Naming Convention**: `*.spec.ts`  
**Configuration**: `playwright.config.ts`

**Test Specs**:
- `tests/e2e/login-and-announcements.spec.ts`
- `tests/e2e/admin-dashboard.spec.ts`
- `tests/e2e/settings.spec.ts`

**Test Configuration**:
- Uses web server: `npm run dev` on `http://localhost:3000`
- Projects: Chromium (Desktop Chrome)
- Trace: on-first-retry
- Test timeout: 120 seconds

**Run Tests**:
```bash
npx playwright test           # Run all tests
npx playwright test --ui      # Run with UI mode
npx playwright test --debug   # Debug mode
```

## Key Features

- **Phone Authentication**: Verified phone-based login with cookie persistence
- **Admin Routes**: Protected `/admin` routes with admin role verification via Supabase
- **Dashboard**: User-facing dashboard with announcements and emergency contacts
- **Middleware Protection**: Route-level authentication and authorization checks
- **Offline Support**: Offline page for connectivity issues
- **Responsive Design**: Tailwind CSS for mobile and desktop
