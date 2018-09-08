const models  = require('../models/index');

function getCars(req, res){
  models.Cars.findAll({
    order: [
      ['id', 'ASC'],
    ]
  })
    .then((cars) => {
      res.json(cars);
    });
};

function createCar(req, res){
  models.Cars.create({
    status: req.body.status,
    location: req.body.location,
    location_check: req.body.location_check,
    point: req.body.point
  }).then((cars) => {
    res.send(cars);
  });
};

module.exports = {
  getCars,
  createCar
};