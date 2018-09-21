const cron = require('node-cron');
const handlers = require('./handlers');

module.exports.start = () => {
  console.log('cron start');

  cron.schedule('* * * * *', () => { //'*/10 * * * * *'
    console.log('cron updateDeliveries');
    return handlers.updateDeliveries();
  });

}
