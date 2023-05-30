'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_accounts.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    domain: DataTypes.STRING,
    port: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'test_accounts',
  });
  return test_accounts;
};