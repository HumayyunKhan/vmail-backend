'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestAccounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TestAccounts.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    domain: DataTypes.STRING,
    port: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'test_accounts',
    modelName: 'TestAccounts',
  });
  return TestAccounts;
};