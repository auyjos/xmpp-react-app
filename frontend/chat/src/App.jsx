import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatApp from './components/ChatApp';
import { ChatProvider } from './components/ChatLogic/ChatProvider';
import Login from './components/Login/Login';
import JoinRoom from './components/Groups/JoinRoom'; // Asegúrate de importar el componente JoinRoom
import GroupChat from './components/Groups/Groupchat'; // Asegúrate de importar el componente GroupChat

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = (response) => {
        console.log(response);
        setIsAuthenticated(true);
        localStorage.setItem('authentication', response);
    };

    return (
        <ChatProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <ChatApp isAuthenticated={isAuthenticated} /> : <Login onLoginSuccess={handleLoginSuccess} />}
                    />
                    <Route path="/join-room" element={<JoinRoom />} />
                    <Route path="/chat/:room" element={<GroupChat />} />
                </Routes>
            </Router>
        </ChatProvider>
    );
};

export default App;
