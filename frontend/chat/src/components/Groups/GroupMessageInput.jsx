import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Form, Button } from 'react-bootstrap';

const GroupMessageInput = ({ onSendMessage }) => {
    const [messageText, setMessageText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleChange = (e) => {
        setMessageText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            onSendMessage(messageText);
            setMessageText('');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessageText(messageText + emojiObject.emoji);
    };

    return (
        <div style={{ padding: '10px', borderTop: '1px solid #ccc', position: 'relative' }}>
            <Form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={handleChange}
                    style={{ width: '70%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <Button
                    type="submit"
                    variant="primary"
                    style={{ marginLeft: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white' }}
                >
                    Send
                </Button>
                <Button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ marginLeft: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#ffc107', color: 'white' }}
                >
                    😊
                </Button>
            </Form>
            {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '50px', right: '0' }}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
};

export default GroupMessageInput;
