import { createPool } from 'mysql2/promise';
import { getDBConnection } from '@/lib/db'

export async function POST(request) {
    // Ambil data dari body request
    let connection;
    const { category_id, question, option1, option2, option3, option4, answer } = await request.json();

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
        // Simpan pertanyaan ke database
        connection = await getDBConnection();
        await connection.query(
            'INSERT INTO questions (category_id, question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [category_id, question, option1, option2, option3, option4, answer]
        );
        return new Response(JSON.stringify({ message: 'Question added successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error saving question:', error);
        return new Response(JSON.stringify({ error: 'Failed to save question' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        if (connection) connection.release()
    }
}