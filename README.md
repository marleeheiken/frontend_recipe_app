# RecipeHub — Healthy Recipe Browser

RecipeHub is a single‑page application that lets users search, browse, and save recipes. It integrates with the free [TheMealDB](https://www.themealdb.com/) API and provides basic authentication and favorites management.


Vercel Deployment URL: https://frontend-recipe-app-indol.vercel.app/ 

**Home Page**

<img src="recipe_app/public/home.png" alt=" Home Page" width="400"/>


**Browse Page**

<img src="recipe_app/public/browse.png" alt=" Browse More Recipes Page" width="400"/>


**Favorites Page**

<img src="recipe_app/public/saved.png" alt=" Favorites Page" width="400"/>


**Sign In Page**

<img src="recipe_app/public/sign-in.png" alt=" Sign In Page" width="400"/>


## Features

- Browse meals by category or search by name
- View detailed recipe instructions and ingredients
- Save favorite recipes
- (Future) Mock authentication (login form with client‑side validation)
- Responsive layout 
- State management via `useState` and React Context
- Fully tested with Vitest and React Testing Library

## Technologies Used

- React 19 (Vite template)
- React Router v6
- Vitest & React Testing Library
- CSS variables, Flexbox & Grid for layout
- TheMealDB public API (free, key stored in `.env`)

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/marleeheiken/frontend_recipe_app.git
   cd frontend_recipe_app/recipe_app
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment variables**
   Create a `.env` file in the project root with:
   ```env
   VITE_MEALDB_KEY=1
   ```
   (the default key `1` is the public test key)

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` in your browser.

5. **Run tests**
   ```bash
   npm run test
   ```

## Application Routes

| Path | Description |
|------|-------------|
| `/` | Home page with search and category filters |
| `/browse` | View more recipes at a time |
| `/recipe/:id` | Recipe detail view |
| `/favorites` | List of saved favorite recipes |
| `/login` | Sign in/sign up form (mocked) |
| any other | 404 Not Found page |

## API Endpoints Used

All network requests are made via helper functions in `src/utils/api.js`.

- `searchMeals(query)` → `/search.php?s={query}`
- `filterByCategory(category)` → `/filter.php?c={category}`
- `getMealById(id)` → `/lookup.php?i={id}`
- `listCategories()` → `/categories.php`

The `VITE_MEALDB_KEY` environment variable is appended to every request by the Vite proxy.


## Testing

The project uses Vitest with JSDOM. There are tests covering:

- API utilities (`src/utils/__tests__/api.test.js`)
- Component rendering and user interactions (`Home`, `RecipeDetail`, `Login`, `Header`)
- Context logic is indirectly verified by mocking `AuthContext` in component tests.

Run `npm run test` to execute the suite; all tests pass as of this commit.

## Future Enhancements

- Authinitcation and authorization to view your favorited meals or all if youre an admin
- Fixes involved with spacing when adjusting screen size


