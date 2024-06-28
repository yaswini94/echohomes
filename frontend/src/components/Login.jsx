import React, { useState } from 'react';
import supabase from '../supabaseClient';
import './Forms.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Logged in successfully!');
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <img src="../assets/echohomes.png" alt="Logo"></img>
      <h2 className="form-title">Login</h2>
      <div className="form-field">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="form-input" placeholder="you@example.com" required />
      </div>
      <div className="form-field">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="form-input" placeholder="axrZ12" required />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">{loading ? 'Loading...' : 'Login'}</button>
      </div>
      {message && <p className="form-message">{message}</p>}

      <div className='top-margin'>
        <span style={{color: 'black'}}>Don’t have an account? </span><a href="/register">Sign up</a>
      </div>
    </form>
  );
};

export default LoginForm;
