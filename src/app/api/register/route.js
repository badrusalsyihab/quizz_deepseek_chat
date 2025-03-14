import { getDBConnection } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    const { username, email, password, kelas, address } = await request.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    let connection
    try {
        connection = await getDBConnection()

        // Check if user exists
        const [existingUser] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        )

        if (existingUser.length > 0) {
            return new Response(
                JSON.stringify({ error: 'User already exists' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Create new user
        const [result] = await connection.query(
            'INSERT INTO users (username, email, password, kelas_id, address) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, kelas, address]
        )

        return new Response(
            JSON.stringify({ id: result.insertId, username, email }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Registration error:', error)
        return new Response(
            JSON.stringify({ error: 'Registration failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    } finally {
        if (connection) connection.release()
    }
}