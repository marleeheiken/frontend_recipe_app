import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { getMealById } from '../utils/api';

export default function RecipeDetail() {
  const { id } = useParams();
  const { addFavorite, removeFavorite, getUserFavorites } = useFavorites();
  const favorites = getUserFavorites();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadMeal = async () => {
      try {
        const data = await getMealById(id);
        if (data) {
          setMeal(data);
          setIsFavorited(favorites.some((fav) => fav.idMeal === data.idMeal));
        } else {
          setError('Meal not found');
        }
      } catch (err) {
        setError('Failed to load meal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMeal();
  }, [id, favorites]);

  const toggleIngredient = (idx) => {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavorite(meal.idMeal);
      setIsFavorited(false);
    } else {
      addFavorite(meal);
      setIsFavorited(true);
    }
  };

  if (loading) return <div className="container"><p>Loading recipe...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!meal) return <div className="container"><p>Meal not found</p></div>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ name: ingredient, measure });
    }
  }

  return (
    <div className="container">
      <Link to="/" style={{ display: 'block', margin: '1rem 0' }}>
        &larr; Back
      </Link>
      <div className="two-column">
        <div className="sidebar">
          <img src={meal.strMealThumb} alt={meal.strMeal} style={{ width: '100%', borderRadius: '12px' }} />
          <div className="filter-bar" style={{ margin: '0.5rem 0' }}>
            {meal.strCategory && <span className="pill active">{meal.strCategory}</span>}
            {meal.strArea && <span className="pill">{meal.strArea}</span>}
          </div>
          <h2>{meal.strMeal}</h2>
          <p>{meal.strInstructions}</p>
        </div>
        <div className="main">
          <div className="ingredients-list">
            <h3>Ingredients</h3>
            {ingredients.map((ing, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  checked={!!checked[idx]}
                  onChange={() => toggleIngredient(idx)}
                />
                <span style={{ marginLeft: '0.5rem' }}>
                  {ing.measure} {ing.name}
                </span>
              </label>
            ))}
            <button
              className="button-accent"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleToggleFavorite}
            >
              {isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
