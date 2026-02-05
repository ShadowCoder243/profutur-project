import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, RegisterData } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Mail, Lock, User, Building2, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type Role = 'student' | 'center' | 'ambassador';

export default function Register() {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    centerName: '',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const { register, loading } = useAuth();

  const roles = [
    {
      id: 'student',
      title: 'Je suis Étudiant',
      description: 'Accédez aux formations et certificats',
      icon: '👨‍🎓',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'center',
      title: 'Je suis Centre Partenaire',
      description: 'Proposez vos formations',
      icon: '🏢',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'ambassador',
      title: 'Je suis Ambassadeur',
      description: 'Rejoignez notre réseau',
      icon: '🌟',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const registerPayload: RegisterData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: selectedRole,
        ...(selectedRole === 'center' && { centerName: formData.centerName }),
        ...(selectedRole === 'student' && { specialization: formData.specialization }),
      };

      await register(registerPayload);
      setLocation('/dashboard');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Rejoignez <span className="bg-gradient-to-r from-blue-900 to-orange-500 bg-clip-text text-transparent">PROFUTUR</span>
            </h1>
            <p className="text-xl text-gray-600">Choisissez votre profil pour commencer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {roles.map((role, index) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => {
                  setSelectedRole(role.id as Role);
                  setStep('form');
                }}
                className={`p-8 rounded-2xl border-2 transition transform hover:scale-105 ${
                  selectedRole === role.id
                    ? `border-blue-900 bg-gradient-to-br ${role.color} text-white shadow-xl`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-5xl mb-4">{role.icon}</div>
                <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                <p className={selectedRole === role.id ? 'text-blue-100' : 'text-gray-600'}>
                  {role.description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className={selectedRole === role.id ? 'text-blue-100' : 'text-gray-500'}>
                    Continuer
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-blue-900 font-bold hover:underline">
                Se connecter
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <button
            onClick={() => setStep('role')}
            className="text-blue-900 font-medium text-sm mb-6 hover:underline flex items-center gap-2"
          >
            ← Retour
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
          <p className="text-gray-500 mb-8">
            Inscrivez-vous en tant que{' '}
            <span className="font-semibold text-blue-900">
              {selectedRole === 'student'
                ? 'Étudiant'
                : selectedRole === 'center'
                ? 'Centre'
                : 'Ambassadeur'}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Center Name (for centers) */}
            {selectedRole === 'center' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nom du centre
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Centre de Formation XYZ"
                    value={formData.centerName}
                    onChange={(e) =>
                      setFormData({ ...formData, centerName: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Specialization (for students) */}
            {selectedRole === 'student' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Domaine d'intérêt
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Développement Web, Data Science"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-blue-900 font-bold hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
