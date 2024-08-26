import React, { useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import { ListGroup, Button, Alert, Form, Modal, Spinner } from 'react-bootstrap';
import Header from '../Top/Header';
import SetPresence from '../Top/SetPresence';
import JoinRoom from '../Groups/JoinRoom';

const FriendList = ({ onFriendClick }) => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');
    const [newFriendJid, setNewFriendJid] = useState('');
    const [friendRequestStatus, setFriendRequestStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchFriends = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/roster');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFriends(data.roster); // Guardar la lista completa de amigos
            setError(undefined)
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends.');
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = () => {
        fetchFriends(); // Obtener amigos cuando se presiona el botón
    };

    const handleAddFriendSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to: newFriendJid }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setFriendRequestStatus(data.message || 'Friend request sent');
            setNewFriendJid(''); // Limpiar el campo de entrada
        } catch (error) {
            console.error('Error sending friend request:', error);
            setFriendRequestStatus('Failed to send friend request.');
        } finally {
            setShowModal(false); // Cerrar el modal después de enviar la solicitud
        }
    };

    const handleUnsubscribe = async (jid) => {
        try {
            const response = await fetch('http://localhost:3000/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to: jid }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setFriendRequestStatus(data.message || 'Unsubscribe request sent');
            fetchFriends(); // Actualizar la lista de amigos
        } catch (error) {
            console.error('Error sending unsubscribe request:', error);
            setFriendRequestStatus('Failed to send unsubscribe request.');
        }
    };


    useEffect(() => {
        let timeoutId;
        function checkModeChange() {
          const item = window.localStorage.getItem('authentication');

          console.log('Chequeando item', item)
    
          if (item ) {
            //Load friends
            timeoutId = setTimeout(() => {
                fetchFriends();
              }, 1000);
            
          }
        }

        if (friends?.length === 0) {
            checkModeChange();
            window.addEventListener('storage', checkModeChange);
        }
    
        return () => {
            clearTimeout(timeoutId);
          window.removeEventListener('storage', checkModeChange);
        };
    }, [friends]);
    

    return (
        <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
            <JoinRoom/>
            <SetPresence/>
            <h3>Friends</h3>
            <Button
                onClick={() => setShowModal(true)}
                className="mb-2 w-100" // Estilo mejorado
                variant="success"
                size="lg" // Tamaño grande para mayor visibilidad
            >
                Add Friend
            </Button>
            <Button
                onClick={handleButtonClick}
                className="mb-2 w-100" // Estilo mejorado
                variant="primary"
                size="lg" // Tamaño grande para mayor visibilidad
            >
                Load Friends
            </Button>
            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {friendRequestStatus && <Alert variant="info">{friendRequestStatus}</Alert>}
            {friends?.length !== 0 && (
                <ListGroup>
                    {friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <FriendItem
                                key={index}
                                jid={friend.jid}
                                onClick={onFriendClick}
                                onUnsubscribe={handleUnsubscribe} // Asegúrate de pasar esta prop
                            />
                        ))
                    ) : (
                        <ListGroup.Item>No friends to display</ListGroup.Item>
                    )}
                </ListGroup>
               
            )}
             
            {/* Modal para añadir amigos */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddFriendSubmit}>
                        <Form.Group controlId="formNewFriend">
                            <Form.Label>Enter Friend's JID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter friend's JID"
                                value={newFriendJid}
                                onChange={(e) => setNewFriendJid(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="success" className="w-100 mt-2">
                            Send Friend Request
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FriendList;
