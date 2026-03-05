import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { searchMeals, filterByCategory } from '../utils/api';
import { sanitizeText } from '../utils/security';

const DEMO_CATEGORIES = ['All', 'Vegetarian', 'Seafood', 'Chicken', 'Beef'];

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial meals on mount
  useEffect(() => {
    const loadInitialMeals = async () => {
      setLoading(true);
      try {
        // Fetch meals by category
        if (activeCategory === 'All') {
          // Fetch a few random meals for demo
          const categoryMeals = await filterByCategory('Vegetarian');
          setMeals(categoryMeals.slice(0, 8));
        } else {
          const categoryMeals = await filterByCategory(activeCategory);
          setMeals(categoryMeals.slice(0, 8));
        }
        setError('');
      } catch (err) {
        setError('Failed to load meals. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMeals();
  }, [activeCategory]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const safeQuery = sanitizeText(search);
    if (!safeQuery) return;

    setLoading(true);
    try {
      const results = await searchMeals(safeQuery);
      setMeals(results.slice(0, 8));
      setError('');
    } catch (err) {
      setError('No meals found. Try another search.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="hero two-column" style={{ alignItems: 'center' }}>
        <div className="sidebar" style={{ textAlign: 'left' }}>
          <span className="pill" style={{ background: 'var(--color-accent)', color: 'white', marginBottom: '1rem' }}>
            Healthy Recipes
          </span>
          <h1 style={{ fontSize: '4rem', margin: '1rem 0' }}>
            Eat Well, <span style={{ textDecoration: 'underline 6px #82a179' }}>Feel Better</span>
          </h1>
          <p style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>Discover nourishing meals that fit your lifestyle.</p>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
            <input
              type="text"
              placeholder="search recipes, ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="button-accent" type="submit">
              Search
            </button>
          </form>
        </div>
        <div className="main">
          <div className="placeholder" style={{ height: '300px' }}></div>
        </div>
      </section>

      <div className="filter-bar">
        <span style={{ fontSize: '1.25rem'}} >Filter:</span>
        {DEMO_CATEGORIES.map((cat) => (
          <span
            style={{ fontSize: '1.1rem'}}
            key={cat}
            className={`pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <section>
        <h2>Popular This Week</h2>
        {loading && <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Loading meals...</p>}
        {!loading && (
          <div className="grid-4">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <RecipeCard key={meal.idMeal} recipe={meal} />
              ))
            ) : (
              <p style={{ gridColumn: 'span 4', textAlign: 'center' }}>No meals found</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
