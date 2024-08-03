import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function MessageList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (data) => {
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    return (
        <div>
            <h1>Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <strong>{msg.from}:</strong> {msg.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MessageList;
