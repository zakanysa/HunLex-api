
const db = require('../lib/db');

// Helper function to structure lawyer data
const structureLawyerData = (lawyer) => {
  return {
    ...lawyer,
    practice_areas: lawyer.practice_areas ? 
      lawyer.practice_areas.split(',').map(area => area.trim()) : [],
    languages: lawyer.languages ? 
      lawyer.languages.split(',').map(lang => lang.trim()) : [],
    licenses: lawyer.license ? 
      lawyer.license.split(/Ü-/).filter(Boolean).map(lic => {
        const parts = lic.trim().split(' - ');
        return {
          number: 'Ü-' + parts[0],
          status: parts[1] || 'UNKNOWN'
        };
      }) : []
  };
};

async function routes(fastify, options) {
  fastify.get('/api/lawyers', async (request, reply) => {
    const { rows } = await db.query('SELECT * FROM all_lawyers');
    return rows.map(structureLawyerData);
  });

  fastify.get('/api/lawyers/:kasz', async (request, reply) => {
    const { kasz } = request.params;
    const { rows } = await db.query('SELECT * FROM all_lawyers WHERE kasz = $1', [kasz]);
    if (rows.length === 0) {
      reply.code(404);
      return { error: 'Lawyer not found' };
    }
    return structureLawyerData(rows[0]);
  });
}

module.exports = routes;
