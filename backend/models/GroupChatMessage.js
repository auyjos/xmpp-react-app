// models/GroupChatMessage.js
const mongoose = require('mongoose');

const groupChatMessageSchema = new mongoose.Schema({
    conference: { type: String, required: true },
    from: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const GroupChatMessage = mongoose.model('GroupChatMessage', groupChatMessageSchema);

module.exports = GroupChatMessage;
