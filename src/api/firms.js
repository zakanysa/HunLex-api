
const db = require('../lib/db');

async function routes(fastify, options) {
  fastify.get('/api/firms', async (request, reply) => {
    const { rows } = await db.query('SELECT * FROM law_firms');
    return rows;
  });

  fastify.get('/api/firms/:id', async (request, reply) => {
    const { id } = request.params;
    const { rows } = await db.query('SELECT * FROM law_firms WHERE id = $1', [id]);
    return rows[0];
  });
}

module.exports = routes;
