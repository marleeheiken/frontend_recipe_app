import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function RecipeCard({ recipe }) {
  const { favorites, addFavorite, removeFavorite } = useContext(AuthContext);
  const navigate = useNavigate();

  const mealId = recipe.idMeal || recipe.id;
  console.log('recipe:', recipe, 'mealId:', mealId);

  const [isFavorited, setIsFavorited] = useState(
    favorites.some((fav) => fav.idMeal === recipe.idMeal)
  );

  const handleCardClick = () => {
    if (mealId) {
      navigate(`/recipe/${mealId}`);
    } else {
      console.warn('No meal ID found on recipe:', recipe);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorited) {
      removeFavorite(recipe.idMeal);
      setIsFavorited(false);
    } else {
      addFavorite(recipe);
      setIsFavorited(true);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="card"
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer' }}
    >
      {recipe.strMealThumb && <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />}
      {!recipe.strMealThumb && <div className="placeholder" style={{ flex: 1 }}></div>}
      <div style={{ padding: '0.75rem' }}>
        <strong>{recipe.strMeal || recipe.name}</strong>
      </div>
      <button
        onClick={handleToggleFavorite}
        style={{
          alignSelf: 'center',
          width: '90%',
          marginBottom: '0.5rem',
          ...(isFavorited
            ? {
                background: 'white',
                color: 'var(--color-accent)',
                border: '2px solid var(--color-accent)',
                padding: '0.5rem',
              }
            : {}),
        }}
        className={!isFavorited ? 'button-accent' : ''}
      >
        {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
}