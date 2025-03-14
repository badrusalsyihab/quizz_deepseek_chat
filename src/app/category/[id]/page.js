'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HomeIcon, ArrowRightIcon, TrophyIcon } from '@heroicons/react/24/solid';

export default function Category() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [getUser, setUser] = useState(null);
    const [quizResults, setQuizResults] = useState([]);

    useEffect(() => {
        // Cek apakah pengguna sudah login
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login'); // Redirect ke login jika belum login
        } else {
            setUser(user);
        }
    }, [router]);

    // Ambil data kategori dari API
    useEffect(() => {
        if (!getUser) return;

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
    }, [router, getUser]);

    useEffect(() => {
        if (!getUser) return;

        const fetchQuizResults = async () => {
            try {
                const response = await fetch(`/api/results?user_id=${getUser.id}`);
                const data = await response.json();
                setQuizResults(data);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
            }
        };

        fetchQuizResults();
    }, [router, getUser]);

    const handleStartQuiz = (categoryId) => {
        router.push(`/quiz/${categoryId}`);
    };

    const hasHighScore = (categoryId) => {
        const categoryResults = quizResults.filter(result => result.category_id === categoryId);
        if (categoryResults.length === 0) return false;

        // Sort results by date and get the latest one
        const latestResult = categoryResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        return latestResult.score > 80;
    };

    const allScoresAbove80 = () => {
        // Check if there are results for every category
        const categoryIds = categories.map(category => category.id);
        const resultsByCategory = categoryIds.map(categoryId => {
            const categoryResults = quizResults.filter(result => result.category_id === categoryId);
            if (categoryResults.length === 0) return false;

            // Sort results by date and get the latest one
            const latestResult = categoryResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
            return latestResult.score > 80;
        });

        // Check if all categories have scores above 80
        return resultsByCategory.every(result => result === true);
    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            {/* Breadcrumb */}

            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-700 hover:text-blue-500 inline-flex items-center"
                        >
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                            <span className="ml-1 text-gray-500 md:ml-2 capitalize">Kategori</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="container mx-auto">


                {/* Show Download Sertifikat button if all scores are above 80 */}
                {Boolean(categories.length && quizResults.length) && allScoresAbove80() && (
                    <div className="mb-5">
                        <button
                            onClick={() => router.push(`/dashboard`)}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <TrophyIcon className="h-5 w-5 inline-block mr-2" />
                            Download Sertifikat
                        </button>
                    </div>
                )}

                {/* Grid untuk kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Gambar Kategori */}
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={300}
                                height={300}
                                className="w-full h-48 object-cover"
                            />

                            {/* Konten Kategori */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
                                <p className="text-gray-600">{category.description}</p>
                                <p className="text-gray-600 mb-4">Total Soal: {category.total_questions}</p>

                                <button
                                    onClick={() => handleStartQuiz(category.id)}
                                    disabled={Boolean(hasHighScore(category.id))}
                                    className={cn("w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500", Boolean(hasHighScore(category.id)) && 'bg-gray-300 hover:bg-gray-600 cursor-not-allowed')}
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