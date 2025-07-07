import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../services/authService";
import styles from "./styles/ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (step === 2) {
            setResetCode("");
            setNewPassword("");
        }
    }, [step]);

    const handlePasswordResetRequest = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await forgotPassword(email);
            setMessage(response.message || "Şifre sıfırlama kodu gönderildi.");
            setStep(2);
        } catch (err) {
            if (err.response?.status === 429) {
                setMessage("Çok fazla istek yapıldı. Lütfen biraz bekleyin.");
                setStep(2);
            } else {
                setError(err.response?.data?.detail || "Şifre sıfırlama isteği başarısız oldu.");
            }
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await resetPassword(resetCode, newPassword);
            setMessage(response?.message || "Şifreniz başarıyla değiştirildi.");
            
            setTimeout(() => {
                navigate("/"); 
            }, 2000);

            setStep(1);
            setEmail(""); 
        } catch (err) {
            if (err.response?.status === 429) {
                setMessage("Çok fazla istek yapıldı. Lütfen biraz bekleyin.");
            } else {
                setError(err.response?.data?.detail || "Şifre sıfırlama işlemi başarısız oldu.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2>Şifre Sıfırlama</h2>

            {message && <p className={styles.success}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}

            {step === 1 && (
                <form onSubmit={handlePasswordResetRequest} autoComplete="off">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        autoComplete="off"
                    />
                    <button type="submit">Şifre Sıfırlama Kodu Gönder</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleResetPassword} autoComplete="off">
                    <label>Sıfırlama Kodu:</label>
                    <input 
                        type="text" 
                        value={resetCode} 
                        onChange={(e) => setResetCode(e.target.value)} 
                        required 
                        autoComplete="one-time-code"
                    />

                    <label>Yeni Şifre:</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        autoComplete="new-password"
                    />

                    <button type="submit">Şifreyi Güncelle</button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;
