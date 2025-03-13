'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [kelas, setKelas] = useState('')
    const [kelasOptions, setKelasOptions] = useState([])
    const router = useRouter()


    useEffect(() => {
        // Fetch kelas options from the server
        const fetchKelasOptions = async () => {
            try {
                const response = await fetch('/api/kelas')
                const data = await response.json()
                setKelasOptions(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Error fetching kelas options:', error)
            }
        }

        fetchKelasOptions()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            // console.log(username, email, password, kelas);
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, kelas }),
            })

            const data = await response.json()

            if (response.ok) {
                router.push('/login')
            } else {
                setError(data.error || 'Registration failed')
            }
        } catch (err) {
            setError('Failed to connect to server')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Kelas</label>
                        <select
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Kelas</option>
                            {kelasOptions.map((kelasOption) => (
                                <option key={kelasOption.id} value={kelasOption.id}>
                                    {kelasOption.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    )
}