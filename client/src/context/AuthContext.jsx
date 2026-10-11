import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const adminData = await getMe();
        setAdmin(adminData?.data || adminData);
      } catch {
        // Token invalid — clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const loginAdmin = (tokenOrData, maybeAdminData) => {
    let token = tokenOrData;
    let adminData = maybeAdminData;

    if (tokenOrData && typeof tokenOrData === 'object') {
      const payload = tokenOrData.data || tokenOrData;
      token = payload.token;
      adminData = payload.admin;
    }

    if (token) localStorage.setItem('token', token);
    if (adminData) {
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
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
