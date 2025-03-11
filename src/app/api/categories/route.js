// app/api/categories/route.js
import { getDBConnection } from '@/lib/db'


export async function GET(request) {
    let connection;
    const { searchParams } = new URL(request.url);
    const kelas_id = searchParams.get('kelas_id');
    try {

        connection = await getDBConnection();

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
            const [rows] = await connection.query(query, params);

            return new Response(JSON.stringify(rows), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            const [rows] = await connection.query('SELECT * FROM categories');
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
        // await pool.end(); // Tutup koneksi
        connection.end();
    }
}