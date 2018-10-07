const models  = require('../models/index');
const Promise = require("bluebird");
const moment = require('moment');
const sendMail = require('./sendmail');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCoq4_-BeKtYRIs-3FjJL721G1eP5DaU0g',
  Promise: Promise
});

/*** Actions with DB ***/
function getAllProcessingOrders(){
  return models.Orders.findAll({
    where: {
      status: 'processing'
    }
  })
}

function deliveryCarUpdate(order){
  return models.Cars.update(
    {
        status: 'free',
        OrderId: null
    },
    {where: {OrderId: order.dataValues.id}}
  )
}

function deliveryOrderUpdate(order){
  return models.Orders.update(
    {
        status: 'delivered'
    },
    {where: {id: order.dataValues.id}}
  )
}

/*** Check Delivered Orders Status ***/
function isOrderDelivered(order){
  let nowDate;
  nowDate = moment().toDate();
  if (nowDate > order.dataValues.date_estimated){
    console.log(order.dataValues.id, 'delivered');
    sendMail.sendNewMail(order);
    return Promise.all([
      deliveryCarUpdate(order),
      deliveryOrderUpdate(order)
    ])
  } else {
    console.log(order.dataValues.id, 'do nothing');
    return Promise.resolve();
  }
}

/*** Get Processing Orders ***/
function setDeliveredOrders() {
  let orders;
  return getAllProcessingOrders()
    .then(data => {
      orders = data;
      for (let i = 0; i < orders.length; i++) {
        setTimeout(function() {
          isOrderDelivered(orders[i])
        }, i * 1000, i);
      }
      // return Promise.all(orders.map(order => {
      //   return Promise.delay(2000).then(() => isOrderDelivered(order))
      // }))
    })
}

/*** ---------------------------------------------------- ***/

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
    }
  })
}

function assignCarUpdate(finalDateEstimated, car, order){
  return models.Cars.update(
    {
        status: 'busy',
        available_at: finalDateEstimated,
        available_check: finalDateEstimated,
        location: order.dataValues.address_to,
        location_check: order.dataValues.address_to,
        point: order.dataValues.point_to
    },
    {where: {id: car.dataValues.id}}
  )
}

function assignOrderUpdate(finalDateEstimated, time, order){
  return models.Orders.update(
    {
        status: 'processing',
        date_estimated: finalDateEstimated,
        travel_time: time
    },
    {where: {id: order.dataValues.id}}
  )
}

/*** Assign Order To Car ***/
function assignOrderToCar(order, time, car){
  let nowDate, finalDateEstimated;
  console.log(car.dataValues.id + '--->' + order.dataValues.id);
  return car.setOrder(order)
    .then(() => {
      nowDate = moment().toDate();
      finalDateEstimated = moment(nowDate).add(time, 'seconds').toDate();
      return Promise.all([
        assignCarUpdate(finalDateEstimated, car, order),
        assignOrderUpdate(finalDateEstimated, time, order)
      ])
    })
}

/*** Nearest Order ***/
function setNextOrder(orders, car) {
  const _WAYTIME = 10800;
  let nextOrder, timeOrder, isSpecialCar;
  let longOrders = [];
  let shortOrders = [];

  isSpecialCar = car.dataValues.special_car;

  orders.forEach(function(order) {
    if(order.time > _WAYTIME){
      longOrders.push(order)
    } else {
      shortOrders.push(order)
    }
  });

  console.log('long', longOrders);
  console.log('short', shortOrders);

  if (isSpecialCar){
    if (longOrders.length === 0){
      shortOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = shortOrders[0].order;
      timeOrder = shortOrders[0].time;
      return assignOrderToCar(nextOrder, timeOrder, car)
    } else {
      longOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = longOrders[0].order;
      timeOrder = longOrders[0].time;
      return assignOrderToCar(nextOrder, timeOrder, car)
    }
  } else {
    if (shortOrders.length === 0){
      longOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = longOrders[0].order;
      timeOrder = longOrders[0].time;
      return assignOrderToCar(nextOrder, timeOrder, car)
    } else {
      shortOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = shortOrders[0].order;
      timeOrder = shortOrders[0].time;
      return assignOrderToCar(nextOrder, timeOrder, car)
    }
  }
}

/*** Search Distance To Order ***/
function searchNextOrder(car) {
  let orders, point, travel_time;
  let nearestOrders = [];
  return getNextOrders()
    .then(data => {
      orders = data;
      return Promise.all(orders.map(order => {
        return googleMapsClient.directions({
          origin: car.dataValues.location,
          destination: order.dataValues.address_from
        })
          .asPromise()
          .then((response) => {
            point = response.json.routes[0].legs[0];
            if (order.dataValues.travel_time !== null){
              nearestOrders.push({
                time: point.duration.value + order.dataValues.travel_time,
                order: order
              });
              if (nearestOrders.length === orders.length){
                return setNextOrder(nearestOrders, car)
              }
            } else {
              return googleMapsClient.directions({
                origin: order.dataValues.address_from,
                destination: order.dataValues.address_to
              })
                .asPromise()
                .then((response) => {
                  travel_time = response.json.routes[0].legs[0].duration.value;
                  nearestOrders.push({
                    time: point.duration.value + travel_time,
                    order: order
                  });
                  if (nearestOrders.length === orders.length){
                    return setNextOrder(nearestOrders, car)
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

/*** Assign Orders ***/
function assignOrders(){
  let cars;
  return getFreeCars()
    .then(data => {
      cars = data;
      for (let i = 0; i < cars.length; i++) {
        setTimeout(function() {
          searchNextOrder(cars[i])
        }, i * 1000, i);
      }
      // return Promise.all(cars.map(car => {
      //   return Promise.delay(2000).then(() => searchNextOrder(car))
      // }))
    })
}

/*** Start Update Deliveries ***/
function updateDeliveries(){
  return Promise.all([
    setDeliveredOrders(),
    assignOrders()
  ])
}

/*** Test Nearest Order ***/
function setTestNextOrder(orders, car) {
  const _WAYTIME = 10800;
  let nextOrder, isSpecialCar;
  let longOrders = [];
  let shortOrders = [];

  isSpecialCar = car.dataValues.special_car;

  orders.forEach(function(order) {
    if(order.time > _WAYTIME){
      longOrders.push(order)
    } else {
      shortOrders.push(order)
    }
  });

  if (isSpecialCar){
    if (longOrders.length === 0){
      shortOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = shortOrders[0].order;
    } else {
      longOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = longOrders[0].order;
    }
  } else {
    if (shortOrders.length === 0){
      longOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = longOrders[0].order;
    } else {
      shortOrders.sort(function(a,b){
        return a.time - b.time
      });
      nextOrder = shortOrders[0].order;
    }
  }

  return nextOrder
}

module.exports = {
  updateDeliveries,
  setTestNextOrder
};
