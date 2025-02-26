// app/api/questions/route.js
import { createPool } from 'mysql2/promise';

export async function GET(request) {
    // Ambil category_id dari query parameter
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    // Buat koneksi ke MySQL
    const pool = createPool({
        host: '30vog.h.filess.io',
        user: 'quizdeepseek_entirepet', // Ganti dengan username MySQL Anda
        password: '5c7c25afb5d36e860bde166fe4d49d7893879f31', // Ganti dengan password MySQL Anda
        database: 'quizdeepseek_entirepet', // Ganti dengan nama database Anda
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    try {
        // Periksa apakah categoryId ada
        if (!categoryId) {
            return new Response(JSON.stringify({ error: 'category_id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Ambil data pertanyaan berdasarkan category_id
        const [rows] = await pool.query(`
            SELECT q.*, c.name as category_name, c.description as category_description
            FROM questions q
            JOIN categories c ON q.category_id = c.id
            WHERE q.category_id = ?
        `, [categoryId]);

        return new Response(JSON.stringify(rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch questions' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await pool.end(); // Tutup koneksi
    }
}



