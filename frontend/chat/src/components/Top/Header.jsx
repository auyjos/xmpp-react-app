import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import SetPresence from './SetPresence';
import Toolbox from './ToolboxIcon'
const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Toolbox/>
                <SetPresence/>
                         </Container>
        </Navbar>
    );
};

export default Header;
