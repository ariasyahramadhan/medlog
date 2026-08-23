import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

/**
 * Reusable AlertModal Component
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Function to call when closing
 * @param {string} title - Modal heading
 * @param {string} message - Modal body text
 */
const AlertModal = ({ isOpen, onClose, title, message }) => {
    // We use a small delay for the animation classes to trigger correctly
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger entrance animation
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div
                className={`relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 ease-out ${isVisible ? 'scale-100' : 'scale-90'
                    }`}
            >
                {/* Content Section */}
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>

                {/* Action Section */}
                <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md active:scale-95 transform"
                    >
                        Got it!
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 font-sans">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">React Custom Alert</h1>
                <p className="text-gray-600">Click the button below to test the modal.</p>
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-2xl shadow-xl transition-all hover:shadow-2xl active:scale-95"
            >
                Show Custom Alert
            </button>

            <AlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Notice"
                message="This is a custom alert box built with React and Tailwind CSS. It supports smooth transitions and is fully accessible via keyboard."
            />
        </div>
    );
}