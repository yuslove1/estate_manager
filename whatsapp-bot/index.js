const { Client, LocalAuth, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

console.log('Initializing WhatsApp Client...');

const startClient = async () => {
    let authStrategy;

    if (process.env.MONGODB_URI) {
        console.log('Using RemoteAuth with MongoDB');
        await mongoose.connect(process.env.MONGODB_URI);
        const store = new MongoStore({ mongoose: mongoose });
        authStrategy = new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        });
    } else {
        console.log('Using LocalAuth (File System)');
        authStrategy = new LocalAuth();
    }

    const client = new Client({
        authStrategy: authStrategy,
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // Important for low-memory environments
                '--disable-gpu'
            ],
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

    client.on('remote_session_saved', () => {
        console.log('REMOTE SESSION SAVED');
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
};

startClient().catch(err => console.error(err));
