import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen, Users, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CenterDashboard() {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Formations actives', value: '8', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Étudiants inscrits', value: '342', icon: Users, color: 'from-green-500 to-green-600' },
    { label: 'Taux de complétion', value: '87%', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
    { label: 'Revenus', value: '15.2K', icon: DollarSign, color: 'from-purple-500 to-purple-600' },
  ];

  const formations = [
    { id: 1, title: 'Développement Web Avancé', students: 45, revenue: 2250 },
    { id: 2, title: 'Data Science Bootcamp', students: 32, revenue: 1600 },
    { id: 3, title: 'Mobile Development', students: 28, revenue: 1400 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centre Partenaire</h1>
            <p className="text-gray-600 text-sm">Gestion de vos formations</p>
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

        {/* Formations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Formations</h2>
            <Button className="bg-purple-600 hover:bg-purple-700">+ Nouvelle Formation</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Formation</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Étudiants</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenus</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formations.map((formation, index) => (
                  <motion.tr
                    key={formation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{formation.title}</td>
                    <td className="py-4 px-4 text-gray-600">{formation.students}</td>
                    <td className="py-4 px-4 font-semibold text-green-600">${formation.revenue}</td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">Gérer</Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
