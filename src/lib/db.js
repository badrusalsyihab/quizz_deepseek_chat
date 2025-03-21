// lib/db.js
import mysql from 'mysql2/promise';

let pool;

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

