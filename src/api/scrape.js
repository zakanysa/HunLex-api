
const { spawn } = require('child_process');

async function routes(fastify, options) {
  // Helper function to validate secret
  const validateSecret = (secret) => secret === process.env.SCRAPE_SECRET;

  // Helper function to run scraper process
  const runScraperProcess = (scriptPath, processName) => {
    const scrapeProcess = spawn('node', [scriptPath]);

    scrapeProcess.stdout.on('data', (data) => {
      console.log(`${processName} stdout: ${data}`);
    });

    scrapeProcess.stderr.on('data', (data) => {
      console.error(`${processName} stderr: ${data}`);
    });

    scrapeProcess.on('close', (code) => {
      console.log(`${processName} process exited with code ${code}`);
    });

    return scrapeProcess;
  };

  // Original endpoint - scrape both lawyers and firms
  fastify.post('/api/scrape', async (request, reply) => {
    const { secret } = request.body;
    if (!validateSecret(secret)) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    runScraperProcess('src/lib/scraper/run-scraper.js', 'Full scraper');
    return { message: 'Full scraping process started (lawyers + firms)' };
  });

  // Scrape lawyers only
  fastify.post('/api/scrape/lawyers', async (request, reply) => {
    const { secret } = request.body;
    if (!validateSecret(secret)) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    runScraperProcess('src/lib/scraper/run-lawyer-scraper.js', 'Lawyer scraper');
    return { message: 'Lawyer scraping process started' };
  });

  // Scrape law firms only
  fastify.post('/api/scrape/firms', async (request, reply) => {
    const { secret } = request.body;
    if (!validateSecret(secret)) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    runScraperProcess('src/lib/scraper/run-firm-scraper.js', 'Firm scraper');
    return { message: 'Firm scraping process started' };
  });
}

module.exports = routes;
