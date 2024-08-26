import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useChatContext } from '../ChatLogic/ChatProvider';
import GroupMessageList from './GroupMessageList';
import GroupMessageInput from './GroupMessageInput';
import io from 'socket.io-client';

// En GroupChat.jsx
const GroupChat = () => {
    const { room } = useParams();
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    // Obtener el JID del contexto o estado global
    const { jid } = useChatContext(); // Asumiendo que tienes `jid` en el contexto

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        // Unirse al room
        newSocket.emit('join-room', room);

        newSocket.on('group-message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [room]);

    const handleSendMessage = (messageText) => {
        const newMessage = { text: messageText, from: jid, room }; 
        setMessages([...messages, newMessage]);
        socket.emit('send-group-message', { room, message: messageText, from: jid }); 
    };

    return (
        <Container fluid className="d-flex flex-column vh-100 p-0">
            <Card className="flex-grow-1 d-flex flex-column">
                <Card.Header className="bg-primary text-white">
                    <h5>{room}</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column overflow-auto p-3">
                    <GroupMessageList messages={messages} />
                </Card.Body>
                <Card.Footer className="p-2">
                    <GroupMessageInput onSendMessage={handleSendMessage} />
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default GroupChat;

