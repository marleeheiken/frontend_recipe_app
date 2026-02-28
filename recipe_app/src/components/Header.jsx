import React from 'react';
import Nav from './Nav';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="navbar">
      <Link to="/">
        <h1 style={{ margin: 0, marginRight: '1rem' }}>RecipeHub</h1>
      </Link>
      <Nav />
    </header>
  );
}
