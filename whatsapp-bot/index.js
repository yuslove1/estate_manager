require('dotenv').config();

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Schema for Session
const SessionSchema = new mongoose.Schema({
    _id: String,
    data: Object
});
const Session = mongoose.model('Session', SessionSchema);

// Custom MongoDB Auth State
const useMongoDBAuthState = async (collection) => {
    const writeData = async (data, id) => {
        const serialized = JSON.parse(JSON.stringify(data, (key, value) => {
            if (typeof value === 'bigint') return 'BIGINT::' + value.toString();
            if (value?.type === 'Buffer' && Array.isArray(value?.data)) {
                return { __type: 'buffer', data: value.data };
            }
            return value;
        }));
        
        await collection.replaceOne(
            { _id: id },
            { _id: id, data: serialized },
            { upsert: true }
        );
    };

    const readData = async (id) => {
        const result = await collection.findOne({ _id: id });
        if (result?.data) {
            return JSON.parse(JSON.stringify(result.data), (key, value) => {
                if (typeof value === 'string' && value.startsWith('BIGINT::')) {
                    return BigInt(value.slice(8));
                }
                if (value?.__type === 'buffer' && Array.isArray(value?.data)) {
                    return Buffer.from(value.data);
                }
                return value;
            });
        }
        return null;
    };

    const removeData = async (id) => {
        await collection.deleteOne({ _id: id });
    };

    const creds = await readData('creds') || (await import('@whiskeysockets/baileys')).initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            const { proto } = await import('@whiskeysockets/baileys');
                            value = proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            if (value) {
                                let toStore = value;
                                if (value?.toJSON && typeof value.toJSON === 'function') {
                                    toStore = value.toJSON();
                                }
                                tasks.push(writeData(toStore, key));
                            } else {
                                tasks.push(removeData(key));
                            }
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => writeData(creds, 'creds')
    };
};

let sock;
let isReady = false;

const startSock = async () => {
    console.log('Connecting to MongoDB...');
    if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } else {
        console.warn('No MONGODB_URI found, sessions will not persist!');
    }

    const { state, saveCreds } = await useMongoDBAuthState(Session.collection);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // We handle this manually now
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        generateHighQualityLinkPreview: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('QR RECEIVED');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startSock();
            } else {
                console.log('Connection closed. You are logged out.');
                isReady = false;
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            isReady = true;
        }
    });
};

startSock();

app.post('/send-otp', async (req, res) => {
    if (!isReady || !sock) {
        return res.status(503).json({ error: 'WhatsApp client not ready yet' });
    }

    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Missing phone or otp' });
    }

    // Format phone number for WhatsApp (remove +, ensure 234 prefix)
    // WhatsApp ID format: 2348012345678@s.whatsapp.net
    let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '234' + formattedPhone.slice(1);
    }
    
    const jid = `${formattedPhone}@s.whatsapp.net`;
    const message = `Your Brentfield Gate verification code is: *${otp}*`;

    try {
        await sock.sendMessage(jid, { text: message });
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
