import { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/adminAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      adminAPI.setToken(token);
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await adminAPI.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
      adminAPI.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔍 Attempting login with:', { email, password });
      
      // Use real API authentication
      const response = await adminAPI.login(email, password);
      console.log('✅ Login response:', response);
      
      const { access_token, user: userData } = response;
      
      localStorage.setItem('admin_token', access_token);
      adminAPI.setToken(access_token);
      setUser(userData);
      
      console.log('✅ Login successful, user set:', userData);
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    adminAPI.setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
