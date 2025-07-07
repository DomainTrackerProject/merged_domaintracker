import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../services/authService";
import LoginForm from "../../components/LoginForm/LoginForm";
import styles from "./styles/LoginPage.module.css";
import { FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (formData) => {
    if (!formData.username || !formData.password) {
      setError("Kullanıcı adı ve şifre gereklidir!");
      return;
    }

    try {
      const response = await loginUser(formData.username, formData.password,formData.remember_me);
      setAuth({ user: formData.username, token: response.access_token });
      localStorage.setItem("token", response.access_token);
      navigate("/dashboard");
    } catch (error) {
      setError("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className={styles.loginMain}>
      <div className={styles.loginContainer}>
        <div className={styles.titleContainer}>
          <FaSignInAlt className={styles.icon} />
          <h2>Giriş Yap</h2>
        </div>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
};

export default LoginPage;