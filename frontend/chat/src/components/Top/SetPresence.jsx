import React, { useState } from 'react';
import { Button, Form, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';

// Definimos el objeto STATUS
const STATUS = {
    AWAY: "away",
    DND: "dnd",
    XA: "xa",
    ONLINE: "online",
    OFFLINE: "offline"
};

const SetPresence = () => {
    const [show, setShow] = useState(STATUS.ONLINE); // Valor por defecto
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/set-presence', { show, status });
            alert('Presence updated successfully');
        } catch (error) {
            alert('Failed to update presence');
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formPresence">
                        <Col xs={12} md={6}>
                            <Form.Control 
                                as="select" 
                                value={show} 
                                onChange={(e) => setShow(e.target.value)} 
                                required
                                className="mb-3"
                            >
                                <option value={STATUS.ONLINE}>Online</option>
                                <option value={STATUS.AWAY}>Away</option>
                                <option value={STATUS.DND}>Do Not Disturb</option>
                                <option value={STATUS.XA}>Extended Away</option>
                                <option value={STATUS.OFFLINE}>Offline</option>
                            </Form.Control>
                        </Col>
                        <Col xs={12} md={12}>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter status message" 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mb-3"
                            />
                        </Col>
                        <Col xs={10} className="d-flex justify-content-end">
                            <Button type="submit" variant="primary">
                                Update Presence
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default SetPresence;
