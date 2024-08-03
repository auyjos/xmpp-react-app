const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const xmpp = require('./xmpp_client');
const socketIo = require('socket.io');
const app = express();
const PORT = 3000;



const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// XMPP event handlers
xmpp.on('online', data => {
    console.log('Connected with JID:', data.jid.user);
    console.log('Yes, I\'m connected!');
});

xmpp.on('error', err => {
    console.error(err);
});

xmpp.on('chat', (from, message) => {
    console.log(`Message from ${from}: ${message}`);
    io.emit('message', { from, message });
    console.log('Event emitted: message', { from, message });
});

xmpp.on('subscribe', from => {
    console.log(`Subscription request from ${from}`);
    if (from === 'a.friend@gmail.com') {
        xmpp.acceptSubscription(from);
    }
});

// Endpoints
app.post('/login', (req, res) => {
    const { jid, password } = req.body;

    const errorHandler = (err) => {
        console.error(err);
        res.status(401).json({ message: 'XMPP authentication failure' });
        cleanup();
    };

    const onlineHandler = () => {
        res.json({ message: 'Login successful!' });
        cleanup();
    };

    function cleanup() {
        xmpp.removeListener('error', errorHandler);
        xmpp.removeListener('online', onlineHandler);
    }

    xmpp.on('error', errorHandler);
    xmpp.on('online', onlineHandler);

    xmpp.connect({
        jid,
        password,
        host: 'alumchat.lol',
        port: 5222,
        reconnect: true,
        skipPresence: false,
        preferred: 'PLAIN',
        disallowSSL: true
    });
    xmpp.setPresence('online', 'online');
    xmpp.setChatstate('auy@alumchat.lol', 'online');
});

app.post('/logout', (req, res) => {
    xmpp.disconnect();
    res.json({ message: 'Logout successful!' });
});

// Endpoint para enviar un mensaje
app.post('/send-message', (req, res) => {
    const { to, message, group } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Missing "to" or "message" field' });
    }

    try {
        xmpp.send(to, message, group);
        res.status(200).json({ message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
