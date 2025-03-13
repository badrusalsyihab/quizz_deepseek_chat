// lib/db.js
import { createPool } from 'mysql2/promise'
import mysql from 'mysql2/promise';

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quizapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

let pool;

// export function createDBConnection() {
//     if (!pool) {
//         pool = createPool(DB_CONFIG)
//     }
//     return pool
// }

// export async function getDBConnection() {
//     const pool = createDBConnection()
//     return await pool.getConnection()
// }

export const getDBConnection = async () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'quizapp',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool.getConnection();
};

