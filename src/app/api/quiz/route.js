// app/api/questions/route.js
import { getDBConnection } from '@/lib/db'

export async function GET(request) {
    // Ambil category_id dari query parameter
    let connection;
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    try {
        // Periksa apakah categoryId ada
        connection = await getDBConnection();
        if (!categoryId) {
            return new Response(JSON.stringify({ error: 'category_id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Ambil data pertanyaan berdasarkan category_id
        const [rows] = await connection.query(`
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
        // await connection.end(); // Tutup koneksi
        connection.end();
    }
}



