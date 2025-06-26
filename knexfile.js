require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: './src/database/migrations',
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
    migrations: {
      directory: './src/database/migrations',
    },
  },
};

module.exports = configs[environment];
