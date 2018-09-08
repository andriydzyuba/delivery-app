const models  = require('../models/index');
const Promise = require('bluebird');
const moment = require('moment');
const sendMail = require('./sendmail');
const direction = require('google-maps-direction');

/*** Calculate All Orders Estimates ***/
function resetCarAvailableCheck(date){
  return models.Cars.update(
    {available_check: date, location_check: 'Львів, Львівська область, Україна'},
    {where: { id : { $in : [1,2,3]}}}
  )
}

function getAllCar(){
  return models.Cars.findAll()
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

function calcCarUpdate(dateEstimated, car, order){
  return models.Cars.update(
    {available_check: dateEstimated, location_check: order.dataValues.address_to},
    {where: {id: car.dataValues.id}}
  );
}

function calcOrderUpdate(dateEstimated, order){
  return models.Orders.update(
    {date_estimated: dateEstimated},
    {where: {id: order.dataValues.id}}
  )
}

function getOrderEstimateTime(car, time, order){
  console.log(car.dataValues.id + '--->' + order.dataValues.id);
  let dateStartDelivery;
  let dateEstimated;
  // if (car.dataValues.available_check < order.dataValues.date){
  //   dateStartDelivery = moment(order.dataValues.date).add(time, 'seconds').toDate();
  //   dateEstimated = moment(dateStartDelivery).add(order.dataValues.travel_time, 'seconds').toDate();
  //   console.log(dateEstimated);
  // } else {
  //   dateStartDelivery = moment(car.dataValues.available_check).add(time, 'seconds').toDate();
  //   dateEstimated = moment(dateStartDelivery).add(order.dataValues.travel_time, 'seconds').toDate();
  //   console.log(dateEstimated);
  // }
  dateStartDelivery = moment(car.dataValues.available_check).add(time, 'seconds').toDate();
  dateEstimated = moment(dateStartDelivery).add(order.dataValues.travel_time, 'seconds').toDate();
  console.log(dateEstimated);

  return Promise.all(calcCarUpdate(dateEstimated, car, order), calcOrderUpdate(dateEstimated, order))
}

function nearestCar(cars, order) {
  console.log(order);
  console.log(cars);
  cars.sort(function (a, b) {
    return a.distance - b.distance
  });

  let foundCar = cars[0].car;
  let timeCar = cars[0].time;

  // return Promise.all(
  //   assignOrderToCar(foundOrder, timeOrder, car)
  // )
  getOrderEstimateTime(foundCar, timeCar, order)
}

function searchNearestCar(order) {
  let cars;
  let nearestCars = [];
  getAllCar()
    .then(data => {
      cars = data;
      console.log(cars);
      for (let i = 0; i < cars.length; i++) {
        setTimeout(function () {
          direction({
            origin: order.dataValues.address_from,
            destination: cars[i].dataValues.location_check
          })
            .then(result => {
              let point = result.routes[0].legs[0];
              console.log(point.distance.value);
              nearestCars.push({
                time: point.duration.value,
                distance: point.distance.value,
                car: cars[i]
              });
              if (nearestCars.length === cars.length){
                console.log("!!!");
                nearestCar(nearestCars, order)
              }
            })
        }, i * 300, i);
      }
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
          searchNearestCar(orders[i])
        }, i * 2000, i);
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

function isOrderDelivered(order){
  let nowDate = moment().toDate();
  console.log(order.dataValues.id);
  // console.log(order.dataValues.date_estimated)
  // console.log(nowDate)
  if (nowDate > order.dataValues.date_estimated){
    console.log('delivered');

    sendMail.sendNewMail(order);

    return Promise.all(delivCarUpdate(order), delivOrderUpdate(order))

    // models.Orders.update(
    //   {status: 'delivered', },
    //   {where: {id: order.dataValues.id}}
    // );
    // models.Cars.update(
    //   {status: 'free', OrderId: null},
    //   {where: {OrderId: order.dataValues.id}}
    // )
    // return sendMail.sendNewMail(order);
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

function assignOrderToCar(order, time, car){
  console.log(car.dataValues.id + '--->' + order.dataValues.id);
  // console.log(car.dataValues.id);
  // console.log(time);

  car.setOrder(order);
  let nowDate = moment().toDate();
  let dateStartDelivery = moment(nowDate).add(time, 'seconds').toDate();
  let finalDateEstimated = moment(dateStartDelivery).add(order.dataValues.travel_time, 'seconds').toDate();

  return Promise.all(assignCarUpdate(finalDateEstimated, car, order), assignOrderUpdate(finalDateEstimated, order))

  // models.Cars.update(
  //   {status: 'busy', available_at: finalDateEstimated, location: order.dataValues.address_to},
  //   {where: {id: car.dataValues.id}}
  // );
  // models.Orders.update(
  //   {status: 'processing', date_estimated: finalDateEstimated},
  //   {where: {id: order.dataValues.id}}
  // )
}

function nearestOrder(orders, car) {
  // console.log(orders);
  // console.log(car);
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

function searchNearestOrder(car) {
  let orders;
  let nearestOrders = [];
  getNextOrders()
    .then(data => {
      orders = data;
      // console.log(car.dataValues.id);

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
                // console.log("!!!");
                nearestOrder(nearestOrders, car)
              }
            })
        }, i * 300, i);
      }
    })
}

function assignOrders(){
  let cars;
  getFreeCars()
    .then(data => {
    cars = data;
    // console.log(cars);
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

/*** Update Deliveries ***/
function updateDeliveries(){
  // getProcessingOrders()
  assignOrders()
}

/*** Calculate Orders ***/
function calculateOrders(){
  let nowDate = moment().toDate();
  resetCarAvailableCheck(nowDate)
    .then(data => {
      calculateAllOrdersEstimates()
    })
  // calculateAllOrdersEstimates()
}

module.exports = {
  // calculateOrders,
  updateDeliveries
};
