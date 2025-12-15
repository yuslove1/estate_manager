# WhatsApp OTP Bot

This bot sends OTP codes via your WhatsApp account.

## Setup

1. Open a terminal in this folder:
   ```bash
   cd whatsapp-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the bot:
   ```bash
   npm start
   ```

4. A QR code will appear in the terminal. Scan it with your WhatsApp (Linked Devices).

5. Keep this terminal running! The bot must be running to send OTPs.

## Database Requirement

You must add an `otp_code` column to your Supabase `residents` table.
Run this in the Supabase SQL Editor:

```sql
ALTER TABLE residents ADD COLUMN otp_code TEXT;
```
