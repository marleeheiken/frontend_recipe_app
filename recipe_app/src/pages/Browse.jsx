import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { searchMeals, filterByCategory, listCategories } from '../utils/api';

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
          const categoryMeals = await filterByCategory('Chicken');
          setMeals(categoryMeals.slice(0, 20));
        } else {
          const categoryMeals = await filterByCategory(activeCategory);
          setMeals(categoryMeals.slice(0, 20));
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
    if (!search.trim()) return;

    setLoading(true);
    try {
      const results = await searchMeals(search);
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
    <div className="container2">
        <section
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '3rem 1rem'
        }}
        >
        <h1 style={{ 
            marginTop: 0,
            marginBottom: '1.5rem',
            fontSize: '4rem'
            }}>
            Plan Your Next Meal
        </h1>

        <form
            onSubmit={handleSearchSubmit}
            style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            width: '40%',
            }}
        >
            <input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <button className="button-accent" type="submit">
            Search
            </button>
        </form>

        <div className="filter-bar" style={{ marginTop: '1rem' }}>
            <span style={{ marginRight: '0.5rem' }}>Filter:</span>
            {DEMO_CATEGORIES.map((cat) => (
            <span
                key={cat}
                className={`pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
            >
                {cat}
            </span>
            ))}
        </div>
        </section>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <section>
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
