'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cars', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ['free', 'busy']
      },
      special_car: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      available_at: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW
      },
      available_check: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location_check: {
        type: Sequelize.STRING,
        allowNull: false
      },
      point: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      OrdersId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: true,
        references: {
          model: 'Orders',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cars');
  }
};
