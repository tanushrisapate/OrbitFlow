import { createContext, useContext, useState } from 'react';

const defaultUser = {
  id: 'user-1',
  name: 'Tanushri',
  email: 'tanushri@devtrack.io',
  role: 'Owner',
  avatar: null,
  initials: 'T'
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('devtrack-user');
      if (!saved) return defaultUser;
      const parsed = JSON.parse(saved);
      // Sanitize corrupt email object if legacy state exists in localStorage
      if (parsed && typeof parsed.email === 'object' && parsed.email !== null) {
        parsed.email = parsed.email.email || 'tanushri@devtrack.io';
      }
      if (parsed && typeof parsed.name === 'object' && parsed.name !== null) {
        parsed.name = parsed.name.name || 'Tanushri';
      }
      return parsed;
    } catch {
      return defaultUser;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let userEmail = 'tanushri@devtrack.io';
    let userName = 'Tanushri';

    if (typeof email === 'string') {
      userEmail = email;
      userName = email.split('@')[0];
    } else if (typeof email === 'object' && email !== null) {
      userEmail = typeof email.email === 'string' ? email.email : 'tanushri@devtrack.io';
      userName = typeof email.name === 'string' ? email.name : userEmail.split('@')[0];
    }

    const userData = { ...defaultUser, email: userEmail, name: userName };
    setUser(userData);
    localStorage.setItem('devtrack-user', JSON.stringify(userData));
    setIsLoading(false);
    return userData;
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const userEmail = typeof email === 'string' ? email : 'tanushri@devtrack.io';
    const userName = typeof name === 'string' ? name : 'Tanushri';
    const userData = { 
      ...defaultUser, 
      name: userName, 
      email: userEmail, 
      initials: userName.split(' ').map(n => n[0]).join('').toUpperCase() 
    };
    setUser(userData);
    localStorage.setItem('devtrack-user', JSON.stringify(userData));
    setIsLoading(false);
    return userData;
  };

  const logout = () => {
    setUser(defaultUser);
    localStorage.setItem('devtrack-user', JSON.stringify(defaultUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
