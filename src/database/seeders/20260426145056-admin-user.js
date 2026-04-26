'use strict';

import bcrypt from 'bcrypt';

export default {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('admin', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'admin',
        email: 'admin@admin.com',
        password_hash: passwordHash,
        role: 'admin',
        store_id: 1,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@admin.com' }, {});
  },
};
