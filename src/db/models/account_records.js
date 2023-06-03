'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountRecords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AccountRecords.init({
    accountId: DataTypes.INTEGER,
    creditsUsed: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'account_records',
    modelName: 'AccountRecords',
    underscored:true,
    createdAt:'createdAt',
    updatedAt:'updatedAt'
  });
  return AccountRecords;
};