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
      TestAccounts.belongsTo(models.AccountRecords,{
        foreignKey: 'id',
        targetKey:'accountId',
        onDelete:"CASCADE"
      })
      // define association here
    }
  }
  TestAccounts.init({
    id:{primaryKey:true,autoIncrement:true,type:DataTypes.INTEGER},
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    domain: DataTypes.STRING,
    port: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:true,
    paranoid:true,
    tableName: 'test_accounts',
    modelName: 'TestAccounts',
  });
  return TestAccounts;
};