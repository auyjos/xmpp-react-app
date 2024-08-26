// GroupMessageList.jsx
import React from 'react';

import { ListGroup } from 'react-bootstrap';

const GroupMessageList = ({ messages, userJid }) => {
    // Filtra los mensajes para excluir los del usuario actual
    console.log(messages, userJid)
    const filteredMessages = messages.filter(msg => msg.from !== userJid);

    return (
        <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
            {filteredMessages.map((msg, index) => (
                <ListGroup.Item
                    key={index}
                    className={`d-flex ${msg.from === userJid ? 'justify-content-end' : 'justify-content-start'}`}
                >
                    <div
                        style={{
                            maxWidth: '75%',
                            backgroundColor: msg.from === userJid ? '#007bff' : '#f8f9fa',
                            color: msg.from === userJid ? 'white' : 'black',
                            borderRadius: '15px',
                            padding: '10px',
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>{msg.from}</strong>
                        </div>
                        <div>{msg?.text ?? msg?.message}</div>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default GroupMessageList;
