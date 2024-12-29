import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', { error: err.message });
});

export default pool;
