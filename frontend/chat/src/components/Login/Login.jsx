import React, { useState } from 'react';
import './login.css'; // Importa el archivo de estilos

const Login = ({ onLoginSuccess }) => {
    const [jid, setJid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jid, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(jid); // Pasar el jid en caso de autenticación exitosa
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred while trying to log in');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="jid">JID:</label>
                    <input
                        id="jid"
                        type="text"
                        value={jid}
                        onChange={(e) => setJid(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
