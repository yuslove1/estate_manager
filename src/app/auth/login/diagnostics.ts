export function checkFirebaseConfig() {
  if (process.env.NODE_ENV !== 'development') return;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓' : '✗ MISSING',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓' : '✗ MISSING',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓' : '✗ MISSING',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓' : '✗ MISSING',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓' : '✗ MISSING',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓' : '✗ MISSING',
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? '✓' : '✗ MISSING',
  };

  console.group('Firebase Configuration Check');
  Object.entries(config).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();

  return config;
}

export function checkDomainWhitelist() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return;
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const origin = window.location.origin;

  console.group('Domain Information');
  console.log('Hostname:', hostname);
  console.log('Protocol:', protocol);
  console.log('Origin:', origin);
  console.log('Full URL:', window.location.href);
  console.log('');
  console.log('To whitelist in Firebase Console:');
  console.log('1. Go to Firebase Console → Your Project → Authentication');
  console.log('2. Click Settings (gear icon) → Authorized Domains');
  console.log('3. Add:', hostname);
  console.groupEnd();
}
