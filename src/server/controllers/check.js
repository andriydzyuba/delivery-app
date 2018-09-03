const models  = require('../models/index');

function getCheck(req, res){
  models.Orders.findOne({
    where: {
      track_code: req.params.track_code
    }
  }).then((order) => {
    res.json(order);
  });
};

module.exports = {
  getCheck
};