// src/database.ts
import { Sequelize } from "sequelize"

const node_env = String(process.env.NODE_ENV)
let dialectOptions

if (node_env != "development") {
    dialectOptions = {
        ssl: {
            required: true,
            rejectUnauthorized: true, //make sure it works during prod
        },
    }
} else {
    dialectOptions = {}
}

const sequelize = new Sequelize({
    dialect: "postgres",
    host: String(process.env.DB_HOST), // or 'localhost'
    port: Number(process.env.DB_PORT),
    database: String(process.env.DB_DATABASE),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    logging: false, // optional
    dialectOptions: dialectOptions,
})

export default sequelize
