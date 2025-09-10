const fs = require('fs').promises;
const path = require('path');
const db = require('../lib/db');

async function routes(fastify, options) {
  fastify.post('/api/setup', async (request, reply) => {
    const { secret } = request.body;
    if (secret !== process.env.SCRAPE_SECRET) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    try {
      const schemaPath = path.join(__dirname, '../../schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf8');
      
      await db.query(schema);
      
      return { message: 'Database schema created successfully' };
    } catch (error) {
      fastify.log.error('Setup error:', error);
      reply.code(500);
      return { error: 'Failed to create database schema', details: error.message };
    }
  });
}

module.exports = routes;