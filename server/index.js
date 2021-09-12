const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');
const { promisify } = require('util');
const redisConfig = require('./configs/redisConfig');
const pgConfig = require('./configs/pgConfig');
const serverConfig = require('./configs/serverConfig');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pgClient = new Pool(pgConfig);
pgClient.on('error', () => console.error('Lost PG connection'));
pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err));
});

const redisClient = redis.createClient(redisConfig);
const redisPublisher = redisClient.duplicate();
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);

app.get('/', (req, res) => {
  res.send('SERVER ONLINE');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  const values = await hgetallAsync('values');
  res.send(values);
});

app.post('/values', async (req, res) => {
  const { index } = req.body;

  if (parseInt(index, 10) > 40) {
    return res.status(422).send('Index too high');
  }

  await hsetAsync('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  return res.send({ working: true });
});

app.listen(serverConfig.port, () => {
  console.log(`Listening on port ${serverConfig.port}`);
});
