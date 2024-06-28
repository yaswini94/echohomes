import React, { useState } from 'react';
import supabase from '../supabaseClient';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) setMessage(error.message);
        else setMessage('Logged in successfully!');
        setLoading(false);
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
                <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
            </div>
            {message && <p>{message}</p>}
        </form>
    );
};

export default LoginForm;
