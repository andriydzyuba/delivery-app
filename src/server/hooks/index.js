const handlers = require('./handlers');

module.exports.set = models => {
  console.log('hooks SET');

  models.Orders.hook('afterCreate', (order) => {
    console.log('Create Order');
    return handlers.calculateOrderEstimate(order);
  })

  models.Cars.hook('afterCreate', () => {
    console.log('Created Car');
    return handlers.calculateAllOrdersEstimates();
  })

  models.Cars.hook('afterDestroy', () => {
    console.log('Destroyed Car');
    return handlers.calculateAllOrdersEstimates();
  })
}
