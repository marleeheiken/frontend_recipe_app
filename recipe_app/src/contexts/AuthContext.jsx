import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // load user/favorites from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('recipeAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedFav = localStorage.getItem('recipeAppFavorites');
    if (storedFav) {
      setFavorites(JSON.parse(storedFav));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('recipeAppUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('recipeAppUser');
  };

  const addFavorite = (recipe) => {
    setFavorites((prev) => {
      const updated = [...prev, recipe];
      localStorage.setItem('recipeAppFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.filter((r) => r.idMeal !== id);
      localStorage.setItem('recipeAppFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, favorites, login, logout, addFavorite, removeFavorite }}
    >
      {children}
    </AuthContext.Provider>
  );
}
