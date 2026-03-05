import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('regular');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    try {
      login(email, password, selectedRole);
      navigate('/saved');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div
      className="container"
      style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
    >
      <div
        className="card two-column"
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <div
          className="sidebar"
          style={{ padding: '2rem', textAlign: 'center' }}
        >
          <div
            className="placeholder"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          ></div>
          <h2>Your Recipes. One Place.</h2>
          <p style={{ color: '#666' }}>
            Keep your favorite healthy meals accessible whenever you need them.
          </p>
        </div>

        <div className="main" style={{ padding: '2rem' }}>
          <h2>Welcome Back</h2>
          <p style={{ color: '#666' }}>Sign in to continue</p>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              type="email"
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="regular">Regular User</option>
              <option value="admin">Admin User</option>
            </select>

            <button className="button-accent" type="submit">
              Login
            </button>
          </form>

          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#777' }}>
            <p><strong>Demo:</strong> Any email/password works.</p>
            <p>Select Regular or Admin to test different access levels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}