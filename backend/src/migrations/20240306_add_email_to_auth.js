'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Auths', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Auths', 'email');
  }
}; 