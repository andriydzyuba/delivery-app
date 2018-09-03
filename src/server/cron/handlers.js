const models  = require('../models/index');
const Promise = require('bluebird');
const moment = require('moment');
const sendMail = require('./sendmail');

/*** Calculate All Orders Estimates ***/
function getNextCar(){
  return models.Cars.findAll({
    order: [
      ['available_check', 'ASC']
    ],
    limit: 1
  })
}

function getAllWaitingOrders(){
  return models.Orders.findAll({
    where: {
      status: 'waiting'
    },
    order: [
      ['date', 'ASC'],
    ]
  })
}

function resetCarAvailableCheck(date){
  models.Cars.update(
    {available_check: date},
    {where: {id: 1-3}}
  )
}

function getOrderEstimateTime(order){
let car;
getNextCar()
  .then(data => {
    car = data[0];
    console.log(order.dataValues.id + '---' + car.dataValues.id);
    let dateEstimated;
    if (car.dataValues.available_check < order.dataValues.date){
      dateEstimated = moment(order.dataValues.date).add(order.dataValues.travel_time, 'seconds').toDate();
      console.log(dateEstimated);
    } else {
      dateEstimated = moment(car.dataValues.available_check).add(order.dataValues.travel_time, 'seconds').toDate();
      console.log(dateEstimated);
    }
    models.Cars.update(
      {available_check: dateEstimated},
      {where: {id: car.dataValues.id}}
    );
    models.Orders.update(
      {date_estimated: dateEstimated},
      {where: {id: order.dataValues.id}}
    )
  })
}

function calculateAllOrdersEstimates(){
  let nowDate = moment().toDate();
  resetCarAvailableCheck(nowDate);
  let orders;
  getAllWaitingOrders()
    .then(data => {
      orders = data;
      for (let i = 0; i < orders.length; i++) {
        setTimeout(function() {
          getOrderEstimateTime(orders[i])
        }, i * 1000, i);
      }
      // return Promise.all(orders.map(order => {
      //     getOrderEstimateTime(order)
      // }))
    })
}

/*** Processing Orders ***/
function getAllProcessingOrders(){
  return models.Orders.findAll({
    where: {
      status: 'processing'
    },
    order: [
      ['date', 'ASC'],
    ]
  })
}

function isOrderDelivered(order){
  let nowDate = moment().toDate();
  console.log(order.dataValues.id)
  // console.log(order.dataValues.date_estimated)
  // console.log(nowDate)
  if (nowDate > order.dataValues.date_estimated){
    console.log('delivered');
    models.Orders.update(
      {status: 'delivered', },
      {where: {id: order.dataValues.id}}
    );
    models.Cars.update(
      {status: 'free', available: true, available_at: nowDate, OrderId: null},
      {where: {OrderId: order.dataValues.id}}
    )
    return sendMail.sendNewMail(order);
  } else {
    console.log('do nothing')
  }
}

function getProcessingOrders() {
  let orders;
  getAllProcessingOrders()
    .then(data => {
      orders = data;
      for (let i = 0; i < orders.length; i++) {
        setTimeout(function() {
          isOrderDelivered(orders[i])
        }, i * 1000, i);
        // isOrderDelivered(orders[i])
      }
    })
}

/*** Assign Orders ***/
function getFreeCars(){
  return models.Cars.findAll({
    where: {
      status: 'free'
    }
  })
}

function getNextOrders(count){
  return models.Orders.findAll({
    where: {
      status: 'waiting'
    },
    order: [
      ['date', 'ASC'],
    ],
    limit: count
  })
}

function assignOrderToCar(order, car){
  // console.log(car.dataValues.id);
  // console.log(order.dataValues.id);
  car.setOrder(order);
  let nowDate = moment().toDate();
  let finalDateEstimated = moment(nowDate).add(order.dataValues.travel_time, 'seconds').toDate();
  models.Cars.update(
    {status: 'busy', available: false},
    {where: {id: car.dataValues.id}}
  );
  models.Orders.update(
    {status: 'processing', date_estimated: finalDateEstimated},
    {where: {id: order.dataValues.id}}
  )
}

function assignOrders(){
  let cars, orders;
  getFreeCars()
    .then(data => {
    cars = data;
    return getNextOrders(cars.length)
  })
    .then(data => {
      orders = data;
      return Promise.all(orders.map((order, i) => {
        assignOrderToCar(order, cars[i])
      }))
    })
}

/*** Update Deliveries ***/
function updateDeliveries(){
  getProcessingOrders()
  assignOrders()
}

module.exports = {
  calculateAllOrdersEstimates,
  updateDeliveries
};
