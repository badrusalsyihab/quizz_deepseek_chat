'use client';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb'; // Adjust the path as necessary
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function Category({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [getUser, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // Ambil data kategori dari API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`/api/categories?kelas_id=${getUser.kelas_id}`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleStartQuiz = (categoryId) => {
        router.push(`/quiz/${categoryId}`);
    };


    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="container mx-auto">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-gray-700 hover:text-blue-500 inline-flex items-center"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="ml-1 text-gray-500 md:ml-2 capitalize">Kategori</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">Silahkan pilih soal yang akan kamu ambil</h1>

                {/* Grid untuk kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Gambar Kategori */}
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-48 object-cover"
                            />

                            {/* Konten Kategori */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
                                <p className="text-gray-600">{category.description}</p>
                                <p className="text-gray-600 mb-4">Total Soal: {category.total_questions}</p>
                                <button
                                    onClick={() => handleStartQuiz(category.id)}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Mulai Quiz
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}