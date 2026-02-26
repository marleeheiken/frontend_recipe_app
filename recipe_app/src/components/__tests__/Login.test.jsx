import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../../contexts/AuthContext';
import Login from '../../pages/Login';

// helper to render with a custom auth context value
function renderWithAuth(value, ui) {
  return render(<AuthContext.Provider value={value}>{ui}</AuthContext.Provider>);
}

describe('Login page', () => {
  it('does not call login when inputs are invalid', () => {
    const mockLogin = vi.fn();
    renderWithAuth({ login: mockLogin }, <Login />);

    const emailInput = screen.getByPlaceholderText(/youremail/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'foo' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(button);

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
