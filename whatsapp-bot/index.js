const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

console.log('Initializing WhatsApp Client...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let isReady = false;

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
    console.log('Please scan the QR code above with your WhatsApp.');
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isReady = true;
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.initialize();

app.post('/send-otp', async (req, res) => {
    if (!isReady) {
        return res.status(503).json({ error: 'WhatsApp client not ready yet' });
    }

    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Missing phone or otp' });
    }

    // Format phone number for WhatsApp (remove +, ensure 234 prefix)
    // WhatsApp ID format: 2348012345678@c.us
    let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '234' + formattedPhone.slice(1);
    }
    
    const chatId = `${formattedPhone}@c.us`;
    const message = `Your Brentfield Gate verification code is: *${otp}*`;

    try {
        await client.sendMessage(chatId, message);
        console.log(`OTP sent to ${formattedPhone}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(port, () => {
    console.log(`WhatsApp Bot API listening at http://localhost:${port}`);
});
