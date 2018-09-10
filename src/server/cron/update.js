const models  = require('../models/index');
const Promise = require('bluebird');
const moment = require('moment');
const sendMail = require('./sendmail');
const direction = require('google-maps-direction');

/*** Actions with DB ***/
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

function delivCarUpdate(order){
  return models.Cars.update(
    {status: 'free', OrderId: null},
    {where: {OrderId: order.dataValues.id}}
  )
}

function delivOrderUpdate(order){
  return models.Orders.update(
    {status: 'delivered', },
    {where: {id: order.dataValues.id}}
  )
}

/*** Check Delivered Orders Status ***/
function isOrderDelivered(order){
  let nowDate = moment().toDate();
  console.log(order.dataValues.id);
  if (nowDate > order.dataValues.date_estimated){
    console.log('delivered');

    sendMail.sendNewMail(order);

    return Promise.all(delivCarUpdate(order), delivOrderUpdate(order))
  } else {
    console.log('do nothing')
  }
}

/*** Get Processing Orders ***/
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

/*** Actions with DB ***/
function getFreeCars(){
  return models.Cars.findAll({
    where: {
      status: 'free'
    }
  })
}

function getNextOrders(){
  return models.Orders.findAll({
    where: {
      status: 'waiting'
    },
    order: [
      ['date', 'ASC'],
    ],
    limit: 3
  })
}

function assignCarUpdate(finalDateEstimated, car, order){
  return models.Cars.update(
    {status: 'busy', available_at: finalDateEstimated, location: order.dataValues.address_to, point: order.dataValues.point_to},
    {where: {id: car.dataValues.id}}
  )
}

function assignOrderUpdate(finalDateEstimated, order){
  return models.Orders.update(
    {status: 'processing', date_estimated: finalDateEstimated},
    {where: {id: order.dataValues.id}}
  )
}

/*** Assign Order To Car ***/
function assignOrderToCar(order, time, car){
  console.log(car.dataValues.id + '--->' + order.dataValues.id);

  car.setOrder(order);
  let nowDate = moment().toDate();
  let dateStartDelivery = moment(nowDate).add(time, 'seconds').toDate();
  let finalDateEstimated = moment(dateStartDelivery).add(order.dataValues.travel_time, 'seconds').toDate();

  return Promise.all(assignCarUpdate(finalDateEstimated, car, order), assignOrderUpdate(finalDateEstimated, order))
}

/*** Nearest Order ***/
function nearestOrder(orders, car) {
  orders.sort(function (a, b) {
    return a.distance - b.distance
  });

  let foundOrder = orders[0].order;
  let timeOrder = orders[0].time;

  // return Promise.all(
  //   assignOrderToCar(foundOrder, timeOrder, car)
  // )
  assignOrderToCar(foundOrder, timeOrder, car)
}

/*** Search Distance To Order ***/
function searchNearestOrder(car) {
  let orders;
  let nearestOrders = [];
  getNextOrders()
    .then(data => {
      orders = data;

      for (let i = 0; i < orders.length; i++) {
        setTimeout(function () {
          direction({
            origin: car.dataValues.location,
            destination: orders[i].dataValues.address_from
          })
            .then(result => {
              let point = result.routes[0].legs[0];
              console.log(point.distance.value);
              nearestOrders.push({
                time: point.duration.value,
                distance: point.distance.value,
                order: orders[i]
              });
              if (nearestOrders.length === orders.length){
                nearestOrder(nearestOrders, car)
              }
            })
        }, i * 300, i);
      }
    })
}

/*** Assign Orders ***/
function assignOrders(){
  let cars;
  getFreeCars()
    .then(data => {
      cars = data;
      // return Promise.all(cars.map((car) => {
      //   searchNearestOrder(car)
      // }))
      for (let i = 0; i < cars.length; i++) {
        setTimeout(function() {
          searchNearestOrder(cars[i])
        }, i * 2000, i);
      }
    })
}

/*** Start Update Deliveries ***/
function updateDeliveries(){
  getProcessingOrders()
  assignOrders()
}

module.exports = {
  updateDeliveries
};
