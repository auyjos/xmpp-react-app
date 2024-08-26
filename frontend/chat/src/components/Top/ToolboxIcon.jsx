import React, { useState } from 'react';
import { Offcanvas, Button, Container } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa';
import Register from './Register';
import DeleteAccount from './DeleteAccount';
import Logout from './Logout';

const ToolBoxIcon = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button 
                variant="primary" 
                onClick={handleShow} 
                style={{ 
                    position: 'fixed', 
                    top: '20px', 
                    right: '20px', 
                    zIndex: 1000  // Asegura que el botón esté sobre otros elementos
                }}
            >
                <FaTools /> {/* Icono de toolbox */}
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>ToolBox</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Container>
                        <h4>Register Account</h4>
                        <Register /> {/* Componente de registro */}
                        
                        <h4 className="mt-4">Delete Account</h4>
                        <DeleteAccount /> {/* Componente de eliminación */}
                        
                        <h4 className="mt-4">Logout</h4>
                        <Logout /> {/* Componente de logout */}
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default ToolBoxIcon;
