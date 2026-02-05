import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Users, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Utilisateurs actifs', value: '1,234', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Formations', value: '156', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { label: 'Revenus', value: '$45.2K', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
    { label: 'Alertes', value: '8', icon: AlertCircle, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
            <p className="text-gray-600 text-sm">Gestion globale de la plateforme</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 opacity-20" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Admin Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contrôles d'Administration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-base">
              Gérer les Utilisateurs
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white py-6 text-base">
              Modérer les Formations
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white py-6 text-base">
              Rapports Financiers
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
