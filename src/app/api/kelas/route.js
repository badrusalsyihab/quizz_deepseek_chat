// app/api/categories/route.js
import { getDBConnection } from '@/lib/db'

export async function GET() {

    let connection;

    try {
        connection = await getDBConnection();

        // Ambil data kategori dari database
        const [rows] = await connection.query('SELECT * FROM kelas');
        return new Response(JSON.stringify(rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching kelas:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch kelas' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        //await connection.end(); // Tutup koneksi
        connection.end();
    }
}