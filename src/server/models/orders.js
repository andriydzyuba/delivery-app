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
      allowNull: false,
      defaultValue: 'Lviv'
    },
    address_to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    point_from: {
      type: DataTypes.GEOMETRY('POINT')
    },
    point_to: {
      type: DataTypes.GEOMETRY('POINT')
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
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM,
      values: ['in stock', 'in the way', 'delivered']
    }
  });
  Orders.associate = function(models) {
    models.Orders.hasOne(models.Cars);
  };
  return Orders;
};