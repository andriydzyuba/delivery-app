const models  = require('../models/index');
const moment = require('moment');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCoq4_-BeKtYRIs-3FjJL721G1eP5DaU0g',
  Promise: Promise
});

/*** Actions with DB ***/
function getAllCar(){
  return models.Cars.findAll()
}

function getAllWaitingOrders(){
  return models.Orders.findAll({
    where: {
      status: 'waiting'
    }
  })
}

function calculateCarUpdate(dateEstimated, car, order){
  return models.Cars.update(
    {
      available_check: dateEstimated,
      location_check: order.dataValues.address_to
    },
    {where: {id: car.dataValues.id}}
  );
}

function calculateOrderUpdate(dateEstimated, time, order){
  return models.Orders.update(
    {
      date_estimated: dateEstimated,
      travel_time: time
    },
    {where: {id: order.dataValues.id}}
  )
}

/*** Set Order Estimate Time ***/
function setOrderEstimateTime(car, time, order){
  console.log(car.dataValues.id + '--->' + order.dataValues.id);

  let dateEstimated = moment(car.dataValues.available_check).add(time, 'seconds').toDate();

  return Promise.all([
    calculateCarUpdate(dateEstimated, car, order),
    calculateOrderUpdate(dateEstimated, time, order)
  ])
}

/*** Nearest Car ***/
function nearestCar(cars, order) {
  const _TIME = 10800;
  let foundCar, timeCar;
  let longCars = [];
  let shortCars = [];
  let specialCar = [];

  cars.forEach(function(car) {
    if(car.time > _TIME){
      longCars.push(car)
    } else {
      shortCars.push(car)
    }
  });

  if (shortCars.length === 0){
    longCars.forEach(function(car) {
      if(car.car.dataValues.special_car === true){specialCar.push(car)}
    });
    if (specialCar.length !== 0) {
      specialCar.sort(function (a, b) {
        return a.time - b.time
      });
      foundCar = specialCar[0].car;
      timeCar = specialCar[0].time;
      return setOrderEstimateTime(foundCar, timeCar, order)
    }
  } else {
    shortCars.sort(function (a, b) {
      return a.time - b.time
    });
    foundCar = shortCars[0].car;
    timeCar = shortCars[0].time;
    return setOrderEstimateTime(foundCar, timeCar, order)
  }
}

/*** Search Distance To Car ***/
function searchNearestCar(order) {
  let cars, point, travel_time;
  let nearestCars = [];
  return getAllCar()
    .then(data => {
      cars = data;
      return Promise.all(cars.map(car => {
        return googleMapsClient.directions({
          origin: order.dataValues.address_from,
          destination: car.dataValues.location_check
        })
          .asPromise()
          .then((response) => {
            point = response.json.routes[0].legs[0];
            if (order.dataValues.travel_time !== null){
              nearestCars.push({
                time: point.duration.value + order.dataValues.travel_time,
                car: car
              });
              if (nearestCars.length === cars.length){
                return nearestCar(nearestCars, order)
              }
            } else {
              return googleMapsClient.directions({
                origin: order.dataValues.address_from,
                destination: order.dataValues.address_to
              })
                .asPromise()
                .then((response) => {
                  travel_time = response.json.routes[0].legs[0].duration.value;
                  nearestCars.push({
                    time: point.duration.value + travel_time,
                    car: car
                  });
                  if (nearestCars.length === cars.length){
                    return nearestCar(nearestCars, order)
                  }
                })
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }))
    })
}

/*** Calculate All Orders Estimates ***/
function calculateAllOrdersEstimates(){
  let orders;
  return getAllWaitingOrders()
    .then(data => {
      orders = data;
      for (let i = 0; i < orders.length; i++) {
        setTimeout(function() {
            searchNearestCar(orders[i])
        }, i * 1000, i);
      }
    })
}

/*** Calculate Order Estimate ***/
function calculateOrderEstimate(order){
  searchNearestCar(order)
}

module.exports = {
  calculateAllOrdersEstimates,
  calculateOrderEstimate
};
