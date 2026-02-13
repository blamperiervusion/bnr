import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Créer un admin par défaut si aucun n'existe
  const existingAdmin = await prisma.adminUser.findFirst();
  
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.adminUser.create({
      data: {
        email: 'admin@barbnrock-festival.fr',
        name: 'Admin',
        passwordHash,
        role: 'admin',
      },
    });
    
    console.log('Admin créé:', admin.email);
    console.log('Mot de passe par défaut: admin123');
    console.log('⚠️  CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT EN PRODUCTION!');
  } else {
    console.log('Un admin existe déjà:', existingAdmin.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
