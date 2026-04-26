'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('app_config', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      app_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      slogan: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      theme: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'light',
      },
      logo_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      primary_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      secondary_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('app_config');
  },
};
