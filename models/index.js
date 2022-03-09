const config = require('../config/database')
const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(config.db_name,config.user,config.password, {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Users: require('./users')(sequelize),
    ShortUrl: require('./short_url')(sequelize),
}