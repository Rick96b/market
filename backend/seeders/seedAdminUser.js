const bcrypt = require('bcrypt');
const { sequelize, User } = require('../models');

function getAdminSeedData() {
  return {
    name: process.env.ADMIN_NAME || 'Администратор',
    email: process.env.ADMIN_EMAIL || 'admin@organic.local',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };
}

async function seedAdminUser() {
  const { name, email, password } = getAdminSeedData();
  const passwordHash = await bcrypt.hash(password, 10);

  const [admin, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name,
      email,
      password_hash: passwordHash,
      role: 'admin',
    },
  });

  if (!created) {
    await admin.update({
      name,
      password_hash: passwordHash,
      role: 'admin',
    });
  }

  return { admin, created };
}

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const { admin, created } = await seedAdminUser();
    console.log(`${created ? 'Created' : 'Updated'} admin user: ${admin.email}`);

    await sequelize.close();
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    await sequelize.close().catch(() => {});
    process.exit(1);
  }
}

if (require.main === module) {
  run();
}

module.exports = seedAdminUser;
