'use strict';

export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert('stores', [
      {
        id: 1,
        name: 'Loja Principal',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('stores', null, {});
  },
};
