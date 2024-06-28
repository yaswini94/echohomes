import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

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

    const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');

      const { error } = await supabase.auth.signUp({ email, password }, {
        data: { name }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Registration successful! Check your email to verify your account.');
      }

      setLoading(false);
    };

    return (
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
          </button>
        </div>
        {message && <p>{message}</p>}
      </form>
    );
};

export default RegistrationForm;
