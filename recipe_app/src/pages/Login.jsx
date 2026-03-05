import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/security';

export default function Login() {
  const { login, register, csrfToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = location.pathname === '/register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('regular');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const emailStatus = validateEmail(email);
    if (!emailStatus.valid) {
      setError('Please enter a valid email.');
      return false;
    }

    const passwordStatus = validatePassword(password);
    if (!passwordStatus.valid) {
      setError(passwordStatus.message);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await register({
          email,
          password,
          role: selectedRole,
          csrf: csrfToken,
        });
        setSuccess('Account created. Please log in.');
        setMode('login');
        setPassword('');
        return;
      }

      const loggedInUser = await login({
        email,
        password,
        role: selectedRole,
        csrf: csrfToken,
      });
      navigate(loggedInUser.role === 'admin' ? '/saved' : '/favorites');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <h2>{mode === 'register' ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={{ color: '#666' }}>
            {mode === 'register' ? 'Register to save recipes securely.' : 'Sign in to continue'}
          </p>

          {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input type="hidden" name="csrf" value={csrfToken} />
            <input
              type="email"
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="regular">Regular User</option>
              <option value="admin">Admin User</option>
            </select>

            <button className="button-accent" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : mode === 'register' ? 'Register' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#777' }}>
            <p>
              {mode === 'register' ? 'Already have an account?' : 'Need an account?'}{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setMode(mode === 'register' ? 'login' : 'register');
                }}
              >
                {mode === 'register' ? 'Switch to Login' : 'Switch to Register'}
              </button>
            </p>
            <p><strong>Demo:</strong> choose a role when registering to test access levels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
