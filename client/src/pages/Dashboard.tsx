import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import StudentDashboard from '@/pages/dashboards/StudentDashboard';
import CenterDashboard from '@/pages/dashboards/CenterDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import AmbassadorDashboard from '@/pages/dashboards/AmbassadorDashboard';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'center':
      return <CenterDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'ambassador':
      return <AmbassadorDashboard />;
    default:
      return <div>Rôle non reconnu</div>;
  }
}
