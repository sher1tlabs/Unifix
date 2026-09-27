import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types/models';
import { authRepository, StudentLoginData, StudentRegistrationData, AdminLoginData } from '../services/authRepository';

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  loginStudent: (data: StudentLoginData) => Promise<void>;
  registerStudent: (data: StudentRegistrationData) => Promise<void>;
  loginAdmin: (data: AdminLoginData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial session
    authRepository.getCurrentUser()
      .then(user => {
        setCurrentUser(user);
      })
      .catch(err => {
        console.error('Session restore failed:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const clearError = () => setError(null);

  const loginStudent = async (data: StudentLoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authRepository.loginStudent(data);
      setCurrentUser(user);
    } catch (err: any) {
      setError(err?.message || 'Failed to login student.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudent = async (data: StudentRegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authRepository.registerStudent(data);
      setCurrentUser(user);
    } catch (err: any) {
      setError(err?.message || 'Failed to register student.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (data: AdminLoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authRepository.loginAdmin(data);
      setCurrentUser(user);
    } catch (err: any) {
      setError(err?.message || 'Failed to login admin.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authRepository.logout();
      setCurrentUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      error,
      loginStudent,
      registerStudent,
      loginAdmin,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
