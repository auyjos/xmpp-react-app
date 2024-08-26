// RoomsList.jsx
import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener la lista de rooms desde localStorage
        const savedRooms = JSON.parse(localStorage.getItem('rooms')) || [];
        setRooms(savedRooms);
    }, []);

    const handleClick = (room) => {
        navigate(`/chat/${room}`); // Redirigir a la página de chat del room seleccionado
    };

    return (
        <div style={{ padding: '10px' }}>
            <h5>Rooms</h5>
            <ListGroup>
                {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                        <ListGroup.Item
                            key={index}
                            onClick={() => handleClick(room)}
                            style={{ cursor: 'pointer' }}
                        >
                            {room}
                        </ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item>No rooms available</ListGroup.Item>
                )}
            </ListGroup>
            <RoomsList/>
        </div>
    );
};

export default RoomsList;
