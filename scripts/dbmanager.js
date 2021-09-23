const db = require('../database/sqliteWrapper');
const args = process.argv.slice(2);
db[args[0]](...args.slice(1));