// app/api/login/route.js
import bcrypt from 'bcryptjs';
import { getDBConnection } from '@/lib/db'

export async function POST(request) {
    // Ambil data dari body request
    let connection;
    const { username, password } = await request.json();

    try {
        connection = await getDBConnection();

        // Cari pengguna berdasarkan username
        const [rows] = await connection.query(`
            SELECT u.*, k.name as kelas_name
            FROM users u
            LEFT JOIN kelas k ON u.kelas_id = k.id
            WHERE u.email = ?
        `, [username]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = rows[0];

        // Bandingkan password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Jika login berhasil, kembalikan data pengguna (tanpa password)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = user;
        return new Response(JSON.stringify(userData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ error: 'Failed to login' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        // await await connection.release();; // Tutup koneksi
        if (connection) {
            await connection.release();
        }
    }
}