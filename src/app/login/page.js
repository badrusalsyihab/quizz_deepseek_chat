'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { LockClosedIcon, UserIcon, ArrowRightOnRectangleIcon, ArrowPathIcon, UserPlusIcon } from '@heroicons/react/24/solid';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [isDisableButton, setDisableButton] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setDisableButton(true);
        try {
            // Kirim data login ke API
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan data pengguna ke localStorage (simulasi login)
                localStorage.setItem('user', JSON.stringify(data));
                router.push('/dashboard'); // Redirect ke dashboard setelah login berhasil
            } else {
                setError(data.error || 'Login failed');
            }
            setDisableButton(false);
        } catch (error) {
            console.error('Error during login:', error);
            setError('Failed to connect to the server');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
                    Login
                </h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
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

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isDisableButton}
                            className={cn("w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500", isDisableButton && "bg-gray-500 focus:ring-gray-500")}
                        >
                            {isDisableButton ? <ArrowPathIcon className="h-5 w-5 inline-block animate-spin" /> : <ArrowRightOnRectangleIcon className="h-5 w-5 inline-block" />} {isDisableButton ? 'Loading..' : 'Login'}
                        </button>
                    </div>
                </form>
                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={() => router.push('/register')} // Ganti dengan route yang sesuai
                            className="text-blue-500 hover:underline"
                        >
                            <UserPlusIcon className="h-5 w-5 inline-block" /> Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}