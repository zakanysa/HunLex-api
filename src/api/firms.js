
const db = require('../lib/db');

// Helper function to structure firm data
const structureFirmData = (firm) => {
  const structured = {
    ...firm,
    members: firm.members ? 
      firm.members.split(',').map(member => member.trim()) : [],
    contact: {
      phone: firm.phone,
      email: firm.email,
      tax_number: firm.tax_number,
      egovernment_id: firm.egovernment_id
    },
    address: {
      postal_code: firm.postal_code,
      city: firm.city,
      street: firm.street,
      full_address: firm.full_address
    },
    correspondence_address: firm.corr_postal_code ? {
      postal_code: firm.corr_postal_code,
      city: firm.corr_city,
      street: firm.corr_street,
      full_address: firm.corr_full_address
    } : null,
    office_leader: firm.office_leader_name ? {
      name: firm.office_leader_name,
      kasz: firm.office_leader_kasz
    } : null
  };

  // Remove redundant flat fields that are now in nested objects
  delete structured.phone;
  delete structured.email;
  delete structured.tax_number;
  delete structured.egovernment_id;
  delete structured.postal_code;
  delete structured.city;
  delete structured.street;
  delete structured.full_address;
  delete structured.corr_postal_code;
  delete structured.corr_city;
  delete structured.corr_street;
  delete structured.corr_full_address;
  delete structured.office_leader_name;
  delete structured.office_leader_kasz;

  return structured;
};

async function routes(fastify, options) {
  fastify.get('/api/firms', async (request, reply) => {
    const { rows } = await db.query('SELECT * FROM law_firms');
    return rows.map(structureFirmData);
  });

  fastify.get('/api/firms/:id', async (request, reply) => {
    const { id } = request.params;
    const { rows } = await db.query('SELECT * FROM law_firms WHERE id = $1', [id]);
    if (rows.length === 0) {
      reply.code(404);
      return { error: 'Firm not found' };
    }
    return structureFirmData(rows[0]);
  });
}

module.exports = routes;
