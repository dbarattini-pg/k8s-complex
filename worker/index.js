const redis = require('redis');
const redisConfig = require('./configs/redisConfig');
const { fib } = require('./services/fibCalculator');

const redisClient = redis.createClient(redisConfig);
const sub = redisClient.duplicate();
sub.on('message', (_, message) => {
  redisClient.hset('values', message, fib(parseInt(message, 10)));
});
sub.subscribe('insert');
