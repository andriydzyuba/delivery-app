const randomstring = require("randomstring");

const models  = require('../models/index');

function getOrders (req, res){
  models.Orders.findAll({
    order: [
      ['id', 'ASC'],
    ]
  })
    .then((orders) => {
      res.json(orders);
    });
};

function createOrder(req, res){
  models.Orders.create({
    address_from: req.body.address_from,
    point_from: req.body.point_from,
    address_to: req.body.address_to,
    point_to: req.body.point_to,
    contacts: req.body.contacts,
    travel_time: req.body.travel_time,
    status: req.body.status,
    track_code: randomstring.generate({
      length: 10,
      charset: 'alphanumeric',
      capitalization: 'uppercase'
    })
  }).then((order) => {
    res.send(order);
  });
};

module.exports = {
  getOrders,
  createOrder
};