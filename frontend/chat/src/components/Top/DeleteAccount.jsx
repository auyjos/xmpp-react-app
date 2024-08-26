import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const DeleteAccount = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar la solicitud de eliminación
            await axios.post('http://localhost:3000/delete-account', { password });
            setSuccess('Account deleted successfully');
            setError('');
            setPassword('');
        } catch (error) {
            setError('Failed to delete account. You may not be authenticated.');
            setSuccess('');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button type="submit" variant="danger" className="mt-3">
                Delete Account
            </Button>
        </Form>
    );
};

export default DeleteAccount;
