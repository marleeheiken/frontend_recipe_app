import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

function AuthConsumer() {
  const { user, isAuthenticated, csrfToken, register, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="auth-state">{isAuthenticated ? 'yes' : 'no'}</p>
      <p data-testid="auth-email">{user?.email || ''}</p>
      <p data-testid="csrf-token">{csrfToken}</p>
      <button
        onClick={() =>
          register({
            email: 'test@example.com',
            password: 'pass1234',
            role: 'admin',
            csrf: csrfToken,
          })
        }
      >
        Register
      </button>
      <button
        onClick={() =>
          login({
            email: 'test@example.com',
            password: 'pass1234',
            role: 'admin',
            csrf: csrfToken,
          })
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('registers, logs in, and logs out with session storage', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Register'));
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('yes');
    });
    expect(screen.getByTestId('auth-email')).toHaveTextContent('test@example.com');
    expect(sessionStorage.getItem('recipehub_auth_session')).toBeTruthy();

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('no');
    });
    expect(sessionStorage.getItem('recipehub_auth_session')).toBeNull();
  });
});
