import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import './Forms.css';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    if (message === 'Registration successful! Check your email to verify your account.') {
      // Redirect to login after the message is set
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    }
  }, [message, history]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({ email, password }, {
      data: { name }
    });

    error ? setMessage(error.message) :
      setMessage('Registration successful! Check your email to verify your account.')

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="form">
      <img src="../assets/echohomes.png" alt="Logo"></img>
      <h2 className="form-title">Register</h2>
      <div className="form-field">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" id="name" value={name} onChange={event => setName(event.target.value)} required className="form-input" placeholder="James D"/>
      </div>
      <div className="form-field">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)} required className="form-input" placeholder="you@example.com"/>
      </div>
      <div className="form-field">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} required className="form-input" placeholder="axrZ12"/>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Loading...' : 'Register'}
        </button>
      </div>
      {message && <p className="form-message">{message}</p>}

      <div className='top-margin'>
      <span style={{color: 'black'}}>Already have an account? </span><a href="/login">Login</a>
      </div>
    </form>
  );
};

export default RegistrationForm;
