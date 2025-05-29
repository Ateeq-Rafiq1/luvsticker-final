
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define user type
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin users only
const ADMIN_USERS: User[] = [
  { id: 'admin-1', email: 'admin@luvstickers.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
];

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for logged in admin on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('istickers_admin');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === 'admin') {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('istickers_admin');
          }
        } catch (error) {
          console.error('Failed to parse stored admin user', error);
          localStorage.removeItem('istickers_admin');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Admin login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Admin authentication only
      if (email === 'admin@luvstickers.com' && password === 'admin123') {
        const adminUser = ADMIN_USERS.find(u => u.email === email);
        if (adminUser) {
          setUser(adminUser);
          localStorage.setItem('istickers_admin', JSON.stringify(adminUser));
          toast.success('Admin login successful');
          return true;
        }
      }
      
      toast.error('Invalid admin credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function (for admin only)
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email belongs to an admin
      const adminUser = ADMIN_USERS.find(u => u.email === email);
      if (adminUser) {
        toast.success('Password reset instructions sent to your email');
        return true;
      }
      
      toast.error('Email not found in admin records');
      return false;
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An error occurred while sending reset instructions');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('istickers_admin');
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user?.role === 'admin'),
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
