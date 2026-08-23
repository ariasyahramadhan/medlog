import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom"; 

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetLink = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("https://api.sigmaeducation.id/api/forgot-password", { email });
            
            toast.success("Link reset password telah dikirim ke Gmail Anda! 📧");
            setEmail("");
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Gagal mengirim link.";
            toast.error(errorMsg + " ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100 font-poppins relative">
            <Toaster />
            
            {/* Tombol Kembali */}
            <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF5722] transition-colors mb-6 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Kembali ke Login
            </Link>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#0C2340]">Reset Password</h2>
                <p className="text-gray-500 text-sm mt-2">Masukkan email terdaftar untuk menerima link akses.</p>
            </div>

            <form onSubmit={handleResetLink} className="space-y-5">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest block mb-2">Alamat Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@gmail.com"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722] focus:bg-white outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF5722] text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#E64A19] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Kirim Link Akses"}
                </button>
            </form>
        </div>
    );
}