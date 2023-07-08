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
      AccountRecords.belongsTo(models.TestAccounts,{
        foreignKey: 'accountId',
        targetKey:'id',
        // onDelete:"CASCADE"
      })
      // define association here
    }
  }
  AccountRecords.init({
    accountId: {type:DataTypes.INTEGER,allowNull:false,field:'account_id'},
    creditsUsed: {type:DataTypes.INTEGER,allowNull:false,field:'credits_used'},
    active: DataTypes.BOOLEAN,
    allotedTo:{type:DataTypes.UUID,allowNull:true,field:'alloted_to'},
  }, {
    sequelize,
    tableName: 'account_records',
    modelName: 'AccountRecords',
    timestamps:true,

  });
  return AccountRecords;
};