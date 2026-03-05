import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Regular';

  return (
    <nav className="navbar">
      <ul className="nav-list">
         <li>
          <Link to="/">Home</Link>
        </li>
        
        <li>
          <Link to="/browse">Browse</Link>
        </li>
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
        {user ? (
          <>
            {user.role === 'admin' && (
              <li>
                <Link to="/saved">Admin</Link>
              </li>
            )}
            <li>
              <span>{user.email} ({roleLabel})</span>
            </li>
            <li>
              <button className="link-button" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>

            <li>
              <Link to="/login" className="sign-up-button">
                Sign in
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
