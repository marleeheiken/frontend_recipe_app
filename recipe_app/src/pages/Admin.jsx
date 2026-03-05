import { useFavorites } from '../contexts/FavoritesContext';
import RecipeCard from '../components/RecipeCard';

function AdminPage() {
  const { getAllUserFavorites } = useFavorites();
  const allUserFavorites = getAllUserFavorites();
  const users = Object.entries(allUserFavorites);

  return (
    <div className="container">
      <h2 style={{ textAlign: 'left' }}>Admin Dashboard</h2>

      <div
        style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <p style={{ margin: 0, color: '#856404' }}>
          Admin view: all users&apos; saved recipes.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="cta-card">No users have saved any recipes yet.</div>
      ) : (
        users.map(([email, recipes]) => (
          <section key={email} style={{ marginBottom: '2rem' }}>
            <h3 style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
              {email} ({recipes.length})
            </h3>
            {recipes.length === 0 ? (
              <p style={{ color: '#666' }}>No saved recipes.</p>
            ) : (
              <div className="grid-4">
                {recipes.map((recipe) => (
                  <RecipeCard key={`${email}-${recipe.idMeal}`} recipe={recipe} />
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}

export default AdminPage;
