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
    status: req.body.status
  }).then((cars) => {
    res.send(cars);
  });
};

module.exports = {
  getCars,
  createCar
};