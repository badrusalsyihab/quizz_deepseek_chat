// app/api/categories/route.js
import { createPool } from 'mysql2/promise';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const kelas_id = searchParams.get('kelas_id');

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

        // Ambil data kategori dari database
        if (kelas_id) {
            // const [rows] = await pool.query('SELECT * FROM categories WHERE kelas_id = ?', [kelas_id]);

            let query = `
           SELECT c.*, COUNT(q.id) as total_questions
           FROM categories c
           LEFT JOIN questions q ON c.id = q.category_id
       `;
            let params = [];

            if (kelas_id) {
                query += ' WHERE c.kelas_id = ?';
                params.push(kelas_id);
            }

            query += ' GROUP BY c.id';

            // Ambil data kategori dari database
            const [rows] = await pool.query(query, params);

            return new Response(JSON.stringify(rows), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            const [rows] = await pool.query('SELECT * FROM categories');
            return new Response(JSON.stringify(rows), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await pool.end(); // Tutup koneksi
    }
}