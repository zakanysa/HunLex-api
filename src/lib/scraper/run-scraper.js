
require('dotenv').config();
const db = require('../db');
const HungarianLawyerScraper = require('./lawyerScraper');
const HungarianLawFirmScraper = require('./firmScraper');

const run = async () => {
  const lawyerScraper = new HungarianLawyerScraper(db);
  const firmScraper = new HungarianLawFirmScraper(db);

  try {
    console.log('Starting lawyer scraper...');
    await lawyerScraper.scrapeAll();
    console.log('Lawyer scraper finished.');

    console.log('Starting firm scraper...');
    await firmScraper.scrapeAll();
    console.log('Firm scraper finished.');
  } catch (error) {
    console.error('An error occurred during scraping:', error);
  }
};

run();
