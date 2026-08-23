import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:8000/api/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success("Password berhasil diperbarui! Silakan login. ✨");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal mereset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg font-poppins">
            <Toaster />
            <h2 className="text-2xl font-bold text-center mb-6">Buat Password Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password Baru" 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Konfirmasi Password Baru" 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required 
                />
                
                <div className="flex items-center gap-2 px-1">
                    <input 
                        type="checkbox" 
                        id="showPass"
                        className="cursor-pointer"
                        onChange={() => setShowPassword(!showPassword)} 
                    />
                    <label htmlFor="showPass" className="text-sm text-gray-600 cursor-pointer select-none">
                        Tampilkan Password
                    </label>
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-[#FF5722] text-white py-3 rounded-xl font-bold disabled:opacity-50"
                >
                    {loading ? "Memproses..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}