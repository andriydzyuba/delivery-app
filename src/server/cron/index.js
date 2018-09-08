const cron = require('node-cron');
// const handlers = require('./handlers');
const handlers = require('./nexthandlers');

module.exports.start = () => {
  console.log('cron start');

  // cron.schedule('* * * * *', () => { //'*/15 * * * * *'
  //   console.log('cron updateDeliveries');
  //   return handlers.updateDeliveries();
  // });

  // cron.schedule('*/5 * * * *', () => { //'*/40 * * * * *'
  //   console.log('cron calculateAllOrders');
  //   return handlers.calculateAllOrdersEstimates();
  // });

  // cron.schedule('*/10 * * * * *', () => { //'*/40 * * * * *'
  //   console.log('cron calculateAllOrders');
  //   return handlers.calculateOrders();
  // });

}