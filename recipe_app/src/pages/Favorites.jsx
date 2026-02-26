import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

export default function Favorites() {
  const { favorites } = useContext(AuthContext);

  return (
    <div className="container">
      <h2 style={{ textAlign: 'left' }}>My Saved Recipes</h2>
      <p style={{ color: '#666', textAlign: 'left' }}>{favorites.length} recipes saved.</p>
      <div className="grid-3">
        {favorites.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
        {/* CTA card */}
        {favorites.length === 0 && (
          <div className="cta-card" style={{ gridColumn: 'span 1' }}>
            Start adding recipes to your favorites!
          </div>
        )}
      </div>
    </div>
  );
}
