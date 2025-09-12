require('dotenv').config();
const db = require('../db');
const HungarianLawyerScraper = require('./lawyerScraper');

const run = async () => {
  const lawyerScraper = new HungarianLawyerScraper(db);

  try {
    console.log('Starting lawyer scraper...');
    await lawyerScraper.scrapeAll();
    console.log('Lawyer scraper finished.');
  } catch (error) {
    console.error('An error occurred during lawyer scraping:', error);
  }
};

run();