// Logout.jsx
import React from 'react';
import { Button, Alert } from 'react-bootstrap';

const Logout = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Aquí puedes redirigir al usuario a la página de inicio de sesión
            window.location.href = '/login'; // Ajusta la ruta de acuerdo a tu configuración
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out.');
        }
    };

    return (
        <div>
            <Button onClick={handleLogout} variant="danger">
                Logout
            </Button>
        </div>
    );
};

export default Logout;
