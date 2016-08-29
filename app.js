global.__base = __dirname + '/';
const app = 'mongoose-skeleton';

require('dotenv').config();
require(__base + 'app/index');

module.exports = app;
