
require('dotenv').config();

const fastify = require('fastify')({
  logger: true
});

fastify.register(require('./api/lawyers'));
fastify.register(require('./api/firms'));
fastify.register(require('./api/scrape'));
fastify.register(require('./api/setup'));

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
