const express = require('express');
const { Client } = require('xmpp');

const app = express();
const port = 3001; // El puerto en el que se ejecutará el servidor

// Configuración del cliente XMPP
const xmppClient = new Client({
  jid: 'auy201579d@alumchat.lol',
  password: 'Fifa20jajaja@@@',
  server: 'alumchat.lol',
  port: 5222,
  useTLS: true,
});

xmppClient.on('online', () => {
  console.log('XMPP Client connected');
});

xmppClient.on('message', (msg) => {
  console.log(`Received message: ${msg.body}`);
});

xmppClient.on('error', (err) => {
  console.error('XMPP Client error:', err);
});

xmppClient.start();

// Rutas de la API
app.get('/status', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
