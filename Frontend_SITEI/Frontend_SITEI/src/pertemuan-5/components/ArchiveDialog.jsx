import React from "react";
import { IoArchive } from "react-icons/io5";

const ACCENT_COLOR = "#2C2C2C";

const ArchiveDialog = ({ isOpen, onClose, className }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 text-center">

                <div className="flex justify-center mb-6">
                    <div className="bg-orange-100 p-3 rounded-full relative">
                        <IoArchive className="w-12 h-12 text-orange-500" />
                        <div className="absolute -top-1 -right-1 bg-green-500 p-1 rounded-full">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2" style={{ color: ACCENT_COLOR }}>
                    Berhasil Diarsipkan
                </h3>

                <p className="text-gray-600 mb-6 text-sm">
                    Kelas <strong>{className}</strong> berhasil dipindahkan ke Arsip.
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

export default ArchiveDialog;
