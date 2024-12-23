require('dotenv').config()
const { Pool } = require('pg')
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, JWT_SECRET } = process.env

const DB = new Pool(
    {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        jwt_secret: JWT_SECRET,
        allowExitOnIdle: true
    }
)

module.exports = {
    DB
}
