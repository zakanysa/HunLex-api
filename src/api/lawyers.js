
const db = require('../lib/db');

async function routes(fastify, options) {
  fastify.get('/api/lawyers', async (request, reply) => {
    const { rows } = await db.query('SELECT * FROM all_lawyers');
    return rows;
  });

  fastify.get('/api/lawyers/:kasz', async (request, reply) => {
    const { kasz } = request.params;
    const { rows } = await db.query('SELECT * FROM all_lawyers WHERE kasz = $1', [kasz]);
    return rows[0];
  });
}

module.exports = routes;
