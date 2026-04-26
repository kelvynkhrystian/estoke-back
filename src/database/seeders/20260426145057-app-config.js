'use strict';

export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert('app_config', [
      {
        id: 1,
        app_name: 'Estoke',
        slogan: 'Sistema de Gestão',
        theme: 'light',
        logo_url: 'public/assets/logo.png',
        primary_color: '#000000',
        secondary_color: '#ffffff',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('app_config', null, {});
  },
};
