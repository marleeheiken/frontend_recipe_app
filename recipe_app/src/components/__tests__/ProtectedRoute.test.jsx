import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthContext } from '../../contexts/AuthContext';

function renderWithAuth(authValue, route = '/favorites') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={authValue}>
        <Routes>
          <Route path="/login" element={<p>Login Page</p>} />
          <Route path="/favorites" element={<ProtectedRoute><p>Favorites Page</p></ProtectedRoute>} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute requiredRole="admin">
                <p>Admin Page</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithAuth({
      isAuthenticated: false,
      isInitializing: false,
      hasRole: () => false,
    });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders route for authenticated users', () => {
    renderWithAuth({
      isAuthenticated: true,
      isInitializing: false,
      hasRole: () => true,
    });
    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  it('blocks non-admin users from admin route', () => {
    renderWithAuth(
      {
        isAuthenticated: true,
        isInitializing: false,
        hasRole: () => false,
      },
      '/saved'
    );
    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });
});
