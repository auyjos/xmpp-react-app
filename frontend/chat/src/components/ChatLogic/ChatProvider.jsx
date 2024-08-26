import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatStates, setChatStates] = useState({});
    const [statCon, setStatus] = useState({});
    const socketRef = useRef(null);

    useEffect(() => {
        // Conectar al socket cuando el componente se monta
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3000');
        }

        const socket = socketRef.current;

        // Escuchar el evento 'roster' desde el backend
        socket.on('online', (data) => {
            setFriends(data.friends);
        });

        // Escuchar el evento 'socket-chat' para recibir mensajes
        socket.on('socket-chat', (msg) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: msg.message, from: msg.from }
            ]);
        });

        socket.on('chatstate-update', ({ from, state }) => {
            setChatStates(prevStates => ({
                ...prevStates,
                [from]: state
            }));
        });

        socket.on('status', ({ from, statconnection, statusText }) => {
            setStatus(prevStatuses => ({
                ...prevStatuses,
                [from]: { state: statconnection, statusText }
            }));
        });
        

        return () => {
            socket.off('online');
            socket.off('socket-chat');
            socket.off('chatstate-update');
            socketRef.current.disconnect();
            socketRef.current = null;
        };
    }, []);


    

    const sendMessage = (message) => {
        const socket = socketRef.current;
        console.log('----------!!!x`---',message.text)
        if (socket) {
            socket.emit('socket-send', message.text);
            
            setMessages([...messages, message]);

        }
    };
    const value = {
        friends,
        messages,
        sendMessage,
        chatStates,
        statCon
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
