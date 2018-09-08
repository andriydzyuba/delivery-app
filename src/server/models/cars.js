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
      values: ['free', 'busy']
    },
    available_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    available_check: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_check: {
      type: DataTypes.STRING,
      allowNull: false
    },
    point: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    }
  });
  Cars.associate = function(models) {
    models.Cars.belongsTo(models.Orders, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Cars;
};