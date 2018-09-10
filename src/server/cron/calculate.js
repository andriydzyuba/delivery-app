const models  = require('../models/index');
const Promise = require('bluebird');
const moment = require('moment');
const direction = require('google-maps-direction');

/*** Actions with DB ***/
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

/*** Get Order Estimate Time ***/
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

  return Promise.all(calcCarUpdate(dateEstimated, car, order), calcOrderUpdate(dateEstimated, order))
}

/*** Nearest Car ***/
function nearestCar(cars, order) {
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

/*** Search Distance To Car ***/
function searchNearestCar(order) {
  let cars;
  let nearestCars = [];
  getAllCar()
    .then(data => {
      cars = data;
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
                nearestCar(nearestCars, order)
              }
            })
        }, i * 300, i);
      }
    })
}

/*** Calculate All Orders Estimates ***/
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

/*** Start Calculate Orders ***/
function calculateOrders(){
  let nowDate = moment().toDate();
  resetCarAvailableCheck(nowDate)
    .then(data => {
      calculateAllOrdersEstimates()
    })
  // calculateAllOrdersEstimates()
}

module.exports = {
  calculateOrders
};