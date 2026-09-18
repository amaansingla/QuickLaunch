const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runSchema() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('Schema applied successfully — products and signups tables created.');
  } catch (err) {
    console.error('Failed to apply schema:', err);
  } finally {
    await pool.end();
  }
}

runSchema();