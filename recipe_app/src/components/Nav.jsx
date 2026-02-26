import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Nav() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link to="/">Browse</Link>
        </li>
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/account">My Account</Link>
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
              <Link to="/login" className="sign-in-link">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/login" className="sign-up-button">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
