// API utility functions for TheMealDB.  The API key is stored in
// a Vite environment variable (`VITE_MEALDB_KEY`) so it can be overridden
// in development or on deployment.  The free/test key is literally
// "1" and is safe to commit for educational use; an actual project
// should use a private key and not commit the .env file.

const API_KEY = import.meta.env.VITE_MEALDB_KEY || '1';
const BASE_URL = `https://www.themealdb.com/api/json/v1/${API_KEY}`;

function buildUrl(path) {
  return `${BASE_URL}${path}`;
}

export async function searchMeals(query) {
  const res = await fetch(buildUrl(`/search.php?s=${encodeURIComponent(query)}`));
  const data = await res.json();
  return data.meals || [];
}

export async function getMealById(id) {
  const res = await fetch(buildUrl(`/lookup.php?i=${id}`));
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

export async function filterByCategory(category) {
  const res = await fetch(buildUrl(`/filter.php?c=${encodeURIComponent(category)}`));
  const data = await res.json();
  return data.meals || [];
}

export async function listCategories() {
  const res = await fetch(buildUrl(`/categories.php`));
  const data = await res.json();
  return data.categories || [];
}
