# PROFUTUR SARL - TODO List

## Pages & Authentification
- [x] Page d'accueil (Home)
- [x] Page de Connexion (Login)
- [x] Page d'Inscription (Register)
- [x] Contexte d'authentification (AuthContext)
- [ ] Page de récupération de mot de passe
- [x] Intégration des pages au routeur App.tsx

## Tableaux de Bord
- [x] Dashboard Étudiant
- [x] Dashboard Centre Partenaire
- [x] Dashboard Admin
- [x] Dashboard Ambassadeur
- [ ] Routage dynamique par rôle
- [ ] Pages de détails des formations
- [ ] Gestion des inscriptions

## Base de Données
- [x] Schéma complet (10 tables)
- [x] Migrations appliquées
- [x] Helpers de requêtes (db.ts)
- [ ] Seed de données de test
- [ ] Indexes pour optimisation

## API Endpoints (tRPC)
- [x] Routeur formations (list, getById, getEnrollments)
- [x] Routeur profiles (getCurrent, getCenter, getStudent, getAmbassador)
- [ ] Routeur donations
- [ ] Routeur certificates
- [ ] Routeur transactions
- [ ] Routeur ambassadors

## Tests
- [x] Tests unitaires pour formations.ts
- [ ] Tests unitaires pour profiles.ts
- [ ] Tests d'intégration pour l'authentification
- [ ] Tests E2E pour les workflows critiques

## Design & UX
- [x] Animations Framer Motion (dashboards)
- [x] Animations Framer Motion (page d'accueil)
- [x] Transitions fluides entre pages
- [ ] Loading states et skeletons
- [ ] Notifications toast (Sonner)
- [ ] Modales pour actions critiques
- [x] Responsive design mobile

## Fonctionnalités Avancées
- [ ] Intégration Hedera Hashgraph (blockchain)
- [ ] Génération de certificats NFT
- [ ] Système de donations avec traçabilité
- [ ] Système de commissions pour ambassadeurs
- [ ] Notifications en temps réel
- [ ] Export de rapports PDF

## Déploiement
- [ ] Configuration des variables d'environnement
- [ ] Tests de performance
- [ ] Audit de sécurité
- [ ] Documentation API
- [ ] Guide utilisateur
- [ ] Checkpoint final avant publication
