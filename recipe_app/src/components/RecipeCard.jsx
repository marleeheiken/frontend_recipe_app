import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';


export default function RecipeCard({ recipe }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const mealId = recipe.idMeal || recipe.id;

  const favorited = isFavorite(recipe.idMeal);

  const handleCardClick = () => {
    if (mealId) {
      navigate(`/recipe/${mealId}`);
    } else {
      console.warn('No meal ID found on recipe:', recipe);
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
        onClick={(e) => {
          e.stopPropagation();
          favorited ? removeFavorite(recipe.idMeal) : addFavorite(recipe);
        }}
        style={{
          alignSelf: 'center',
          width: '90%',
          marginBottom: '0.5rem',
          ...(favorited
            ? {
                background: 'white',
                color: 'var(--color-accent)',
                border: '2px solid var(--color-accent)',
                padding: '0.5rem',
              }
            : {}),
        }}
        className={!favorited ? 'button-accent' : ''}
      >
        {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
}
