const knex = require('knex');
const config = require('../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env]);

if (process.env.NODE_ENV === 'development') {
  db.on('query', ({ sql, bindings }) => {
    console.log('[SQL]', sql, bindings);
  });
}

module.exports = db;
