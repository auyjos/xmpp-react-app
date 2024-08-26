// Register.jsx
import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
    const [server, setServer] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3000/register', { server, username, password });
            alert('Registration successful');
            setServer('');
            setUsername('');
            setPassword('');
        } catch (error) {
            alert('Failed to register');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formServer">
                <Form.Label column sm="3">Server</Form.Label>
                <Col sm="9">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter server address" 
                        value={server}
                        onChange={(e) => setServer(e.target.value)}
                        required
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formUsername">
                <Form.Label column sm="3">Username</Form.Label>
                <Col sm="9">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPassword">
                <Form.Label column sm="3">Password</Form.Label>
                <Col sm="9">
                    <Form.Control 
                        type="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Col>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
                Register
            </Button>
        </Form>
    );
};

export default Register;
