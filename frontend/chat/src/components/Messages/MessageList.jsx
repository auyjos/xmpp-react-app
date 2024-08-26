import React, { useEffect, useState } from 'react';
import { useChatContext } from '../ChatLogic/ChatProvider';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { extractUser } from '../../utils';


const MessageList = ({ selectedJid }) => {
    const { messages } = useChatContext();
    const [filteredMessages, setFilteredMessages] = useState([]);
    console.log(messages)

    const extractUsername = (jid) => {
        const parts = jid.split('@');
        return parts[0];
    };

    useEffect(()=> {
        if (messages && selectedJid) {
            console.log('---',messages)
            setFilteredMessages(
                messages.filter(msg => extractUser(msg.from) === selectedJid || (msg?.to === selectedJid && msg.from === 'me')
            )
            )
        }
    }, [messages, selectedJid])


    return (
        <ListGroup variant="flush">
            {filteredMessages.map((msg, index) => (
                <ListGroupItem
                    key={index}
                    className={`d-flex ${msg.from === 'me' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                    <div
                        style={{
                            maxWidth: '75%',
                            backgroundColor: msg.from === 'me' ? '#007bff' : '#f8f9fa',
                            color: msg.from === 'me' ? 'white' : 'black',
                            borderRadius: '15px',
                            padding: '10px',
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>{extractUsername(msg.from)}</strong>
                        </div>
                        <div>{msg.text}</div>
                    </div>
                </ListGroupItem>
            ))}
        </ListGroup>
    );
};

export default MessageList;
