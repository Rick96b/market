const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

function numberEnv(name, fallback) {
  const value = Number.parseInt(process.env[name], 10);
  return Number.isFinite(value) ? value : fallback;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'market_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    dialectOptions: {
      keepAlive: true,
      connectionTimeoutMillis: numberEnv('DB_CONNECTION_TIMEOUT_MS', 10000),
    },
    pool: {
      max: numberEnv('DB_POOL_MAX', 5),
      min: numberEnv('DB_POOL_MIN', 0),
      acquire: numberEnv('DB_POOL_ACQUIRE_MS', 30000),
      idle: numberEnv('DB_POOL_IDLE_MS', 10000),
      evict: numberEnv('DB_POOL_EVICT_MS', 10000),
    },
    retry: {
      max: numberEnv('DB_RETRY_MAX', 2),
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeConnectionTimedOutError/,
        /Connection terminated unexpectedly/,
        /ECONNRESET/,
        /ETIMEDOUT/,
      ],
    },
  }
);

module.exports = sequelize;
