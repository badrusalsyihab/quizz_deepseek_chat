// app/api/results/route.js
import { getDBConnection } from '@/lib/db'

export async function POST(request) {
    let connection;
    // Ambil data dari body request
    const { userId, categoryId, score, totalQuestions, timeElapsed } = await request.json();

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
        connection.end();
    }
}



export async function GET(request) {
    let connection;
    // Ambil data dari body request
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const limit = searchParams.get('limit');

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
        connection.end();
        //if (connection) connection.release()
    }
}