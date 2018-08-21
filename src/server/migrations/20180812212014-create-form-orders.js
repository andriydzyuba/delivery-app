'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FormOrders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      address_from: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Lviv'
      },
      address_to: {
        type: Sequelize.STRING,
        allowNull: false
      },
      point_from: {
        type: Sequelize.GEOMETRY('POINT')
      },
      point_to: {
        type: Sequelize.GEOMETRY('POINT')
      },
      contacts: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      travel_time: {
        type: Sequelize.INTEGER
      },
      date_estimated: {
        type: Sequelize.DATE
      },
      status: {
        type: DataTypes.ENUM,
        values: ['in stock', 'in the way', 'delivered']
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FormOrders');
  }
};