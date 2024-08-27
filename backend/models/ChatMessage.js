const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    text: String,
    from: String,
    to: String, // Agregar campo 'to' para el destinatario
    timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
