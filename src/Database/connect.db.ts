import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const connectionString = process.env.DATABASE_URL


const databaseConnection = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Required for Neon PostgreSQL
    },
});


databaseConnection.connect()
    .then(() => console.log('Connected to PostgreSQL database successfully!'))
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
        process.exit(-1);
    });

databaseConnection.on('error', (err) => {
    console.error('Database error:', err.message);
    process.exit(-1);
});


export const query = (text: string, params: any[]) => databaseConnection.query(text, params);
