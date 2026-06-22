import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/types';
import { api } from '../lib/api';

interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = localStorage.getItem('@ControleGastos:token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        
        setUser(response.data.user);
        setToken(storedToken);
      } catch (error) {
        console.error('Sessão expirada ou inválida', error);
        localStorage.removeItem('@ControleGastos:token');
        localStorage.removeItem('@ControleGastos:user');
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = (newToken: string, newUser: User) => {
    localStorage.setItem('@ControleGastos:token', newToken);
    localStorage.setItem('@ControleGastos:user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = () => {
    localStorage.removeItem('@ControleGastos:token');
    localStorage.removeItem('@ControleGastos:user');
    setToken(null);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium animate-pulse">Autenticando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
