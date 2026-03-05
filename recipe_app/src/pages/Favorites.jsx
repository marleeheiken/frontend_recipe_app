import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import RecipeCard from '../components/RecipeCard';

export default function Favorites() {
  const favorites = useFavorites().getUserFavorites();

  return (
    <div className="container">
      <h2 style={{ textAlign: 'left' }}>My Saved Recipes</h2>
      <p style={{ color: '#666', textAlign: 'left' }}>{favorites.length} recipes saved.</p>
      <div className="grid-4">
        {favorites.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
        {favorites.length === 0 && (
          <div className="cta-card" style={{ gridColumn: 'span 1' }}>
            Start adding recipes to your favorites!
          </div>
        )}
      </div>
    </div>
  );
}
