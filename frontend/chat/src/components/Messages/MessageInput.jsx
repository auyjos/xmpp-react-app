import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onSendMessage }) => {
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setInput(input + emojiObject.emoji);
    };

    return (
        <div style={{ padding: '10px', borderTop: '1px solid #ccc', position: 'relative' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ width: '70%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ marginLeft: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white' }}>
                    Send
                </button>
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ marginLeft: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#ffc107', color: 'white' }}
                >
                    😊
                </button>
            </form>
            {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '50px', right: '0' }}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
};

export default MessageInput;
