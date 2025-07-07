import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper, IconButton,
  InputAdornment } from "@mui/material";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaUser, FaEnvelope, FaPhone, FaUserTag } from "react-icons/fa";
import styles from "./styles/RegisterForm.module.css"; // CSS Modülü Bağlantısı

const RegisterForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false); // ⭐ Eklendi
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ⭐ Eklendi


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.formBox}>
        <Typography variant="h5" fontWeight="bold" className={styles.title}>
          Kayıt Ol
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" className={styles.subtitle}>
          Hesap oluşturun
        </Typography>

        {error && <Typography color="error" className={styles.errorMessage}>{error}</Typography>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Ad */}
          <TextField
            fullWidth
            label="Adınız"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser />
                </InputAdornment>
              ),
            }}
          />

          {/* Soyad */}
          <TextField
            fullWidth
            label="Soyadınız"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser />
                </InputAdornment>
              ),
            }}
          />

          {/* Kullanıcı Adı */}
          <TextField
            fullWidth
            label="Kullanıcı Adı"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUserTag />
                </InputAdornment>
              ),
            }}
          />

          {/* E-posta */}
          <TextField
            fullWidth
            type="email"
            label="E-posta"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaEnvelope />
                </InputAdornment>
              ),
            }}
          />

          {/* Telefon Numarası */}
          <TextField
            fullWidth
            label="Telefon Numarası"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaPhone />
                </InputAdornment>
              ),
            }}
          />

          {/* Şifre */}
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Şifre"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
                
              ),
            }}
          />

          {/* Şifre Tekrar */}
          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Şifre Tekrar"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Kayıt Ol Butonu */}
          <Button type="submit" variant="contained" color="primary" className={styles.registerButton}>
            Kayıt Ol
          </Button>

          {/* Giriş Yap Linki */}
          <Typography variant="body2" className={styles.registerBottomP}>
            Zaten bir hesabın var mı? <Link to="/">Giriş Yap</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
