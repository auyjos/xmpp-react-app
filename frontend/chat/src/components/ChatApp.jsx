// ChatApp.jsx
import React, { useState } from 'react';
import FriendList from './FriendList/FriendList';
import ChatWindow from './Chat/ChatWindow'; // Asegúrate de tener un componente ChatWindow
import { useChatContext } from './ChatLogic/ChatProvider'; // Asegúrate de tener la referencia correcta
import ToolboxIcon from './Top/ToolboxIcon'
import FriendRequest from './Chat/FriendRequest';
const ChatApp = ({ isAuthenticated }) => {
    const [selectedJid, setSelectedJid] = useState(null);
    const { sendMessage } = useChatContext(); // Extraer sendMessage del contexto

    const handleFriendClick = (jid) => {
        setSelectedJid(jid);
    };

    const closeChat = () => {
        setSelectedJid(null);
    };

    return (
        <div style={{ display: 'flex' }}>
            <ToolboxIcon/>
            <FriendRequest/>
            <FriendList onFriendClick={handleFriendClick} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedJid ? (
                    <div style={{ flex: 1, marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f1f1', padding: '5px' }}>
                        </div>
                        <ChatWindow jid={selectedJid} sendMessage={sendMessage} />
                        
                    </div>
                ) : (
                    <p>Select a friend to start chatting</p>
                    
                )}
            </div>
        </div>
    );
};

export default ChatApp;
