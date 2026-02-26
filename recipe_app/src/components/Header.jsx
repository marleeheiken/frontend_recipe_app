import React from 'react';
import Nav from './Nav';

export default function Header() {
  return (
    <header className="navbar">
      <h1 style={{ margin: 0, marginRight: '1rem' }}>RecipeHub</h1>
      <Nav />
    </header>
  );
}
