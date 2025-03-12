import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const Port = 5432

// Database Data
const databaseConnection = new Pool({
    user : process.env.db_username,
    host : process.env.db_host,
    database : process.env.db_name,
    password : process.env.db_password,
    port  : Port
})
databaseConnection.connect();

// Checking for db Errors 
databaseConnection.on('error', (err) => {
    console.log({ErrorDatabase : err.message });
    process.exit(-1)
})

export const query = (text: string, params: any[]) => databaseConnection.query(text, params)