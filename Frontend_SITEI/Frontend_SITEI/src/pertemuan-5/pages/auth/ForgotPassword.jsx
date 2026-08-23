import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [focused, setFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return Swal.fire("Email Wajib Diisi", "Silakan masukkan alamat email akun Anda.", "warning");
        }
        setLoading(true);
        try {
            const res = await axios.post('https://api.sigmaeducation.id/api/forgot-password', { email });
            setIsSent(true);
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.email?.[0] || err.response?.data?.message || "Terjadi gangguan server.";
            Swal.fire({ icon: 'error', title: 'Permintaan Gagal', text: errorMsg, confirmButtonColor: '#003178' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap');

                .fp-input {
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
                .fp-input::placeholder { color: #94a3b8; font-weight: 400; }

                .fp-field {
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
                .fp-field.focused {
                    background: #fff;
                    border-color: #003178;
                    box-shadow: 0 0 0 4px rgba(0,49,120,0.06);
                }

                .fp-btn {
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
                .fp-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,49,120,0.28); }
                .fp-btn:active { transform: scale(0.99); }
                .fp-btn:disabled { opacity: 0.65; pointer-events: none; }
                .fp-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.5s;
                }
                .fp-btn:hover::after { left: 100%; }

                .fp-badge {
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

                .fp-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #cbd5e1;
                    font-size: 11px;
                }
                .fp-divider::before, .fp-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #e2e8f0;
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

                .checkmark-circle {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border: 1.5px solid #a7f3d0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                }

                .resend-btn {
                    background: none;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 10px 24px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                    letter-spacing: 0.04em;
                }
                .resend-btn:hover { border-color: #003178; color: #003178; background: rgba(0,49,120,0.04); }
            `}} />

            <AnimatePresence mode="wait">
                {!isSent ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Back Link */}
                        <a href="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: '#94a3b8', fontSize: '11px', fontWeight: 600,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            textDecoration: 'none', marginBottom: '32px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#475569'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M19 12H5M12 5l-7 7 7 7"/>
                            </svg>
                            Kembali ke Login
                        </a>

                        {/* Header */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <span className="fp-badge">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    Pemulihan Akun
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
                                Lupa Kata<br/>Sandi?
                            </h1>
                            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.65, fontWeight: 400, maxWidth: '340px' }}>
                                Masukkan email penanggung jawab yang terdaftar dan kami akan mengirimkan tautan pemulihan secara instan.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '8px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    color: '#94a3b8',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    marginBottom: '8px',
                                    paddingLeft: '2px'
                                }}>
                                    Alamat Email Institusi
                                </label>
                                <div className={`fp-field ${focused ? 'focused' : ''}`}>
                                    <svg width="16" height="16" fill="none" stroke={focused ? '#003178' : '#94a3b8'} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'stroke 0.25s' }}>
                                        <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
                                    </svg>
                                    <input
                                        className="fp-input"
                                        type="email"
                                        placeholder="dokter@prodianestesi.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <p style={{ fontSize: '11px', color: '#94a3b8', paddingLeft: '2px', marginBottom: '24px', marginTop: '6px' }}>
                                Pastikan ini adalah email yang terdaftar di sistem MedLog AI.
                            </p>

                            <button type="submit" className="fp-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"/>
                                        Menghubungi Server SMTP...
                                    </>
                                ) : (
                                    <>
                                        Kirim Tautan Pemulihan
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider + Info */}
                        <div style={{ marginTop: '28px' }}>
                            <div className="fp-divider">
                                <span>atau hubungi administrator</span>
                            </div>
                            <div style={{
                                marginTop: '16px',
                                background: '#f8fafc',
                                border: '1px dashed #e2e8f0',
                                borderRadius: '12px',
                                padding: '14px 16px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px'
                            }}>
                                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                                </svg>
                                <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                    Hubungi <strong style={{ color: '#475569' }}>Admin FK UNRI</strong> jika mengalami kendala akses atau email tidak terdaftar di sistem.
                                </p>
                            </div>
                        </div>
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
                            className="checkmark-circle"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <svg width="32" height="32" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
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
                                fontSize: '24px',
                                fontWeight: 800,
                                color: '#0f172a',
                                marginBottom: '12px',
                                letterSpacing: '-0.02em'
                            }}>
                                Email Terkirim!
                            </h2>
                            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.65, maxWidth: '320px', margin: '0 auto 8px' }}>
                                Instruksi pemulihan telah dikirim ke
                            </p>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(0,49,120,0.06)',
                                border: '1px solid rgba(0,49,120,0.12)',
                                borderRadius: '10px',
                                padding: '8px 16px',
                                margin: '8px 0 24px'
                            }}>
                                <svg width="14" height="14" fill="none" stroke="#003178" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
                                </svg>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#003178', letterSpacing: '0.01em' }}>
                                    {email}
                                </span>
                            </div>

                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '28px', lineHeight: 1.6 }}>
                                Periksa folder <strong>Inbox</strong> atau <strong>Spam</strong> email Anda.<br/>Tautan berlaku selama <strong>60 menit</strong>.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                <button className="resend-btn" onClick={() => setIsSent(false)}>
                                    Tidak menerima email? Kirim ulang
                                </button>
                                <a href="/login" style={{
                                    fontSize: '11px', color: '#94a3b8', fontWeight: 600,
                                    letterSpacing: '0.06em', textDecoration: 'none',
                                    textTransform: 'uppercase', marginTop: '4px'
                                }}>
                                    Kembali ke halaman login
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}