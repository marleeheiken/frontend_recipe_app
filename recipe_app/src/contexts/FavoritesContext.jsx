import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  // Structure: { email: [recipes] }
  const [favoritesByUser, setFavoritesByUser] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favoritesByUser')) || {};
    setFavoritesByUser(stored);
  }, []);

  // Helper to persist
  const persist = (updatedData) => {
    localStorage.setItem('favoritesByUser', JSON.stringify(updatedData));
  };

  // Add recipe to favorites
  const addFavorite = (recipe) => {
    if (!user?.email) return;

    setFavoritesByUser((prev) => {
      const userFavorites = prev[user.email] || [];
      if (userFavorites.some((r) => r.idMeal === recipe.idMeal)) {
        return prev;
      }
      const updated = {
        ...prev,
        [user.email]: [...userFavorites, recipe],
      };
      persist(updated);
      return updated;
    });
  };

  // Remove recipe from favorites
  const removeFavorite = (idMeal) => {
    if (!user?.email) return;

    setFavoritesByUser((prev) => {
      const userFavorites = prev[user.email] || [];
      const updated = {
        ...prev,
        [user.email]: userFavorites.filter((r) => r.idMeal !== idMeal),
      };
      persist(updated);
      return updated;
    });
  };

  // Check if recipe is favorited
  const isFavorite = (idMeal) => {
    if (!user?.email) return false;
    const userFavorites = favoritesByUser[user.email] || [];
    return userFavorites.some((r) => r.idMeal === idMeal);
  };

  // Get current user's favorites
  const getUserFavorites = () => {
    if (!user?.email) return [];
    return favoritesByUser[user.email] || [];
  };

  // Admin helper: get all users' favorites
  const getAllUserFavorites = () => {
    return favoritesByUser;
  };

  const value = {
    addFavorite,
    removeFavorite,
    isFavorite,
    getUserFavorites,
    getAllUserFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}