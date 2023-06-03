'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailAddresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailAddresses.init({
    batchId: DataTypes.UUID,
    email: DataTypes.STRING
  }, {
    sequelize,
    underscored:true,
    paranoid:true,
    deletedAt:'deletedAt',
    createdAt:'createdAt',
    updatedAt:'updatedAt',
    tableName: 'email_addresses',
    modelName: 'EmailAddresses',
  });
  return EmailAddresses;
};