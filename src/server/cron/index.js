const cron = require('node-cron');
const calculate = require('./calculate');
const update = require('./update');

module.exports.start = () => {
  console.log('cron start');

  cron.schedule('* * * * *', () => { //'*/15 * * * * *'
    console.log('cron updateDeliveries');
    return update.updateDeliveries();
  });

  cron.schedule('*/5 * * * *', () => { //'*/40 * * * * *'
    console.log('cron calculateAllOrders');
    return calculate.calculateOrders();
  });

}
