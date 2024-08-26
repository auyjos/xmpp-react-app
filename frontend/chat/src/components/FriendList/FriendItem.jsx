import React, { useState } from 'react';
import { ListGroup, Button, Modal } from 'react-bootstrap';

const FriendItem = ({ jid, onClick, onUnsubscribe }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedJid, setSelectedJid] = useState('');

    const handleUnsubscribeClick = (jid) => {
        setSelectedJid(jid);
        setShowModal(true);
    };

    const handleConfirmUnsubscribe = () => {
        if (selectedJid) {
            onUnsubscribe(selectedJid);
        }
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedJid('');
    };

    return (
        <ListGroup.Item>
            <div>
                {jid}
                <Button 
                    onClick={() => onClick(jid)} 
                    variant="link" 
                    style={{ marginLeft: '10px' }}
                >
                    Chat
                </Button>
                <Button 
                    onClick={() => handleUnsubscribeClick(jid)} 
                    variant="danger" 
                    style={{ marginLeft: '10px' }}
                >
                    Unsubscribe
                </Button>
            </div>

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Unsubscribe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to unsubscribe from {jid}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmUnsubscribe}>
                        Unsubscribe
                    </Button>
                </Modal.Footer>
            </Modal>
        </ListGroup.Item>
    );
};

export default FriendItem;
