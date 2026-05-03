'use strict';
const Redis = require('ioredis');

let client;

module.exports = async function connectRedis() {
  client = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 3
  });
  await client.connect();
  console.log('[Redis] Connected ✓');
  return client;
};

module.exports.getClient = () => client;
