import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import io from 'socket.io-client';

const FriendRequest = () => {
    const [requests, setRequests] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io('http://localhost:3000');
        setSocket(socketInstance);

        socketInstance.on('subscription-request', (from) => {
            setRequests((prevRequests) => [...prevRequests, from]);
        });

        socketInstance.on('subscription-accepted', (from) => {
            // Puedes manejar la notificación de aceptación si es necesario
            console.log(`Subscription accepted by ${from}`);
        });

        socketInstance.on('subscription-rejected', (from) => {
            // Puedes manejar la notificación de rechazo si es necesario
            console.log(`Subscription rejected by ${from}`);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const handleAccept = (from) => {
        if (socket) {
            socket.emit('accept-subscription', from);
        }
        setRequests(requests.filter(request => request !== from));
    };

    const handleReject = (from) => {
        if (socket) {
            socket.emit('reject-subscription', from);
        }
        setRequests(requests.filter(request => request !== from));
    };

    return (
        <>
            {requests.map((from, index) => (
                <Modal key={index} show={true} onHide={() => handleReject(from)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Friend Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{`${from} has sent you a friend request.`}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleReject(from)}>
                            Reject
                        </Button>
                        <Button variant="primary" onClick={() => handleAccept(from)}>
                            Accept
                        </Button>
                    </Modal.Footer>
                </Modal>
            ))}
        </>
    );
};

export default FriendRequest;
