import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen, Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  const courses = [
    { id: 1, title: 'Développement Web', progress: 75, instructor: 'Jean Dupont', students: 45 },
    { id: 2, title: 'Data Science', progress: 45, instructor: 'Marie Tremblay', students: 32 },
    { id: 3, title: 'Mobile App Dev', progress: 20, instructor: 'Pierre Leclerc', students: 28 },
  ];

  const stats = [
    { label: 'Cours en cours', value: '3', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Certificats', value: '2', icon: Award, color: 'from-green-500 to-green-600' },
    { label: 'Heures apprises', value: '124', icon: Clock, color: 'from-orange-500 to-orange-600' },
    { label: 'Communauté', value: '1.2K', icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenue, {user?.fullName}</h1>
            <p className="text-gray-600 text-sm">Tableau de bord Étudiant</p>
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

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Formations</h2>
          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">Instructeur: {course.instructor}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  ></motion.div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students} étudiants
                  </span>
                  <Button size="sm" className="ml-auto">Continuer</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
