const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL is not set.');
    process.exit(1);
  }

  console.log('Connecting to Neon PostgreSQL...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('Connected successfully to Neon.');

    const sqlPath = path.resolve(__dirname, '../../deploy/init.sql');
    console.log('Reading schema from:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing init.sql against Neon...');
    await client.query(sql);
    console.log('Schema execution completed successfully!');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\nVerified tables in public schema:');
    res.rows.forEach(r => console.log('  - ' + r.table_name));

    // Seed default organization if not present
    const orgCheck = await client.query("SELECT id, name, slug FROM organizations WHERE slug = 'sevlex-core'");
    let orgId;
    if (orgCheck.rows.length === 0) {
      const insertOrg = await client.query(`
        INSERT INTO organizations (name, slug, plan, max_seats)
        VALUES ('Sevlex Core Workspace', 'sevlex-core', 'enterprise_vpc', 100)
        RETURNING id, name, slug;
      `);
      orgId = insertOrg.rows[0].id;
      console.log('\nSeeded initial organization:', insertOrg.rows[0]);
    } else {
      orgId = orgCheck.rows[0].id;
      console.log('\nExisting organization found:', orgCheck.rows[0]);
    }

    client.release();
    await pool.end();
    console.log('\nNeon Database Initialization & Verification: 100% SUCCESS.');
  } catch (err) {
    console.error('Initialization failed:', err);
    await pool.end();
    process.exit(1);
  }
}

main();
