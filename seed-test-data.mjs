import { drizzle } from 'drizzle-orm/mysql2';
import { formations, studentProfiles, enrollments } from './drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

async function seedTestData() {
  console.log('🌱 Seeding test data...');

  // Add sample formations
  const sampleFormations = [
    {
      title: 'Développement Web avec React',
      description: 'Apprenez à créer des applications web modernes avec React 19',
      category: 'Développement',
      level: 'Intermédiaire',
      duration: 40,
      price: 99.99,
      maxStudents: 30,
      currentStudents: 0,
      instructor: 'Jean Dupont',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-04-30'),
      rating: '4.8',
      reviews: 42,
    },
    {
      title: 'Data Science avec Python',
      description: 'Maîtrisez l\'analyse de données et le machine learning',
      category: 'Data Science',
      level: 'Avancé',
      duration: 60,
      price: 149.99,
      maxStudents: 25,
      currentStudents: 0,
      instructor: 'Marie Martin',
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-05-31'),
      rating: '4.9',
      reviews: 58,
    },
    {
      title: 'Gestion de Projet Agile',
      description: 'Devenez un expert en méthodologie Agile et Scrum',
      category: 'Gestion',
      level: 'Débutant',
      duration: 30,
      price: 79.99,
      maxStudents: 40,
      currentStudents: 0,
      instructor: 'Pierre Lefevre',
      startDate: new Date('2026-02-15'),
      endDate: new Date('2026-03-30'),
      rating: '4.7',
      reviews: 35,
    },
  ];

  for (const formation of sampleFormations) {
    await db.insert(formations).values(formation);
  }

  console.log('✅ Test data seeded successfully!');
  console.log('📚 Added 3 sample formations');
}

seedTestData().catch(console.error);
