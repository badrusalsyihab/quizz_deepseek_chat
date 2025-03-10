import { getDBConnection } from '@/lib/db'

export async function POST(request) {
    // Ambil data dari body request
    let connection;
    const { category_id, question, option1, option2, option3, option4, answer } = await request.json();

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