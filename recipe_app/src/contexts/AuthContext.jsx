import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loginUser, registerUser } from '../utils/authApi';
import {
  decodeMockJwt,
  generateCsrfToken,
  isTokenExpired,
  sanitizeText,
} from '../utils/security';

export const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'recipehub_auth_session';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [csrfToken, setCsrfToken] = useState(generateCsrfToken());
  const logoutTimerRef = useRef(null);

  const cleanupSession = () => {
    setUser(null);
    setToken('');
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setCsrfToken(generateCsrfToken());
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const scheduleAutoLogout = (jwtToken) => {
    const payload = decodeMockJwt(jwtToken);
    if (!payload?.exp) {
      cleanupSession();
      return;
    }

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      cleanupSession();
      return;
    }

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = setTimeout(() => {
      cleanupSession();
    }, msUntilExpiry);
  };

  useEffect(() => {
    const storedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedSession) {
      setIsInitializing(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedSession);
      if (!parsed?.token || !parsed?.user || isTokenExpired(parsed.token)) {
        cleanupSession();
        setIsInitializing(false);
        return;
      }

      setUser(parsed.user);
      setToken(parsed.token);
      scheduleAutoLogout(parsed.token);
    } catch {
      cleanupSession();
    }

    setIsInitializing(false);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const persistSession = (sessionUser, jwtToken) => {
    const safeUser = {
      email: sanitizeText(sessionUser.email).toLowerCase(),
      role: sessionUser.role === 'admin' ? 'admin' : 'regular',
    };
    const data = { user: safeUser, token: jwtToken };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setUser(safeUser);
    setToken(jwtToken);
    scheduleAutoLogout(jwtToken);
  };

  const validateCsrfToken = (providedToken) => {
    if (!providedToken || providedToken !== csrfToken) {
      throw new Error('Invalid session token. Refresh the page and try again.');
    }
  };

  const register = async ({ email, password, role = 'regular', csrf }) => {
    validateCsrfToken(csrf);
    const createdUser = await registerUser({ email, password, role });
    setCsrfToken(generateCsrfToken());
    return createdUser;
  };

  const login = async ({ email, password, role = 'regular', csrf }) => {
    validateCsrfToken(csrf);
    const { user: sessionUser, token: jwtToken } = await loginUser({
      email,
      password,
      roleHint: role,
    });
    persistSession(sessionUser, jwtToken);
    setCsrfToken(generateCsrfToken());
    return sessionUser;
  };

  const logout = () => {
    cleanupSession();
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      csrfToken,
      isAuthenticated: Boolean(user && token),
      isInitializing,
      register,
      login,
      logout,
      hasRole,
    }),
    [user, token, csrfToken, isInitializing]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
