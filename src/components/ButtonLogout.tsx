'use client';

import React from 'react';

const ButtonLogout: React.FC = () => {
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    return (
        <button
            className="bg-gray-500 px-4 py-2 rounded hover:bg-red-600"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default ButtonLogout;