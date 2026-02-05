import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      setLocation('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 p-12 flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h1 className="text-4xl font-extrabold text-white mb-2">PROFUTUR</h1>
              <div className="h-1 w-16 bg-orange-400"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
                Bienvenue dans l'écosystème PROFUTUR
              </h2>
              <p className="text-blue-100 text-lg">
                Connectez-vous pour accéder à votre espace de formation professionnelle numérique.
              </p>
            </div>

            <div className="relative z-10 text-sm text-blue-200">
              © 2026 PROFUTUR SARL. Tous droits réservés.
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-8 md:p-12 flex flex-col justify-center"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Se connecter</h2>
              <p className="text-gray-500 mt-2">Heureux de vous revoir !</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 py-3 border-b-2 border-gray-200 focus:border-blue-900 rounded-none focus:ring-0 transition"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 py-3 border-b-2 border-gray-200 focus:border-blue-900 rounded-none focus:ring-0 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-right">
                  <a href="/forgot-password" className="text-xs font-medium text-blue-900 hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>

              {/* Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold tracking-widest">Ou continuer avec</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center gap-4">
                {['facebook', 'google', 'apple'].map((provider) => (
                  <motion.button
                    key={provider}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-full hover:bg-gray-50 transition"
                  >
                    <i className={`fab fa-${provider} text-lg`}></i>
                  </motion.button>
                ))}
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-sm text-gray-600">
              Nouveau sur la plateforme ?{' '}
              <a href="/register" className="text-blue-900 font-bold hover:underline">
                Créer un compte
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
