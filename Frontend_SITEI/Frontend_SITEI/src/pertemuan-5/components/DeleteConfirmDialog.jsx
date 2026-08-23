import React from "react";

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, className }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 text-center">

                <h3 className="text-xl font-bold mb-3 text-red-600">
                    Hapus Kelas?
                </h3>

                <p className="text-gray-600 mb-6 text-sm">
                    Apakah Anda yakin ingin menghapus kelas <strong>{className}</strong>?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold"
                    >
                        Batal
                    </button>

                    <button
                        onClick={onConfirm}
                        className="w-full px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold"
                    >
                        Hapus
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteConfirmDialog;
