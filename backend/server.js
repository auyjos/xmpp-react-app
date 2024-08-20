
const clu = require('@socket.io/cluster-adapter')
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const xmpp = require('./xmpp_client'); // Asegúrate de que este archivo sea correcto
const socketIo = require('socket.io');
const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = new socketIo.Server(server, {
    connectionStateRecovery: {},
    socketIo: clu.createAdapter(),
    cors: {
        origin: "*", //specific origin you want to give access to,
    },
});



app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.static('public'));

// XMPP event handlers
xmpp.on('online', data => {
    console.log('Connected with JID:', data.jid.user);
    console.log('Yes, I\'m connected!');
});

xmpp.on('error', err => {
    console.error(err);
});


xmpp.on('subscribe', from => {
    console.log(`Subscription request from ${from}`);
    xmpp.acceptSubscription(from);
});

io.on('connection', async (socket) => {
    socket.on('chat', async (msg, clientOffset, callback) => {
        console.log(msg)
        console.log(clientOffset)
        xmpp.send('auco123@alumchat.lol', msg);
    });
    xmpp.on('chat', (from, message) => {
        console.log(`Message from ${from}: ${message}`);

        io.emit('chat', { from, message });
        console.log('Event emitted: message', { from, message });
    });
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
});

app.post('/logout', (req, res) => {
    xmpp.disconnect();
    res.json({ message: 'Logout successful!' });
});

app.post('/register', (req, res) => {
    const { server, username, password } = req.body;

    xmpp.register(server, username, password, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        res.status(200).json({ message: result });
    });
});

app.post('/delete-account', (req, res) => {
    const { username, password } = req.body;

    // Conectar con el servidor utilizando las credenciales proporcionadas
    xmpp.connect({ jid: username, password, host: 'alumchat.lol', port: 5222 }, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to connect for account deletion' });
        }

        // Llamar a la función para eliminar la cuenta
        xmpp.deleteAccount('alumchat.lol', (err, result) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            res.status(200).json({ message: result });
            xmpp.disconnect();
        });
    });
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

// Endpoint para actualizar la presencia
app.post('/set-presence', (req, res) => {
    const { show, status } = req.body;

    if (!show) {
        return res.status(400).json({ error: 'Missing "show" field' });
    }

    try {
        xmpp.setPresence(show, status);
        res.status(200).json({ message: 'Presence updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update presence', details: error.message });
    }
});

// Endpoint for friend request
app.post('/friend-request', (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ error: 'Missing "to" field' });
    }

    try {
        console.log(`Sending friend request to ${to}`);
        xmpp.subscribe(to);
        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('Failed to send friend request:', error);
        res.status(500).json({ error: 'Failed to send friend request', details: error.message });
    }
});

// Endpoint for accepting a friend request
app.post('/accept-friend-request', (req, res) => {
    const { from } = req.body;

    if (!from) {
        return res.status(400).json({ error: 'Missing "from" field' });
    }

    try {
        console.log(`Accepting friend request from ${from}`);
        xmpp.acceptSubscription(from);
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Failed to accept friend request:', error);
        res.status(500).json({ error: 'Failed to accept friend request', details: error.message });
    }
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
