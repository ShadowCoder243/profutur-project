import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle, Users, Award, TrendingUp } from "lucide-react";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const features = [
    {
      icon: Award,
      title: "Formations Certifiantes",
      description: "Obtenez des certificats reconnus dans l'industrie",
    },
    {
      icon: Users,
      title: "Réseau Global",
      description: "Connectez-vous avec des centres partenaires",
    },
    {
      icon: TrendingUp,
      title: "Carrière en Croissance",
      description: "Accélérez votre développement professionnel",
    },
  ];

  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Étudiante",
      text: "PROFUTUR m'a permis de trouver une formation adaptée à mes besoins. Excellente plateforme !",
      avatar: "AD",
    },
    {
      name: "Kofi Mensah",
      role: "Centre Partenaire",
      text: "Grâce à PROFUTUR, nous avons augmenté nos inscriptions de 300% en 6 mois.",
      avatar: "KM",
    },
    {
      name: "Fatima Hassan",
      role: "Ambassadrice",
      text: "Le système de commissions est transparent et motivant. Je recommande vivement !",
      avatar: "FH",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="text-2xl font-extrabold text-blue-900">PROFUTUR</div>
            <div className="text-sm text-orange-500 font-bold">SARL</div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            {["Accueil", "Mission", "Formations", "Ambassadeurs", "Contact"].map((item, i) => (
              <motion.a
                key={i}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="hover:text-blue-900 transition"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="bg-blue-900 hover:bg-blue-800"
                >
                  Dashboard
                </Button>
                <Button onClick={logout} variant="outline">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setLocation("/login")}
                  variant="outline"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => setLocation("/register")}
                  className="bg-blue-900 hover:bg-blue-800"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              L'Excellence Professionnelle à <span className="text-blue-900">portée</span> de <span className="text-orange-500">clic</span>.
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              PROFUTUR SARL réinvente la formation technique en Afrique. Nous connectons les meilleurs centres aux talents de demain pour bâtir un futur compétitif et qualifié.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setLocation("/register")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 text-base flex items-center gap-2"
              >
                Je veux me former <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-base"
              >
                Devenir Centre Partenaire
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl p-8 h-96 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎓
              </motion.div>
              <p className="text-gray-600">Formation de qualité mondiale</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12">
            Pourquoi Choisir PROFUTUR ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition"
                >
                  <Icon className="w-12 h-12 text-blue-900 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12">
            Témoignages de nos Utilisateurs
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20"
              >
                <p className="mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm opacity-80">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
            Prêt à Transformer Votre Carrière ?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers d'apprenants qui ont déjà changé leur vie avec PROFUTUR.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => setLocation("/register")}
              className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-4 text-lg"
            >
              Commencer Maintenant
            </Button>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold mb-4">PROFUTUR SARL</p>
              <p className="text-gray-400 text-sm">Réinventer la formation en Afrique</p>
            </div>
            {["Produit", "Entreprise", "Support", "Légal"].map((col, i) => (
              <div key={i}>
                <p className="font-bold mb-4">{col}</p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white">Lien 1</a></li>
                  <li><a href="#" className="hover:text-white">Lien 2</a></li>
                  <li><a href="#" className="hover:text-white">Lien 3</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 PROFUTUR SARL. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
