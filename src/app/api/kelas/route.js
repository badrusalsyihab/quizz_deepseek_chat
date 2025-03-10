// app/api/categories/route.js
import { createPool } from 'mysql2/promise';
import { getDBConnection } from '@/lib/db'

export async function GET() {
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
        if (connection) connection.release()
    }
}