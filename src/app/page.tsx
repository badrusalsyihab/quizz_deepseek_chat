'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah pengguna sudah login
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    if (user) {
      router.push('/dashboard'); // Redirect ke dashboard jika sudah login
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">QuizApp</h1>
          {/* <button
            onClick={() => router.push('/login')}
            className="bg-green-500 p-2 rounded hover:bg-green-600"
          >
            Login
          </button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black-500">
              Welcome to <span className="text-blue-500">QuizApp</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Test your knowledge and challenge yourself with our fun and interactive quizzes. Login to get started!
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <Image
              src="https://placehold.in/300x200" // Ganti dengan gambar yang sesuai
              width={500}
              height={400}
              alt="Quiz App"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-black-500">Why Choose QuizApp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black-500">
            {/* Feature 1 */}
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Interactive Quizzes</h3>
              <p className="text-gray-700">
                Engage with quizzes that are fun and challenging, designed to test your knowledge.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Multiple Categories</h3>
              <p className="text-gray-700">
                Choose from a wide range of categories to suit your interests and expertise.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Track Your Progress</h3>
              <p className="text-gray-700">
                Monitor your results and improve your skills over time with detailed feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 QuizApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}