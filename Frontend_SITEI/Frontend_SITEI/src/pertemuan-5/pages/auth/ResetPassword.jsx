import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat'];
    const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981'];

    useEffect(() => {
        if (!token || !email) {
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Tautan pemulihan tidak ditemukan atau tidak valid.',
                confirmButtonColor: '#003178'
            }).then(() => navigate('/login'));
        }
    }, [token, email, navigate]);

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            return Swal.fire("Proteksi Sandi", "Kata sandi baru minimal harus 8 karakter.", "warning");
        }
        if (password !== passwordConfirmation) {
            return Swal.fire("Konfirmasi Salah", "Kata sandi baru dan konfirmasi tidak cocok.", "warning");
        }
        setLoading(true);
        try {
            const res = await axios.post('https://api.sigmaeducation.id/api/reset-password-action', {
                token, email, password, password_confirmation: passwordConfirmation
            });
            setIsSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.password?.[0] || "Gagal memperbarui kata sandi.";
            Swal.fire({ icon: 'error', title: 'Gagal', text: msg, confirmButtonColor: '#003178' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap');

                .rp-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    color: #0f172a;
                    padding: 0;
                    letter-spacing: 0.01em;
                }
                .rp-input::placeholder { color: #94a3b8; font-weight: 400; }

                .rp-field {
                    position: relative;
                    background: #f8fafc;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                }
                .rp-field.focused {
                    background: #fff;
                    border-color: #003178;
                    box-shadow: 0 0 0 4px rgba(0,49,120,0.06);
                }
                .rp-field.match {
                    border-color: #10b981;
                    box-shadow: 0 0 0 4px rgba(16,185,129,0.06);
                }

                .rp-btn {
                    width: 100%;
                    padding: 15px 24px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(135deg, #003178 0%, #1a4db5 100%);
                    color: #fff;
                    font-family: 'Syne', sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 4px 20px rgba(0,49,120,0.22);
                    position: relative;
                    overflow: hidden;
                }
                .rp-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,49,120,0.28); }
                .rp-btn:active { transform: scale(0.99); }
                .rp-btn:disabled { opacity: 0.65; pointer-events: none; }
                .rp-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.5s;
                }
                .rp-btn:hover::after { left: 100%; }

                .rp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(0,49,120,0.06);
                    color: #003178;
                    padding: 5px 12px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                }

                .eye-btn {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                    flex-shrink: 0;
                }
                .eye-btn:hover { color: #475569; }

                .strength-bar {
                    height: 3px;
                    border-radius: 99px;
                    transition: all 0.4s ease;
                    flex: 1;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .success-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border: 1.5px solid #a7f3d0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 28px;
                }
            `}} />

            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <span className="rp-badge">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    Buat Sandi Baru
                                </span>
                            </div>
                            <h1 style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '28px',
                                fontWeight: 800,
                                color: '#0f172a',
                                lineHeight: 1.15,
                                marginBottom: '10px',
                                letterSpacing: '-0.02em'
                            }}>
                                Atur Ulang<br/>Kata Sandi
                            </h1>
                            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.65, fontWeight: 400 }}>
                                Buat kata sandi baru yang aman untuk akun{' '}
                                <span style={{ color: '#003178', fontWeight: 600 }}>{email}</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleResetSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                                
                                {/* Password Field */}
                                <div>
                                    <label style={{
                                        display: 'block', fontSize: '10.5px', fontWeight: 700,
                                        color: '#94a3b8', letterSpacing: '0.1em',
                                        textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '2px'
                                    }}>
                                        Kata Sandi Baru
                                    </label>
                                    <div className={`rp-field ${focusedField === 'pass' ? 'focused' : ''}`}>
                                        <svg width="16" height="16" fill="none" stroke={focusedField === 'pass' ? '#003178' : '#94a3b8'} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'stroke 0.25s' }}>
                                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                        <input
                                            className="rp-input"
                                            type={showPass ? "text" : "password"}
                                            placeholder="Minimal 8 karakter..."
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('pass')}
                                            onBlur={() => setFocusedField(null)}
                                            disabled={loading}
                                        />
                                        <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? (
                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Strength Indicator */}
                                    {password.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            style={{ marginTop: '8px', paddingLeft: '2px' }}
                                        >
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="strength-bar" style={{
                                                        background: i <= strength ? strengthColor[strength] : '#e2e8f0'
                                                    }}/>
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '10.5px', color: strengthColor[strength], fontWeight: 600 }}>
                                                Keamanan: {strengthLabel[strength]}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label style={{
                                        display: 'block', fontSize: '10.5px', fontWeight: 700,
                                        color: '#94a3b8', letterSpacing: '0.1em',
                                        textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '2px'
                                    }}>
                                        Konfirmasi Kata Sandi
                                    </label>
                                    <div className={`rp-field ${
                                        focusedField === 'confirm' ? 'focused' :
                                        (passwordConfirmation && password === passwordConfirmation) ? 'match' : ''
                                    }`}>
                                        <svg width="16" height="16" fill="none"
                                            stroke={
                                                (passwordConfirmation && password === passwordConfirmation) ? '#10b981' :
                                                focusedField === 'confirm' ? '#003178' : '#94a3b8'
                                            }
                                            strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'stroke 0.25s' }}>
                                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                        </svg>
                                        <input
                                            className="rp-input"
                                            type={showConfirmPass ? "text" : "password"}
                                            placeholder="Ulangi kata sandi baru..."
                                            value={passwordConfirmation}
                                            onChange={e => setPasswordConfirmation(e.target.value)}
                                            onFocus={() => setFocusedField('confirm')}
                                            onBlur={() => setFocusedField(null)}
                                            disabled={loading}
                                        />
                                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                            {showConfirmPass ? (
                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {passwordConfirmation && password !== passwordConfirmation && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px', paddingLeft: '2px', fontWeight: 500 }}
                                        >
                                            Kata sandi tidak cocok
                                        </motion.p>
                                    )}
                                    {passwordConfirmation && password === passwordConfirmation && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', paddingLeft: '2px', fontWeight: 500 }}
                                        >
                                            ✓ Kata sandi cocok
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="rp-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"/>
                                        Mengubah Kredensial...
                                    </>
                                ) : (
                                    <>
                                        Simpan Kata Sandi Baru
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        style={{ textAlign: 'center', paddingTop: '20px' }}
                    >
                        <motion.div
                            className="success-circle"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <svg width="36" height="36" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '26px',
                                fontWeight: 800,
                                color: '#0f172a',
                                marginBottom: '12px',
                                letterSpacing: '-0.02em'
                            }}>
                                Sandi Berhasil Diubah!
                            </h2>
                            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.65, maxWidth: '300px', margin: '0 auto 28px' }}>
                                Kata sandi baru Anda telah aktif. Silakan masuk menggunakan kredensial terbaru Anda.
                            </p>

                            {/* Security note */}
                            <div style={{
                                background: 'rgba(0,49,120,0.04)',
                                border: '1px solid rgba(0,49,120,0.1)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                textAlign: 'left',
                                maxWidth: '320px',
                                margin: '0 auto 28px'
                            }}>
                                <svg width="16" height="16" fill="none" stroke="#003178" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                                    Semua sesi sebelumnya telah diakhiri secara otomatis untuk keamanan Anda.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="rp-btn"
                                style={{ maxWidth: '320px', margin: '0 auto' }}
                            >
                                Masuk ke Aplikasi
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}