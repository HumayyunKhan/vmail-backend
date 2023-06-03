'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('account_records', {   
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'test_accounts',
          key:'id',
          as:'account_id'

        }
      },
      credits_used: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('batches', {   
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      batch_id: {
        type: Sequelize.UUID,
        allowNull:false
     
      },
      status: {
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:'PENDING',
        
      },

      deliverableAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('account_records');
  }
};