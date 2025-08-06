const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'dailyfix_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false
});

const User = require('./user')(sequelize);

module.exports = {
  sequelize,
  User
};
