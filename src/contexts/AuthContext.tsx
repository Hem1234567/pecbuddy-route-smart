import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  rollNo?: string;
  driverId?: string;
  email?: string;
  department?: string;
  year?: string;
  busNo?: string;
  routeName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface LoginCredentials {
  identifier: string; // roll no, driver id, or email
  password: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('pec-bus-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Default password check
      if (credentials.password !== 'admin@0704') {
        setIsLoading(false);
        return false;
      }

      // Mock user creation based on role and identifier
      const mockUser: User = {
        id: credentials.identifier,
        name: `${credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1)} User`,
        role: credentials.role,
      };

      switch (credentials.role) {
        case 'student':
          mockUser.rollNo = credentials.identifier;
          mockUser.name = `Student ${credentials.identifier}`;
          break;
        case 'driver':
          mockUser.driverId = credentials.identifier;
          mockUser.name = `Driver ${credentials.identifier}`;
          break;
        case 'admin':
          mockUser.email = credentials.identifier;
          mockUser.name = `Admin ${credentials.identifier}`;
          break;
      }

      setUser(mockUser);
      localStorage.setItem('pec-bus-user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pec-bus-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}