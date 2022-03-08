const config = {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    db_name: 'url_shortener',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

module.exports = config