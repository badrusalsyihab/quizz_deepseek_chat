'use client';
import { useState, useEffect } from 'react';
import { ClipboardIcon, PencilIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/solid';

export default function QuestionForm() {
    const [formData, setFormData] = useState({
        category_id: '',
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
    });

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        // Fetch categories from the server
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    console.log(categories);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Question added successfully!');
                setFormData({
                    category_id: '',
                    question: '',
                    option1: '',
                    option2: '',
                    option3: '',
                    option4: '',
                    answer: '',
                });
            } else {
                alert(result.error || 'Failed to add question');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to connect to the server');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <ClipboardIcon className="h-6 w-6 text-blue-500 mr-2" />
                    Add New Question
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <PencilIcon className="h-5 w-5 text-gray-500 mr-2" />
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Question */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            Question
                        </label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Option 1
                            </label>
                            <input
                                type="text"
                                name="option1"
                                value={formData.option1}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Option 2
                            </label>
                            <input
                                type="text"
                                name="option2"
                                value={formData.option2}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Option 3
                            </label>
                            <input
                                type="text"
                                name="option3"
                                value={formData.option3}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Option 4
                            </label>
                            <input
                                type="text"
                                name="option4"
                                value={formData.option4}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                            Correct Answer
                        </label>
                        <select
                            name="answer"
                            value={formData.answer}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        >
                            <option value="">Select the correct answer</option>
                            <option value={formData.option1}>Option 1</option>
                            <option value={formData.option2}>Option 2</option>
                            <option value={formData.option3}>Option 3</option>
                            <option value={formData.option4}>Option 4</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}