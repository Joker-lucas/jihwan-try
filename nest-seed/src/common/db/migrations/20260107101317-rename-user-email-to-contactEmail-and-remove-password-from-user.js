'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Users', 'email', 'contactEmail');
    await queryInterface.removeColumn('Users', 'password');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Users', 'contactEmail', 'email');
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
