'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      address_from: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address_to: {
        type: Sequelize.STRING,
        allowNull: false
      },
      point_from: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      point_to: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
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
      track_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['waiting', 'processing', 'delivered']
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
    return queryInterface.dropTable('Orders');
  }
};