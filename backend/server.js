
const clu = require('@socket.io/cluster-adapter')
const express = require('express');
const cors = require('cors');
const http = require('http');
const axios = require('axios')
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




const extractUsername = (jid) => {
    const parts = jid.split('@');
    return parts[0];
};


xmpp.on('error', err => {
    console.error(err);
});

xmpp.on('presence', (from, show, status) => {
    console.log(`Presence update from ${from}: ${show} - ${status}`);
    xmpp.setPresence('online', 'online')
});



io.on('connection', async (socket) => {
    socket.on('socket-send', async (msg, clientOffset, callback) => {
        console.log(`IO: chat: ${msg}:${clientOffset}:${callback}`)
        xmpp.send('auco123@alumchat.lol', msg);
    });

    // socket.on('probe', (jid, callback) => {
    //     xmpp.probe(jid, (err, state) => {
    //         if (err) {
    //             callback({ error: 'Failed to probe JID', details: err.message });
    //             return;
    //         }

    //         // Enviar el estado a todos los clientes conectados
    //         io.emit('chatstate-update', { jid, state });
    //         callback({ jid, state });
    //     });

    // });

    socket.on('subscription-request', (from) => {
        // Emitir el evento de solicitud de amistad
        socket.broadcast.emit('subscription-request', from);
    });

    // Aceptar la suscripción desde el frontend
    socket.on('accept-subscription', (from) => {
        try {
            xmpp.acceptSubscription(from);
            // Confirmar al frontend que la suscripción fue aceptada
            io.emit('subscription-accepted', from);
        } catch (err) {
            console.error('Error accepting subscription:', err);
            // Notificar al frontend sobre el error, si es necesario
            io.emit('subscription-error', { from, error: err.message });
        }
    });

    // Rechazar la suscripción desde el frontend
    socket.on('reject-subscription', (from) => {
        try {
            xmpp.rejectSubscription(from);
            // Confirmar al frontend que la suscripción fue rechazada
            io.emit('subscription-rejected', from);
        } catch (err) {
            console.error('Error rejecting subscription:', err);
            // Notificar al frontend sobre el error, si es necesario
            io.emit('subscription-error', { from, error: err.message });
        }
    });

    socket.on('request-status', (jid) => {
        try {
            xmpp.probe(jid, (status, statusText) => {
                console.log(`Status for ${jid}: ${status}`);
                console.log(`Status text: ${statusText}`);

                // Enviar el estado al frontend
                socket.emit('status', { from: jid, state: status, statusText });
            });
        } catch (error) {
            console.error('Error probing status:', error);
            socket.emit('status-error', { from: jid, error: 'Failed to retrieve status' });
        }
    });

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Client joined room ${room}`);
    });


    socket.on('send-group-message', ({ room, message }) => {
        console.log(`Received message for room ${room}: ${message}`);

        // Envía el mensaje a través de XMPP si es necesario
        try {
            xmpp.send(room, message, true); // Enviar a XMPP si lo necesitas
        } catch (err) {
            console.error('Error sending message through XMPP:', err.message);
        }
    });

});



xmpp.on('chat', (from, message, test) => {
    console.log(`Message from ${from}: ${message}: ${test}`);

    io.emit('socket-chat', { from, message });
    console.log('Event emitted: message', { from, message });
});


xmpp.on('buddy', function (jid, state, statusText, resource) {
    console.log('%s is in %s state - %s -%s', jid, state, statusText, resource);
    io.emit('status', { from: jid, state, statusText });
});


xmpp.on('subscribe', from => {
    console.log(`Subscription request from ${from}`);
    // En lugar de aceptar directamente, emite un evento al frontend
    io.emit('subscription-request', from);
});

// Evento para manejar cambios de presencia
xmpp.on('presence', (from, show, status) => {
    console.log(`Presence update from ${from}: ${show} - ${status}`);
    io.emit('presence-update', { from, show, status });
});

xmpp.on('chatstate', (from, chatstate) => {
    console.log(`${from} is currently ${chatstate}`);

    // Emitir el estado de chat al cliente conectado
    io.emit('chatstate-update', { from, chatstate });
});



let connectedUser = null;


const ensureAuthenticated = (req, res, next) => {
    if (!connectedUser) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};
const login = (jid, password, res) => {
    // Manejador de errores para la conexión
    const errorHandler = (err) => {
        console.error(err);
        res?.status(401).json({ message: 'XMPP authentication failure' });

        cleanup();
    };

    // Manejador para la conexión exitosa
    const onlineHandler = (data) => {
        console.log('Connected with JID:', data.jid.user);
        console.log('Yes, I\'m connected!');
        res?.json({ message: 'Login successful!' });
        cleanup();
    };

    // Función de limpieza para eliminar manejadores de eventos
    function cleanup() {
        xmpp.removeListener('error', errorHandler);
        xmpp.removeListener('online', onlineHandler);
    }

    // Registrar manejadores de eventos
    xmpp.on('error', errorHandler);
    xmpp.on('online', onlineHandler);

    // Conectar con el servidor 

    xmpp.connect({
        jid,
        password,
        host: 'alumchat.lol',
        port: 5222,
        reconnect: false,
        skipPresence: false,
        preferred: 'PLAIN',
        disallowSSL: true
    });

    connectedUser = jid;




}



const logout = (res) => {
    // Manejadores de eventos para cerrar sesión
    const errorHandler = (err) => {
        console.error(err);
        res?.status(500).json({ message: 'Error during logout' });
        cleanup();
    };

    const closeHandler = () => {
        res?.json({ message: 'Logout successful!' });
        cleanup();
    };

    function cleanup() {
        xmpp.removeListener('error', errorHandler);
        xmpp.removeListener('close', closeHandler);
    }

    xmpp.on('error', errorHandler);
    xmpp.on('close', closeHandler);

    // Llamar a la función de desconexión
    xmpp.disconnect();
}


// Endpoints
app.post('/login', (req, res) => {
    const { jid, password } = req.body;
    login(jid, password, res);
});

app.post('/logout', (req, res) => {
    logout(res)
});

app.get('/roster', (req, res) => {
    xmpp.getRoster((err, roster) => {
        if (err) {
            console.error('Error retrieving roster:', err);
            res.status(500).json({ error: 'Error retrieving roster' });
            return;
        }
        res.json({ roster });
        console.log(roster)
    });
});


app.post('/register', (req, res) => {
    const { server, username, password } = req.body;

    // axios.post('http://localhost:3000/login', {
    //     jid: admin_user.jid,
    //     password: admin_user.password,
    // }).then(() => {
    xmpp.register(server, username, password, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }

        // try {
        //     logout();
        // }
        // catch (e) {
        //     console.log(e)
        // }
        res.status(200).json({ message: result });
    });
})

app.post('/delete-account', ensureAuthenticated, (req, res) => {
    const { password } = req.body;

    if (!connectedUser) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    xmpp.deleteAccount('alumchat.lol', connectedUser, password, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        connectedUser = null; // Limpiamos el usuario conectado
        res.status(200).json({ message: result });
        xmpp.disconnect();
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
        console.log(xmpp.setPresence(show, status))
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

app.get('/accept-friend-request', (req, res) => {
    const { from } = req.query; // Usa req.query en lugar de req.body para parámetros de consulta en GET

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

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('/path/to/save', filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath); // This will prompt the user to download the file
    } else {
        res.status(404).send('File not found');
    }
});

app.post('/send-file', (req, res) => {
    const { to, filePath } = req.body;

    if (!to || !filePath) {
        return res.status(400).json({ error: 'Missing "to" or "filePath" field' });
    }

    xmpp.sendFile(to, filePath, (err, message) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send file', details: err.message });
        }
        res.status(200).json({ message: message });
    });
});

app.post('/unsubscribe', (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ error: 'Missing "to" field' });
    }

    try {
        console.log(`Sending unsubscribe request to ${to}`);
        xmpp.unsubscribe(to);
        res.status(200).json({ message: 'Unsubscribe request sent' });
    } catch (error) {
        console.error('Failed to send unsubscribe request:', error);
        res.status(500).json({ error: 'Failed to send unsubscribe request', details: error.message });
    }
});

app.post('/send-file', (req, res) => {
    xmppClient.sendFileBase64('auco123@alumchat.lol', './test.txt', (err, message) => {
        if (err) {
            console.error('Failed to send file:', err);
        } else {
            console.log(message);
        }
    });
});

xmpp.on('groupbuddy', function (conference, from, state, statusText) {
    console.log('%s: %s is in %s state - %s', conference, from, state, statusText);
    io.emit('socket-groupbuddy', { conference, from, state, statusText });
});

xmpp.on('groupchat', function (conference, from, message) {
    console.log('%s says %s on %s', from, message, conference);
    io.emit('socket-groupchat', { conference, from, message });
});

xmpp.on('message', function (msg) {
    const type = msg.attrs.type; // Verifica el tipo de mensaje
    const from = msg.attrs.from;
    const x = msg.getChild('x', 'http://jabber.org/protocol/muc#user');

    if (type === 'chat' || type === 'groupchat') { // Manejar tipos relevantes
        if (x) {
            const invite = x.getChild('invite');
            if (invite) {
                const room = msg.attrs.from;
                const inviter = invite.attrs.from;
                const reason = invite.getChildText('reason');

                console.log(`Invitación recibida de ${inviter} para unirse a la sala ${room}`);
                if (reason) {
                    console.log(`Razón: ${reason}`);
                }
            }
        }
    }

    return true;
});



app.post('/join-room', (req, res) => {
    const { room, nickname, password } = req.body;
    try {
        xmpp.join(`${room}/${nickname}`, password);
        res.json({ message: `Joined room ${room} as ${nickname}` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});




// Configurar el manejo de mensajes de grupo
xmpp.on('groupchat', (conference, id, message) => {
    console.log(`[Grupo: ${conference}] ${id}: ${message}`);
    // Emitir el mensaje a todos los clientes conectados a la sala
    io.to(conference).emit('group-message', { text: message, from: id });
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
