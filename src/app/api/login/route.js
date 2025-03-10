// app/api/login/route.js
import { createPool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { getDBConnection } from '@/lib/db'

export async function POST(request) {
    // Ambil data dari body request
    let connection;
    const { username, password } = await request.json();

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
        connection = await getDBConnection();

        // Cari pengguna berdasarkan username
        const [rows] = await connection.query(`
            SELECT u.*, k.name as kelas_name
            FROM users u
            LEFT JOIN kelas k ON u.kelas_id = k.id
            WHERE u.email = ?
        `, [username]);
        console.log(rows);
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
        // await connection.end(); // Tutup koneksi
        if (connection) connection.release()
    }
}