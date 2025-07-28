import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error loading saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Save user data whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }, [user]);
  const login = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    // Check for existing user data first
    const existingUserKey = `user_${email}`;
    const existingUserData = localStorage.getItem(existingUserKey);
    
    // Simulate API call
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (email === 'tash@tashjefferies.com') {
        setUser({
          id: 'admin-1',
          email,
          name: 'Tash Jefferies',
          role: 'admin',
          tier: 'premium',
          questionsAnswered: 0,
          experimentsCreated: 0,
          joinedAt: '2024-01-01',
        });
      } else if (email === 'tash@moneyengine.co') {
        // Preserve existing data for tash@moneyengine.co
        if (existingUserData) {
          const savedData = JSON.parse(existingUserData);
          // Update login tracking
          const updatedUser = {
            ...savedData,
            lastLoginDate: today,
            dailyLogins: updateDailyLogins(savedData.dailyLogins || [], today)
          };
          setUser(updatedUser);
          localStorage.setItem(existingUserKey, JSON.stringify(updatedUser));
        } else {
          // First time login for Tash
          const newUser = {
            id: 'test-user-tash',
            email,
            name: name || 'Tash',
            role: 'founder' as const,
            tier: 'free' as const,
            questionsAnswered: 0,
            experimentsCreated: 0,
            joinedAt: new Date().toISOString(),
            lastLoginDate: today,
            dailyLogins: [{ date: today, count: 1 }]
          };
          setUser(newUser);
          localStorage.setItem(existingUserKey, JSON.stringify(newUser));
        }
      } else {
        // Handle other users with persistence
        if (existingUserData) {
          const savedData = JSON.parse(existingUserData);
          // Update login tracking
          const updatedUser = {
            ...savedData,
            lastLoginDate: today,
            dailyLogins: updateDailyLogins(savedData.dailyLogins || [], today)
          };
          setUser(updatedUser);
          localStorage.setItem(existingUserKey, JSON.stringify(updatedUser));
        } else {
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            role: 'founder' as const,
            tier: 'free' as const,
            questionsAnswered: 0,
            experimentsCreated: 0,
            joinedAt: new Date().toISOString(),
            lastLoginDate: today,
            dailyLogins: [{ date: today, count: 1 }]
          };
          setUser(newUser);
          localStorage.setItem(existingUserKey, JSON.stringify(newUser));
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  // Helper function to update daily login tracking
  const updateDailyLogins = (existingLogins: { date: string; count: number }[], today: string) => {
    const todayLogin = existingLogins.find(login => login.date === today);
    
    if (todayLogin) {
      // Increment today's login count
      return existingLogins.map(login => 
        login.date === today 
          ? { ...login, count: login.count + 1 }
          : login
      );
    } else {
      // Add new day with first login
      return [...existingLogins, { date: today, count: 1 }].slice(-30); // Keep last 30 days
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      // Save updated user data to both current user and user-specific storage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem(`user_${prev.email}`, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};