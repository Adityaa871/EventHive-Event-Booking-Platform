import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user') || localStorage.getItem('admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Computed admin property for backward compatibility
  const admin = user?.role === 'admin' ? user : null;
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getMe();
        const userData = profile?.data || profile;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.role === 'admin') {
          localStorage.setItem('admin', JSON.stringify(userData));
        }
      } catch {
        // Token invalid — clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    const token = data.token;
    const userData = data.user || data.admin;

    if (token) localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.role === 'admin') {
        localStorage.setItem('admin', JSON.stringify(userData));
      }
      setUser(userData);
    }
    return userData;
  };

  const register = async (formData) => {
    const data = await apiRegister(formData);
    const token = data.token;
    const userData = data.user;

    if (token) localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
  };

  // Legacy admin helpers
  const loginAdmin = (tokenOrData, maybeAdminData) => {
    let token = tokenOrData;
    let adminData = maybeAdminData;

    if (tokenOrData && typeof tokenOrData === 'object') {
      const payload = tokenOrData.data || tokenOrData;
      token = payload.token;
      adminData = payload.admin || payload.user;
    }

    if (token) localStorage.setItem('token', token);
    if (adminData) {
      const fullData = { ...adminData, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(fullData));
      localStorage.setItem('admin', JSON.stringify(fullData));
      setUser(fullData);
    }
  };

  const logoutAdmin = logout;

  const updateWishlistState = (wishlistArray) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, wishlist: wishlistArray };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isAdmin,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        loginAdmin,
        logoutAdmin,
        updateWishlistState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
