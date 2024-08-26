import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import { extractUser } from '../../utils';
import './FriendStatus.css'; // Asegúrate de crear este archivo para los estilos

const FriendStatus = ({ jid }) => {
    const [status, setStatus] = useState({ state: 'offline', statusText: 'N/A' });
    const [chatState, setChatState] = useState('inactive'); // Estado de chat inicial
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketIo = io('http://localhost:3000');
        setSocket(socketIo);

        // Escuchar el evento 'status' para recibir la presencia del usuario
        socketIo.on('status', ({ from, state, statusText }) => {
            console.log('sstatus',from, jid, from === jid)
            if (from === jid) {
                setStatus({ state, statusText });
            }
        });

        // Escuchar el evento 'status-error' en caso de error al obtener la presencia
        socketIo.on('status-error', ({ from, error }) => {
            if (from === jid) {
                setStatus({ state: 'offline', statusText: error });
            }
        });

        // Escuchar el evento 'chatstate-update' para actualizar el estado de chat
        socketIo.on('chatstate-update', (chatStateFromBe) => {
            console.log(chatStateFromBe)
            console.log(chatStateFromBe, chatStateFromBe.from === jid)
            if (extractUser(chatStateFromBe.from) === jid) {
                setChatState(chatStateFromBe.chatstate);
            }
        });

        // Solicitar el estado de presencia al montar el componente
        socketIo.emit('request-status', jid);

        return () => {
            socketIo.disconnect();
        };
    }, [jid]);

    const statusIcon = {
        online: 'https://img.icons8.com/ios-filled/50/4caf50/visible.png', // Verde
        away: 'https://img.icons8.com/ios-filled/50/ffeb3b/clock.png', // Amarillo
        dnd: 'https://img.icons8.com/ios-filled/50/f44336/do-not-disturb.png', // Rojo
        xa: 'https://img.icons8.com/ios-filled/50/9e9e9e/holiday.png', // Gris
        offline: 'https://img.icons8.com/ios-filled/50/9e9e9e/visible.png' // Gris
    };

    // Función para obtener la primera letra del JID
    const getInitials = (jid) => {
        if (!jid) return '';
        return jid.charAt(0).toUpperCase();
    };

    return (
        <div className="friend-status-container">
            <Avatar
                name={jid}
                src=""
                className="friend-avatar"
            >
                {getInitials(jid)}
            </Avatar>
            <div className="status-info ms-3">
                <img 
                    src={statusIcon[status.state] || statusIcon['offline']} 
                    alt={status.state} 
                    className="status-icon"
                />
                <small className="status-text text-muted ms-2">{status.statusText}</small>
                <small className="status-text text-muted ms-2">
                    {chatState}
                </small>
            </div>
        </div>
    );
};

export default FriendStatus;
