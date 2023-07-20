'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('test_accounts',"active", {
     type:Sequelize.BOOLEAN,
     defaultValue:true,
     allowNull:false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('test_accounts',"active")
  }
};