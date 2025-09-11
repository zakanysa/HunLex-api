require('dotenv').config();
const db = require('../db');
const HungarianLawFirmScraper = require('./firmScraper');

const run = async () => {
  const firmScraper = new HungarianLawFirmScraper(db);

  try {
    console.log('Starting firm scraper...');
    await firmScraper.scrapeAll();
    console.log('Firm scraper finished.');
  } catch (error) {
    console.error('An error occurred during firm scraping:', error);
  }
};

run();