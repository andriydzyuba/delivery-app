import func from '../server/cron/handlers'

const simpelCar = {
  dataValues:
    {
      car: 1,
      special_car: false
    }
};

const specialCar = {
  dataValues:
    {
      car: 1,
      special_car: true
    }
};

const shortOrders = [
  {
    order: 1,
    time: 1000
  },
  {
    order: 2,
    time: 5000
  },
  {
    order: 3,
    time: 10000
  }
];

const longOrders = [
  {
    order: 1,
    time: 5000
  },
  {
    order: 2,
    time: 10000
  },
  {
    order: 3,
    time: 20000
  }
];

test('Set short order to short car', () => {
  expect(func.setTestNextOrder(longOrders, simpelCar)).toEqual(1)
});

test('Set short order to long car', () => {
  expect(func.setTestNextOrder(shortOrders, specialCar)).toEqual(1)
});

test('Set long order to long car', () => {
  expect(func.setTestNextOrder(longOrders, specialCar)).toEqual(3)
});
