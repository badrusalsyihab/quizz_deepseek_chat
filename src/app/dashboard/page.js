'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AcademicCapIcon, CheckCircleIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/solid';
import ButtonLogout from "@/components/ButtonLogout";

export default function Dashboard() {
    const router = useRouter();
    const [, setKelas] = useState([]);
    const [category, setCategory] = useState([]);
    const [isResult, setResult] = useState([]);
    const [isResultWithLimit, setResultWithLimit] = useState([]);
    const [getUser, setUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login');
        } else {
            setUser(user);
        }
    }, [router]);

    useEffect(() => {
        if (getUser) {
            const fetchResult = async () => {
                try {
                    const response = await fetch(`/api/results?user_id=${getUser.id}`);
                    const data = await response.json();
                    setResult(data);
                } catch (error) {
                    console.error('Error fetching results:', error);
                }
            };

            fetchResult();
        }
    }, [router, getUser]);

    useEffect(() => {
        if (getUser) {
            const fetchResultWithLimit = async () => {
                try {
                    const response = await fetch(`/api/results?user_id=${getUser.id}&limit=5`);
                    const data = await response.json();
                    setResultWithLimit(data);
                } catch (error) {
                    console.error('Error fetching results:', error);
                }
            };

            fetchResultWithLimit();
        }
    }, [router, getUser]);

    useEffect(() => {
        if (!getUser) return;

        const fetchCategory = async () => {
            try {
                const response = await fetch(`/api/categories?kelas_id=${getUser.kelas_id}`);
                const data = await response.json();
                setCategory(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategory();
    }, [router, getUser]);

    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const response = await fetch(`/api/kelas`);
                const data = await response.json();
                setKelas(data);
            } catch (error) {
                console.error('Error fetching kelas:', error);
            }
        };

        fetchKelas();
    }, [router, getUser]);

    const calculateDaysAgo = (date) => {
        const currentDate = new Date();
        const createdAtDate = new Date(date);
        const differenceInTime = currentDate - createdAtDate;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    };

    const groupedResults = Array.isArray(isResult) ? isResult.reduce((acc, item) => {
        const categoryId = item.category_id;
        if (!acc[categoryId]) {
            acc[categoryId] = {
                category_name: item.category_name,
                results: [],
            };
        }
        acc[categoryId].results.push(item);
        return acc;
    }, {}) : {};

    const totalScore = Array.isArray(isResult) ? isResult.reduce((acc, item) => acc + item.score, 0) : 0;
    const averageScore = isResult.length ? (totalScore / isResult.length).toFixed(2) : 0;

    const groupedResultsCount = Object.keys(groupedResults).length ? Object.keys(groupedResults).length : 0;

    return (
        <>
            <nav className="bg-blue-600 p-4 text-white">
                <div className="container mx-auto flex items-center">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">QuizApps</h1>
                    </div>
                    <div className="flex space-x-4">
                        <ButtonLogout />
                    </div>
                </div>
            </nav>
            <div className="bg-gray-100">
                <div className="container mx-auto p-6">
                    <div className="text-3xl font-bold text-gray-800">Hi {getUser ? getUser?.username : ''}, Selamat datang di QuizApps</div>
                    <div className="text-md font-bold text-gray-800 mb-8">Ayo mulai dan ambil sertifikatmu sekarang dengan menjawab soal quiz</div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white cursor-pointer p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center" onClick={() => router.push(`/category/${getUser.kelas_id}`)}>
                            <AcademicCapIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Quizzes</h3>
                            <p className="text-4xl font-bold text-blue-600">{category.length}</p>
                            <div className="mt-4">
                                <button
                                    onClick={() => router.push(`/category/${getUser ? getUser?.kelas_id : ''}`)}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Pilih Quiz
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                            <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Completed Quizzes</h3>
                            <p className="text-4xl font-bold text-green-600">{groupedResultsCount}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                            <ChartBarIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Average Score</h3>
                            <p className="text-4xl font-bold text-purple-600">{averageScore}%</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                        <ul className="space-y-4">
                            {Array.isArray(isResultWithLimit) && isResultWithLimit.map((item) => {
                                const daysAgo = calculateDaysAgo(item.created_at);
                                return (
                                    <li key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">Quiz: {item.category_name}</p>
                                            <p className="text-sm text-gray-600">Score: {item.score}%</p>
                                        </div>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <ClockIcon className="h-5 w-5 mr-1" />
                                            {daysAgo === 0 ? 'Hari ini' : `${daysAgo} days ago`}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}