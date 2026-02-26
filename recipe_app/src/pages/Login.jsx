import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    login({ email });
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="card two-column" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="sidebar" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="placeholder" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto' }}></div>
          <h2>Your Recipes. One Place.</h2>
          <p style={{ color: '#666' }}>Keep your favorite healthy meals accessible whenever you need them.</p>
        </div>
        <div className="main" style={{ padding: '2rem' }}>
          <h2>Welcome Back</h2>
          <p style={{ color: '#666' }}>Sign in to continue</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <button className="button-accent" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
