const express = require('express');
const bodyParser = require("body-parser");
const crons = require('./cron/index');
const hooks = require('./hooks/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

const orders = require('./routes/orders');
const cars = require('./routes/cars');
const check = require('./routes/check');


const app = express();
const port = process.env.PORT || 5000;

const models  = require('./models/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/orders', orders);
app.use('/api/cars', cars);
app.use('/api/check', check);

models.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Server started on port ${port}`));
});

crons.start();

hooks.set(models);
