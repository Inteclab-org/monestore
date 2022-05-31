require('dotenv').config()
const { env } = require('process');

const configs = {
    PORT: env.PORT,
    PASSWORD: env.PASSWORD,
    DB_HOST: env.DB_HOST,
    DB_USER: env.DB_USER,
    DB_PORT: env.DB_PORT,
    DB_PASSWORD: env.DB_PASSWORD,
    DATABASE: env.DATABASE,
    NODE_ENV: env.NODE_ENV,
    JWT_KEY: env.JWT_KEY,
    TG_TOKEN: env.TG_TOKEN,
    ADMIN_ID: Number(env.ADMIN_ID),
    DB_CONNECTION_URL: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DATABASE}`
}

module.exports = configs;
