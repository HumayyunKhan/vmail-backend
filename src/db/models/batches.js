'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Batches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Batches.init({
    batchId: {type:DataTypes.UUID,field:'batch_id',allowNull:false},
    status: DataTypes.STRING,
    deliverableAt:{type:DataTypes.STRING,field:'deliverableAt'}
  }, {
    sequelize,
    underscored:true,
    paranoid:true,
    timestamps:false,
    tableName: 'batches',
    modelName: 'Batches',
  });
  return Batches;
};