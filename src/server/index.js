const models  = require('./models/index');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server started on port ${port}`));
});

app.get('/api/orders', (req, res) => {
  models.FormOrders.findAll()
    .then(function (orders) {
      res.json(orders);
    });
});

app.post('/api/orders', function(req, res) {
  models.FormOrders.create({
    address_to: req.body.address_to,
    point_to: req.body.point_to,
    contacts: req.body.contacts
  }).then(function() {
    res.redirect('/api/orders');
  });
});