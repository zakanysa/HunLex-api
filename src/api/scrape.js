
const { spawn } = require('child_process');

async function routes(fastify, options) {
  fastify.post('/api/scrape', async (request, reply) => {
    const { secret } = request.body;
    if (secret !== process.env.SCRAPE_SECRET) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    const scrapeProcess = spawn('node', ['src/lib/scraper/run-scraper.js']);

    scrapeProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    scrapeProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    scrapeProcess.on('close', (code) => {
      console.log(`Scraping process exited with code ${code}`);
    });

    return { message: 'Scraping process started' };
  });
}

module.exports = routes;
