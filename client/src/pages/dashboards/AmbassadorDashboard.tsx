import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Award, DollarSign, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AmbassadorDashboard() {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Réseau', value: '342', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Commissions', value: '$3,240', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Parrainages', value: '28', icon: Award, color: 'from-orange-500 to-orange-600' },
    { label: 'Partages', value: '156', icon: Share2, color: 'from-purple-500 to-purple-600' },
  ];

  const referrals = [
    { name: 'Jean Dupont', status: 'Actif', commission: '$120' },
    { name: 'Marie Tremblay', status: 'Actif', commission: '$85' },
    { name: 'Pierre Leclerc', status: 'Inactif', commission: '$0' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Ambassadeur</h1>
            <p className="text-gray-600 text-sm">Gérez votre réseau et vos commissions</p>
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

        {/* Referrals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Parrainages</h2>
            <Button className="bg-orange-600 hover:bg-orange-700">+ Inviter</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{referral.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'Actif' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-green-600">{referral.commission}</td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">Détails</Button>
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
