import { loginUser, registerUser } from '../authApi';

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('registers and then logs in a user', async () => {
    await registerUser({
      email: 'user@example.com',
      password: 'pass1234',
      role: 'regular',
    });

    const result = await loginUser({
      email: 'user@example.com',
      password: 'pass1234',
      roleHint: 'regular',
    });

    expect(result.user.email).toBe('user@example.com');
    expect(result.token).toBeTruthy();
  });

  it('rejects duplicate registration', async () => {
    await registerUser({
      email: 'user@example.com',
      password: 'pass1234',
      role: 'regular',
    });

    await expect(
      registerUser({
        email: 'user@example.com',
        password: 'pass1234',
        role: 'regular',
      })
    ).rejects.toThrow(/already exists/i);
  });

  it('rejects wrong password for existing account', async () => {
    await registerUser({
      email: 'user@example.com',
      password: 'pass1234',
      role: 'regular',
    });

    await expect(
      loginUser({
        email: 'user@example.com',
        password: 'wrong1234',
        roleHint: 'regular',
      })
    ).rejects.toThrow(/incorrect/i);
  });
});
