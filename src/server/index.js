const models  = require('./models/index');
const express = require('express');
const bodyParser = require("body-parser");
const randomstring = require("randomstring");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server started on port ${port}`));
});

app.get('/api/orders', (req, res) => {
  models.Orders.findAll()
    .then(function (orders) {
      res.json(orders);
    });
});

app.get('/api/check/:track_code', (req, res) => {
  models.Orders.findOne({
    where: {
      track_code: req.params.track_code
    }
  }).then(function(order) {
    res.json(order);
  });
});

app.post('/api/orders', function(req, res) {
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
  }).then(function(order) {
    res.send(order);
  });
});