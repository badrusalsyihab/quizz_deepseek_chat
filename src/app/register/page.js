'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, EnvelopeIcon, LockClosedIcon, HomeIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [kelas, setKelas] = useState('')
    const [kelasOptions, setKelasOptions] = useState([])
    const [address, setAddress] = useState('')
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
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, kelas, address }),
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
                <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
                    <UserPlusIcon className="h-8 w-8 inline-block" /> Register
                </h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            <UserIcon className="h-5 w-5 inline-block" /> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            <EnvelopeIcon className="h-5 w-5 inline-block" /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            <LockClosedIcon className="h-5 w-5 inline-block" /> Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            <LockClosedIcon className="h-5 w-5 inline-block" /> Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {/* Kelas Field */}
                    <div>
                        <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">
                            <UserIcon className="h-5 w-5 inline-block" /> Kelas
                        </label>
                        <select
                            id="kelas"
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Address Field */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            <HomeIcon className="h-5 w-5 inline-block" /> Address
                        </label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Enter your address"
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <UserPlusIcon className="h-5 w-5 inline-block" /> Register
                        </button>
                    </div>
                </form>
                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            <ArrowRightOnRectangleIcon className="h-5 w-5 inline-block" /> Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}