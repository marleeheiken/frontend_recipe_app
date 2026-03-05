import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Export custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    if (storedUser && storedRole) {
      setUser({ ...JSON.parse(storedUser), role: storedRole });
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = user !== null;

  // Login function - updated to match Login.jsx usage
  const login = (email, password, role = 'regular') => {
    // Simulate API call - accept any credentials
    const userData = {
      email: email,
      role: role,
      token: `mock_jwt_token_${Date.now()}`
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', role);
    
    return userData;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
