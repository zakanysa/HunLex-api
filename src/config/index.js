
module.exports = {
  scraper: {
    baseUrl: 'https://ouny.magyarugyvedikamara.hu/licoms/common/service/requestparser',
    lawyerTotalPages: 473,
    firmTotalPages: 210,
    delay: 1000,
  },
  db: {
    connectionString: process.env.DATABASE_URL,
  }
};
