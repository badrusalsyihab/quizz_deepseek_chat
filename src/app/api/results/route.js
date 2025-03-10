// app/api/results/route.js
import { createPool } from 'mysql2/promise';
import { getDBConnection } from '@/lib/db'

export async function POST(request) {
    let connection;
    // Ambil data dari body request
    const { userId, categoryId, score, totalQuestions, timeElapsed } = await request.json();

    // Buat koneksi ke MySQL
    // const pool = createPool({
    //     host: '30vog.h.filess.io',
    //     user: 'quizdeepseek_entirepet', // Ganti dengan username MySQL Anda
    //     password: '5c7c25afb5d36e860bde166fe4d49d7893879f31', // Ganti dengan password MySQL Anda
    //     database: 'quizdeepseek_entirepet', // Ganti dengan nama database Anda
    //     waitForConnections: true,
    //     connectionLimit: 10,
    //     queueLimit: 0,
    // });

    try {
        connection = await getDBConnection();
        // Simpan data hasil quiz ke database
        await connection.query(
            'INSERT INTO quiz_results (user_id, category_id, score, total_questions, time_elapsed) VALUES (?, ?, ?, ?, ?)',
            [userId, categoryId, score, totalQuestions, timeElapsed]
        );
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return new Response(JSON.stringify({ error: 'Failed to save quiz result' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        if (connection) connection.release()
    }
}



export async function GET(request) {
    let connection;
    // Ambil data dari body request
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const single = searchParams.get('single');
    const group = searchParams.get('group');
    const limit = searchParams.get('limit');

    // console.log('user_id', user_id, 'single', single, 'group', group);

    // Buat koneksi ke MySQL
    // const pool = createPool({
    //     host: '30vog.h.filess.io',
    //     user: 'quizdeepseek_entirepet', // Ganti dengan username MySQL Anda
    //     password: '5c7c25afb5d36e860bde166fe4d49d7893879f31', // Ganti dengan password MySQL Anda
    //     database: 'quizdeepseek_entirepet', // Ganti dengan nama database Anda
    //     waitForConnections: true,
    //     connectionLimit: 10,
    //     queueLimit: 0,
    // });

    try {
        connection = await getDBConnection();
        // Simpan data hasil quiz ke database
        if (user_id && !limit) {
            const [rows] = await connection.query(`
            SELECT qr.*, c.name as category_name, c.description as category_description
            FROM quiz_results qr
            LEFT JOIN categories c ON qr.category_id = c.id
            WHERE qr.user_id = ?
        `, [user_id]);
            return new Response(JSON.stringify(rows), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (user_id && limit) {
            const [rows] = await connection.query(`
                SELECT qr.*, c.name as category_name, c.description as category_description
                FROM quiz_results qr
                LEFT JOIN categories c ON qr.category_id = c.id
                WHERE qr.user_id = ?
                ORDER BY qr.created_at DESC
                LIMIT ?
            `, [user_id, parseInt(limit)]);

            return new Response(JSON.stringify(rows), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else {
            const [rows] = await connection.query('SELECT * FROM quiz_results');
            return new Response(JSON.stringify(rows), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error('Error quiz result:', error);
        return new Response(JSON.stringify({ error: 'Failed quiz result' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        if (connection) connection.release()
    }
}