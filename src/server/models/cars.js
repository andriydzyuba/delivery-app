'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cars = sequelize.define('Cars', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['free', 'delivery', 'return']
    },
    available_at: {
      type: DataTypes.STRING
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });
  Cars.associate = function(models) {
    models.Cars.belongsTo(models.FormOrders, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Cars;
};