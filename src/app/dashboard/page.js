'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Dashboard() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setKelas] = useState([]);
    const [category, setCategory] = useState([]);
    const [isResult, setResult] = useState([]);
    const [isResultWithLimit, setResultWithLimit] = useState([]);
    const getUser = useState(JSON.parse(localStorage.getItem('user')));


    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await fetch(`/api/results?user_id=${getUser.id}`);
                const data = await response.json();
                setResult(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchResult();
    }, [router]);


    useEffect(() => {
        const fetchResultWithLimit = async () => {
            try {
                const response = await fetch(`/api/results?user_id=${getUser.id}&limit=5`);
                const data = await response.json();
                setResultWithLimit(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchResultWithLimit();
    }, [router]);


    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`/api/categories?kelas_id=${getUser.kelas_id}`);
                const data = await response.json();
                setCategory(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchCategory();
    }, [router]);

    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const response = await fetch(`/api/kelas`);
                const data = await response.json();
                setKelas(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchKelas();
    }, [router]);

    useEffect(() => {
        // Cek apakah pengguna sudah login
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login'); // Redirect ke login jika belum login
        }
    }, [router]);


    const calculateDaysAgo = (date) => {
        const currentDate = new Date();
        const createdAtDate = new Date(date);
        const differenceInTime = currentDate - createdAtDate;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    };


    // Group results by category_id
    const groupedResults = isResult.reduce((acc, item) => {
        const categoryId = item.category_id;
        if (!acc[categoryId]) {
            acc[categoryId] = {
                category_name: item.category_name,
                results: [],
            };
        }
        acc[categoryId].results.push(item);
        return acc;
    }, {});

    // Calculate average score
    const totalScore = isResult.reduce((acc, item) => acc + item.score, 0);
    const averageScore = isResult.length ? (totalScore / isResult.length).toFixed(2) : 0;

    const groupedResultsCount = Object.keys(groupedResults).length ? Object.keys(groupedResults).length : 0;

    return (
        <>
            <div className="container mx-auto p-6">
                <div className="text-3xl font-bold text-gray-800">Hi {getUser.username}, Selamat datang di QuizApps</div>
                {/* <div className="text-xl font-bold text-gray-800 mb-8">Kamu sekrang berada di {getUser.kelas_name}</div> */}
                <div className="text-md font-bold text-gray-800 mb-8">Ayo mulia dan ambil sertifikat mu sekarang dengan menjawab soal quizz</div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white cursor-pointer p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center" onClick={() => router.push(`/category/${getUser.kelas_id}`)} >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Quizzes</h3>
                        <p className="text-4xl font-bold text-blue-600">{category.length}</p>
                        <div className="mt-4">
                            <button
                                onClick={() => router.push(`/category/${getUser.kelas_id}`)}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Pilih Quiz
                            </button>
                        </div>

                        {/* <div className="mt-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => router.push(`/questions`)} >Buat pertanyaan</button>
                        </div> */}

                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Completed Quizzes</h3>
                        <p className="text-4xl font-bold text-green-600">{groupedResultsCount}</p>
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Average Score</h3>
                        <p className="text-4xl font-bold text-purple-600">{averageScore}%</p>
                    </div>
                </div>


                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                    <ul className="space-y-4">

                        {isResultWithLimit.map((item) => {
                            const daysAgo = calculateDaysAgo(item.created_at);
                            return (
                                <li key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Quiz: {item.category_name}</p>
                                        <p className="text-sm text-gray-600">Score : {item.score}%</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{daysAgo === 0 ? '' : daysAgo} {daysAgo === 0 ? 'Hari ini' : 'days ago'}</span>
                                </li>
                            );
                        })}

                    </ul>
                </div>
            </div>
        </>
    );
}