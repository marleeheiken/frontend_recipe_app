import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Login from '../../pages/Login';

function renderWithAuth(value, ui) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>{ui}</AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('Login page', () => {
  it('does not call login when inputs are invalid', () => {
    const mockLogin = vi.fn();
    const mockRegister = vi.fn();
    renderWithAuth(
      { login: mockLogin, register: mockRegister, csrfToken: 'csrf_1' },
      <Login />
    );

    const emailInput = screen.getByPlaceholderText(/youremail/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'foo' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(button);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
  });

  it('submits register flow and shows success feedback', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ email: 'test@example.com' });
    const mockLogin = vi.fn();
    renderWithAuth(
      { login: mockLogin, register: mockRegister, csrfToken: 'csrf_1' },
      <Login />
    );

    fireEvent.click(screen.getByText(/Switch to Register/i));
    fireEvent.change(screen.getByPlaceholderText(/youremail/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'pass1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'pass1234',
      role: 'regular',
      csrf: 'csrf_1',
    });
    expect(await screen.findByText(/Account created/i)).toBeInTheDocument();
  });
});
