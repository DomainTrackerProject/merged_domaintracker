import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService"; 
import RegisterForm from "../../components/RegisterForm/RegisterForm.jsx";
import styles from "./styles/RegisterPage.module.css";
import { FaGlobe } from "react-icons/fa";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (formData) => {
    setError(""); 

    if (
      !formData.firstname || 
      !formData.lastname || 
      !formData.username || 
      !formData.email || 
      !formData.phone_number || 
      !formData.password || 
      !formData.confirmPassword
    ) {
      setError("Tüm alanları doldurmanız gereklidir!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler uyuşmuyor!");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Register Response:", response);

      if (response?.user_id) {
        navigate("/");
      } else {
        console.log("Server Error Response:", response);
        setError(response?.message || "Kayıt başarısız! Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      console.log("Error Response Data:", err.response);
      setError(err.response?.data?.message || "Sunucu hatası! Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <div className={styles.registerMain}>
      <div className={styles.registerContainer}>
        <RegisterForm onSubmit={handleRegister} error={error} />
      </div>
    </div>
  );
};

export default RegisterPage;
