'use client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/'); // Redirect ke home setelah logout
    };

    return (
        <nav className="bg-blue-500 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">QuizApp</h1>
                <div className="flex gap-4">
                    <button onClick={() => router.push('/')} className="bg-green-500 p-2 rounded hover:bg-green-600">
                        Home
                    </button>
                    <button onClick={handleLogout} className="bg-red-500 p-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}