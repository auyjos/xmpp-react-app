import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';

const Chat = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  const handleSend = () => {
    if (message) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div>
      <MessageList messages={messages} />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
