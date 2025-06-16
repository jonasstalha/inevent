import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User } from '../models/types';
import { loginWithEmail, registerWithEmail, logout as firebaseLogout, getCurrentUser, auth } from '../firebase/firebaseAuth';
import { getUserRole, createUserProfile } from '../firebase/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  register: (
    email: string, 
    password: string, 
    name: string, 
    role: 'artist' | 'client' | 'admin'
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const role = await getUserRole(firebaseUser.uid);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: (role as 'artist' | 'client' | 'admin') || 'client',
            createdAt: new Date(firebaseUser.metadata.creationTime || Date.now())
          });
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      return await loginWithEmail(email, password);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'artist' | 'client' | 'admin'
  ) => {
    try {
      setLoading(true);
      const userCredential = await registerWithEmail(email, password, name);
      
      await createUserProfile(userCredential.user.uid, {
        email,
        name,
        role,
        createdAt: new Date()
      });

      return userCredential;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
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