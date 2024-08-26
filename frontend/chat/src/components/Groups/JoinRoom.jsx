// JoinRoom.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const JoinRoom = () => {
    const [form, setForm] = useState({ room: '', nickname: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/join-room', form);
            setMessage(response.data.message);
            setError('');

            // Obtener la lista de rooms existente desde localStorage
            const savedRooms = JSON.parse(localStorage.getItem('rooms')) || [];

            // Agregar el nuevo room si no está en la lista
            if (!savedRooms.includes(form.room)) {
                savedRooms.push(form.room);
                localStorage.setItem('rooms', JSON.stringify(savedRooms));
            }

            // Guardar el room actual en localStorage
            localStorage.setItem('currentRoom', form.room);

            // Abrir una nueva ventana para el chat
            window.open(`/chat/${form.room}`, '_blank');

        } catch (err) {
            setError(err.response ? err.response.data.error : err.message);
            setMessage('');
        }
    };

    return (
        <div style={{ width: '250px', padding: '10px' }}>
            <h5>Join Room</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRoom">
                    <Form.Label>Room</Form.Label>
                    <Form.Control
                        type="text"
                        name="room"
                        value={form.room}
                        onChange={handleChange}
                        required
                        size="sm"
                    />
                </Form.Group>
                <Form.Group controlId="formNickname">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                        type="text"
                        name="nickname"
                        value={form.nickname}
                        onChange={handleChange}
                        required
                        size="sm"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        size="sm"
                        autoComplete="off"
                    />
                </Form.Group>
                <Button type="submit" variant="primary" size="sm" className="w-100 mt-2">
                    Join Room
                </Button>
            </Form>
            {message && <Alert variant="success" style={{ fontSize: '0.8rem' }}>{message}</Alert>}
            {error && <Alert variant="danger" style={{ fontSize: '0.8rem' }}>{error}</Alert>}
        </div>
    );
};

export default JoinRoom;
