import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import MessageList from '../Messages/MessageList';
import { useChatContext } from '../ChatLogic/ChatProvider';
import FriendStatus from '../FriendList/FriendStatus';
import MessageInput from '../Messages/MessageInput';
import { getUserId } from '../../utils';

const userId = getUserId()

const ChatWindow = ({ jid, sendMessage }) => {
    const [messages, setMessages] = useState([]);

    console.log(jid)


    const handleSendMessage = (messageText) => {
        const newMessage = { text: messageText, from: userId, to: jid };
        setMessages([...messages, newMessage]);

        // Enviar el mensaje usando la función del contexto
        sendMessage(newMessage);
    };
    return (
        <Container fluid className="d-flex flex-column vh-100">
            <Card className="flex-grow-1 flex-wrap">
                <Card.Header className="d-flex align-items-center">
                <FriendStatus jid={jid} /> 

                </Card.Header>
                <Card.Body className="d-flex flex-column overflow-auto">
                    <div className="flex-grow-1">
                        <MessageList  selectedJid={jid}/>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <MessageInput onSendMessage={handleSendMessage} />
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default ChatWindow;
