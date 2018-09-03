'use strict';
module.exports = (sequelize, DataTypes) => {
  var Orders = sequelize.define('Orders', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    address_from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address_to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    point_from: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    point_to: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    contacts: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    travel_time: {
      type: DataTypes.INTEGER
    },
    date_estimated: {
      type: DataTypes.DATE
    },
    track_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['waiting', 'processing', 'delivered']
    }
  });
  Orders.associate = function(models) {
    models.Orders.hasOne(models.Cars);
  };
  return Orders;
};