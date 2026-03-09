import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

export function LoginView() {
  const { loginWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Si ya está logueado, lo mandamos al dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="text-brand-600 flex items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-navy-900 tracking-tight">
            capital<span className="text-brand-600 font-medium">express</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-navy-900 mb-3">
          Acceso al Portal de Verificaciones
        </h1>
        
        <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
          Inicia sesión con tu correo <span className="text-brand-600 font-medium">@capitalexpress.pe</span> o <span className="text-brand-600 font-medium">@capitalexpress.cl</span>
        </p>

        <Button 
          onClick={handleLogin} 
          isLoading={loading}
          className="w-full h-12 text-base bg-[#F04B2B] hover:bg-[#D32F2F] text-white shadow-lg shadow-brand-500/20 rounded-xl flex items-center gap-3 transition-transform active:scale-[0.98]"
        >
          {!loading && <KeyRound className="h-5 w-5" />}
          Iniciar sesión con Google
        </Button>

        <p className="text-xs text-slate-400 mt-10">
          Capital Express © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}