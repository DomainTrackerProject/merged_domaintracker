import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./styles/LoginForm.module.css";

const LoginForm = ({ onSubmit, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, remember_me: rememberMe }); 
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formBox}>
        <Typography variant="h5" className={styles.title}>
          Giriş Yap
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Hesabınıza giriş yapın
        </Typography>

        {error && <Typography className={styles.errorMessage}>{error}</Typography>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            fullWidth
            label="Kullanıcı Adı"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Şifre"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
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

          <Box className={styles.rememberForgotContainer}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Beni Hatırla"
            />
            <Link to="/reset-password" className={styles.link}>
              <Typography variant="body2">Şifremi Unuttum</Typography>
            </Link>
            
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            Giriş Yap
          </Button>

          <Typography variant="body2" className={styles.registerText}>
            Hesabınız yok mu?{" "}
            <Link to="/register" className={styles.link}>
              <strong>Kayıt Ol</strong>
            </Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;
