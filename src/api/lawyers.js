
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
    const { practice_area, language, name, chamber } = request.query;
    
    let query = 'SELECT * FROM all_lawyers WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Filter by practice area (case-insensitive, partial match)
    if (practice_area) {
      query += ` AND UPPER(practice_areas) LIKE UPPER($${paramIndex})`;
      params.push(`%${practice_area}%`);
      paramIndex++;
    }
    
    // Filter by language (case-insensitive, partial match)
    if (language) {
      query += ` AND UPPER(languages) LIKE UPPER($${paramIndex})`;
      params.push(`%${language}%`);
      paramIndex++;
    }
    
    // Filter by name (case-insensitive, partial match)
    if (name) {
      query += ` AND UPPER(name) LIKE UPPER($${paramIndex})`;
      params.push(`%${name}%`);
      paramIndex++;
    }
    
    // Filter by chamber (case-insensitive, partial match)
    if (chamber) {
      query += ` AND UPPER(chamber) LIKE UPPER($${paramIndex})`;
      params.push(`%${chamber}%`);
      paramIndex++;
    }
    
    const { rows } = await db.query(query, params);
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
