import React from "react";

const ACCENT_COLOR = "#2C2C2C";

const SuccessDialog = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto p-8 text-center">

                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full relative">
                        <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="absolute -top-1 -right-1 bg-green-500 p-0.5 rounded-full">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2" style={{ color: ACCENT_COLOR }}>
                    Berhasil
                </h3>

                <p className="text-gray-600 mb-6 text-sm">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full px-6 py-2 rounded-xl font-semibold text-white hover:opacity-90 transition"
                    style={{ backgroundColor: ACCENT_COLOR }}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default SuccessDialog;
