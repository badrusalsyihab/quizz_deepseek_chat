'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { use } from 'react';

export default function Result({ params }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const score = searchParams.get('score');
    const timeElapsed = searchParams.get('time');
    const totalQuestions = searchParams.get('total');
    const router = useRouter();
    const [percentage, setPercentage] = useState(0);
    const [resultMessage, setResultMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    // Hitung persentase skor
    useEffect(() => {
        const calculatedPercentage = ((score / totalQuestions) * 100).toFixed(2);
        setPercentage(calculatedPercentage);

        // Tentukan pesan hasil berdasarkan persentase
        if (calculatedPercentage >= 80) {
            setResultMessage('Congratulations! You did an excellent job! 🎉');
            setIsDownloading(true)
        } else if (calculatedPercentage >= 50) {
            setResultMessage('Good job! You passed, but there is room for improvement. 👍');
        } else {
            setResultMessage('Keep practicing! You can do better next time. 💪');
        }
    }, [score, totalQuestions]);


    // Format waktu (HH:MM:SS)
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Fungsi untuk membuat dan mendownload sertifikat
    const downloadCertificate = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        // Tambahkan background gambar
        const img = new Image();
        img.src = '/certificate-bg.JPEG'; // Ganti dengan path gambar background Anda
        img.onload = () => {
            doc.addImage(img, 'JPEG', 0, 0, 297, 210);

            // Judul sertifikat
            doc.setFontSize(40);
            doc.setTextColor(40, 40, 40); // Warna abu-abu tua
            doc.setFont('helvetica', 'bold');
            //  doc.text('Certificate of Achievement', 105, 50, { align: 'center' });

            // Garis dekoratif
            doc.setDrawColor(200, 200, 200); // Warna abu-abu muda
            doc.setLineWidth(1);
            doc.line(50, 60, 247, 60);

            // Nama penerima
            doc.setFontSize(30);
            doc.setTextColor(0, 0, 0); // Warna biru tua
            doc.setFont('helvetica', 'bold');
            const userName = localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user')).username
                : 'Participant';
            doc.text(userName, 148.5, 99, { align: 'center' });

            // Pesan sertifikat
            doc.setFontSize(20);
            doc.setTextColor(40, 40, 40); // Warna abu-abu tua
            doc.setFont('helvetica', 'normal');
            doc.text('has successfully completed the quiz', 148.5, 115, { align: 'center' });

            // Detail sertifikat
            // doc.setFontSize(18);
            // doc.setTextColor(0, 0, 0); // Warna hitam
            // doc.text(`Score: ${score}/${totalQuestions} (${percentage}%)`, 105, 130, { align: 'center' });
            // doc.text(`Time Elapsed: ${formatTime(timeElapsed)}`, 105, 140, { align: 'center' });

            // Tanggal
            const date = new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });
            doc.setFontSize(17);
            doc.setTextColor(40, 40, 40); // Warna abu-abu tua
            doc.text(`${date}`, 148.5, 125, { align: 'center' });

            // Tanda tangan
            // doc.setFontSize(16);
            // doc.setTextColor(40, 40, 40); // Warna abu-abu tua
            // doc.text('Signature: ___________________', 105, 180, { align: 'center' });

            // Simpan sertifikat sebagai PDF
            doc.save(`Certificate_${userName}.pdf`);
        };
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
                                <span className="ml-1 text-gray-500 md:ml-2 capitalize">Hasil</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Result Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
                    <h1 className="text-4xl font-bold text-blue-500 mb-6">Hasil akhir</h1>

                    {/* Skor dan Persentase */}
                    <div className="mb-8">
                        <p className="text-2xl font-semibold text-gray-800">
                            kamu jawab benar: <span className="text-blue-500">{score}</span> dari {totalQuestions} soal
                        </p>
                        <p className="text-lg text-gray-600">
                            Skor: <span className="text-blue-500">{parseFloat(percentage) % 1 === 0 ? parseFloat(percentage).toFixed(0) : percentage}%</span>
                        </p>
                        <p className="text-lg text-gray-600">
                            Waktu: <span className="text-blue-500">{formatTime(timeElapsed)}</span>
                        </p>
                    </div>

                    {/* Pesan Hasil */}
                    <div className="mb-8">
                        <p className="text-xl font-semibold text-gray-800">{resultMessage}</p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                            Kembali ke Dashboard
                        </button>
                        <button
                            onClick={() => router.push(`/category/${id}`)}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                            Coba lagi
                        </button>
                        {
                            isDownloading && (
                                <button
                                    onClick={downloadCertificate}
                                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300"
                                >
                                    Download Certificate
                                </button>
                            )
                        }

                    </div>
                    {/* <div className="mb-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">

                        <div className="bg-white w-full max-w-[800px] h-auto shadow-lg rounded-lg p-6 md:p-8 text-center border-2 border-gray-200 md:w-1/2">

                            <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-4 md:mb-8">CERTIFICATE</h1>
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-6 md:mb-12">OF ACHIEVEMENT</h2>


                            <p className="text-lg md:text-2xl text-gray-600 mb-4 md:mb-6">THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>
                            <p className="text-2xl md:text-4xl font-bold text-blue-800 mb-6">user1</p>
                            <p className="text-lg md:text-2xl text-gray-600">has successfully completed the quiz</p>
                            <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-12">Date: 20 February 2025</p>


                            <div className="flex flex-col md:flex-row justify-between mt-8 md:mt-16 space-y-6 md:space-y-0">
                                <div className="text-center">
                                    <p className="text-lg md:text-xl font-bold text-gray-800">CHARLES BLAKE</p>
                                    <p className="text-base md:text-lg text-gray-600">PRESIDENT</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg md:text-xl font-bold text-gray-800">JULIE S. SMITH</p>
                                    <p className="text-base md:text-lg text-gray-600">GENERAL MANAGER</p>
                                </div>
                            </div>
                        </div>

                    </div> */}
                </div>
            </div>
        </div>
    );
}