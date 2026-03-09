import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { api } from '@/lib/api';
import { ALLOWED_EMAIL_DOMAINS } from '@/config/constants';

interface DbUser {
  email: string;
  nombre: string;
  rol: string;
  permissions: {
    is_admin: boolean;
    can_manage_users: boolean;
    can_manage_operations: boolean;
    can_view_sales_data: boolean;
  };
}

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: DbUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        const domain = email.split('@')[1];

        // Validar dominios permitidos
        if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
          await signOut(auth);
          setUser(null);
          setDbUser(null);
          alert(`El dominio @${domain} no está autorizado.`);
        } else {
          try {
            // Sincronizar con el backend y obtener rol
            const token = await firebaseUser.getIdToken();
            await api.syncUser(token, firebaseUser.displayName || '');
            const me = await api.getMe();
            
            setUser(firebaseUser);
            setDbUser(me);
          } catch (error) {
            console.error("Error sincronizando usuario:", error);
            await signOut(auth);
            setUser(null);
            setDbUser(null);
          }
        }
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};