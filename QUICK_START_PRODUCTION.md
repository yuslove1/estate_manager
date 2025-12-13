# Quick Start - Production Deployment

## 📋 Status: READY FOR PRODUCTION ✅

### What's Done ✅
- **Code Optimization**: Turbopack, minification, tree-shaking
- **Security**: Headers, middleware, environment variables
- **Performance**: Image optimization, caching, compression
- **Code Quality**: Linting ✓, TypeScript ✓, Build ✓
- **reCAPTCHA**: Fully integrated and tested

### What's Pending ⚠️
- **Image Compression** (4.8 MB → 400 KB per file)
- **Deployment** (Vercel, AWS, or self-hosted)

---

## 🚀 Quick Deploy

### Step 1: Compress Images (CRITICAL)
```bash
# Option A: Squoosh (web - no tools needed)
1. Go to squoosh.app
2. Drag & drop images from public/images/
3. Set quality: 85%, size ~400-900 KB
4. Download and replace files

# Option B: ImageMagick (if installed)
convert public/images/brentfieldDay.jpg -quality 85 public/images/brentfieldDay.jpg
convert public/images/estate1.jpg -quality 85 public/images/estate1.jpg
convert public/images/estate2.jpg -quality 75 public/images/estate2.jpg

# Option C: Do it locally
npm install imagemin imagemin-mozjpeg -D
npx imagemin public/images/ --out-dir=public/images/
```

### Step 2: Verify Everything
```bash
npm run lint         # ✓ MUST PASS
npm run build        # ✓ MUST PASS
npm start            # Test locally
```

### Step 3: Deploy

**Option A: Vercel (Easiest)**
```bash
npm install -g vercel
vercel login
vercel
# Follow prompts, set env variables in Vercel dashboard
```

**Option B: Self-Hosted**
```bash
# On your server:
npm install
npm run build
npm start

# Or use PM2 for production:
npm install -g pm2
pm2 start npm --name "brentfield" -- start
```

**Option C: Docker**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Essential Commands

```bash
# Development
npm run dev              # Hot reload (Turbopack)

# Production
npm run build            # Create optimized bundle
npm start                # Start server

# Code Quality
npm run lint             # Run ESLint
npm run gen:types        # Generate Supabase types

# Testing
npx playwright test      # Run E2E tests
npx playwright test --ui # Interactive mode
```

---

## 📌 Environment Variables

Copy to your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=https://sloefqrygmcuaismeiix.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=brentfieldcda-18784.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=brentfieldcda-18784
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=brentfieldcda-18784.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=808958913212
NEXT_PUBLIC_FIREBASE_APP_ID=1:808958913212:web:9200ca4b0e91cca2763eb9
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3SDWYTCLWX

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lf3NyUsAAAAACduU...

TWILIO_VERIFY_SERVICE_SID=VA0ffbdc...
TWILIO_ACCOUNT_SID=AC8d5b19...
TWILIO_AUTH_TOKEN=39cafa67...
TWILIO_WHATSAPP_NUMBER=+15312303686

TERMII_API_KEY=TLdbzqPx...
AFRICA_USERNAME=adexyuslove@gmail.com
AFRICA_API_KEY=atsk_88cc...
```

---

## ✅ Pre-Deployment Checklist

- [ ] Images compressed (< 5 MB total)
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm start` works locally
- [ ] All env variables configured
- [ ] Firebase domain whitelisted
- [ ] Supabase RLS enabled

---

## 🧪 Test After Deployment

```
[ ] Home page loads
[ ] Can enter phone number
[ ] reCAPTCHA appears
[ ] OTP sent successfully
[ ] OTP verification works
[ ] Dashboard accessible
[ ] Admin panel accessible (admin account)
[ ] Announcements work
[ ] Dark mode toggles
[ ] Blur background visible
[ ] Mobile responsive
```

---

## 📚 Detailed Guides

- **PRODUCTION_READY_REPORT.md** - Full optimization report
- **PRODUCTION_CHECKLIST.md** - Complete deployment guide
- **OPTIMIZATION_SUMMARY.md** - Technical details

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install`, clear `.next/` folder, try again |
| reCAPTCHA not showing | Verify domain in Firebase console |
| Phone login fails | Check Firebase domain whitelist |
| Admin panel 403 | Verify is_admin=true in database |
| Images loading slow | Compress using Squoosh or ImageMagick |
| Env variables undefined | Restart after setting vars in dashboard |

---

## 📞 Next Steps

1. **Today**: Compress images using Squoosh.app
2. **Tomorrow**: Deploy to production
3. **Next week**: Monitor logs and performance

---

**Everything is ready!** Just compress those images and deploy. 🚀

Last updated: 2025-12-13
