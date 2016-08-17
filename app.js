global.__base = __dirname + '/';
const app = 'mongoose-skeleton';

require('dotenv').config();
require(__base + 'app');

module.exports = app;
