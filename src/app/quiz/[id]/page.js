'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function Quiz({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isQuizActive, setIsQuizActive] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [getUser, setUser] = useState(null);


    useEffect(() => {
        // Cek apakah pengguna sudah login
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login'); // Redirect ke login jika belum login
        } else {
            setUser(user);
        }
    }, [router]);

    // Ambil data pertanyaan dari API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/api/quiz?category_id=${id}`);
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [id]);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isQuizActive) {
            interval = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isQuizActive]);

    // // Format waktu (HH:MM:SS)
    // const formatTime = (time) => {
    //     const hours = Math.floor(time / 3600);
    //     const minutes = Math.floor((time % 3600) / 60);
    //     const seconds = time % 60;
    //     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    // };

    const handleAnswer = (option) => {
        if (option === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        setIsQuizActive(false);

        // Simpan hasil quiz ke database
        try {
            const userId = getUser ? getUser?.id : 0; // Ganti dengan ID pengguna yang sesungguhnya (jika ada sistem login)
            const response = await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    categoryId: id,
                    score: (score / questions.length) * 100,
                    totalQuestions: questions.length,
                    timeElapsed,
                }),
            });

            if (response.ok) {
                router.push(`/result/${id}?score=${score}&time=${timeElapsed}&total=${questions.length}`);
            } else {
                console.error('Failed to save quiz result');
            }
        } catch (error) {
            console.error('Error saving quiz result:', error);
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (questions.length === 0) {
        return <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">Loading...</div>;
    }

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
                                <span className="ml-1 text-gray-500 md:ml-2 capitalize">Quiz</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Progress Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>
                </div>

                {/* Quiz Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {questions[currentQuestion].question}
                        </h2>
                        <div className="space-y-4">
                            {[
                                questions[currentQuestion].option1,
                                questions[currentQuestion].option2,
                                questions[currentQuestion].option3,
                                questions[currentQuestion].option4,
                            ].map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    className="w-full bg-gray-100 text-gray-800 p-4 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300 text-left md:focus:bg-blue-500 md:focus:text-white"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sebelumnya
                    </button>
                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                            Selanjutnya
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                            Selesai
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}