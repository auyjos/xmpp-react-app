import React, { useEffect, useState, useCallback } from 'react';
import { useChatContext } from '../ChatLogic/ChatProvider';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { extractUser, getUserId } from '../../utils';
import axios from 'axios';


const userId = getUserId()
const extractUsername = (jid) => {
    const parts = jid.split('@');
    return parts[0];
};

const MessageList = ({ selectedJid }) => {
    const { messages } = useChatContext();
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [prevMessages, setPrevMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(messages)

    

    const fetchMessages = useCallback(async (to, from) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/messages', {
                params: { from, to }
            });
            setPrevMessages(response.data);
            setFilteredMessages((filtered) => [...(response?.data ?? []), ...filtered])
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(true);
        }
    }, []);

    useEffect(()=> {
        if (messages && selectedJid) {
            const filtered = messages.filter(msg => extractUser(msg.from) === selectedJid || (msg?.to === selectedJid && msg.from === userId))
            setFilteredMessages(
                [...prevMessages, ...filtered]
            )
            
            
        }
    }, [messages, prevMessages, selectedJid])


    useEffect(() => {
        if (selectedJid && userId  && filteredMessages.length === 0 ) {
            fetchMessages(selectedJid, userId);
        }
    }, [selectedJid, fetchMessages, prevMessages, filteredMessages.length]);


   return (
    <ListGroup variant="flush">
        {filteredMessages.map((msg, index) => (
            <ListGroupItem
                key={index}
                className={`d-flex ${msg.from === userId ? 'justify-content-end' : 'justify-content-start'}`}
            >
                <div
                    style={{
                        maxWidth: '75%',
                        backgroundColor: msg.from === userId ? '#007bff' : '#f8f9fa',
                        color: msg.from === userId ? 'white' : 'black',
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
