import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

const db = knex(configs[environment as keyof typeof configs]);

export default db;
