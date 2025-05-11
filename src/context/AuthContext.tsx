import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'artist' | 'client' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'artist@example.com',
    password: 'artist123',
    name: 'Artist Demo',
    role: 'artist',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'client@example.com',
    password: 'client123',
    name: 'Client Demo',
    role: 'client',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin Demo',
    role: 'admin',
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored user credentials
    const checkAuth = async () => {
      // For demo purposes, we're not persisting user auth
      // In a real app, check AsyncStorage or SecureStore
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - in a real app, this would be an API call
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(foundUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'artist' | 'client' | 'admin') => {
    setLoading(true);
    try {
      // Mock registration - in a real app, this would be an API call
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        email,
        name,
        role,
        createdAt: new Date(),
      };
      
      // Add to mock users (in real app, this would be saved to a database)
      MOCK_USERS.push(newUser);
      
      // Log in the new user
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};