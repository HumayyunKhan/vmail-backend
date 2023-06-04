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
    batchId: { type: DataTypes.UUID, field: 'batch_id' },
    deletedAt: { type: DataTypes.DATE, defaultValue: null},
    email: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    tableName: 'email_addresses',
    modelName: 'EmailAddresses',
  });
  return EmailAddresses;
}; 