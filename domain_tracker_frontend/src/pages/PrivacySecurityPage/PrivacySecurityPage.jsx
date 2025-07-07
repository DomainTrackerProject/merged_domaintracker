import React, { useState,useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Box
} from "@mui/material";
import { deleteUser, logoutUser,getTwoFactorStatus,toggleTwoFactor } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import styles from "./styles/PrivacySecurityPage.module.css";

const PrivacySecurityPage = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await getTwoFactorStatus();
        setTwoFactorEnabled(response.two_factor_enabled);
      } catch (err) {
        setError("2FA durumu alınamadı.");
      }
    };
    fetch2FAStatus();
  }, []);
  
  const handleToggle2FA = async () => {
    try {
      const res = await toggleTwoFactor();
      setTwoFactorEnabled(prev => !prev);
      setMessage(res.message);
    } catch (err) {
      setError("2FA güncellenemedi.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      try {
        await deleteUser();
        logoutUser();
        navigate("/login");
      } catch (err) {
        setError("Hesap silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Gizlilik ve Güvenlik
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Paper className={styles.card}>
        <Typography variant="h6" gutterBottom>İki Faktörlü Doğrulama</Typography>
        <FormControlLabel
          control={<Switch checked={twoFactorEnabled} onChange={handleToggle2FA} />}
          label={twoFactorEnabled ? "Aktif" : "Pasif"}
        />
        <Typography variant="body2" color="textSecondary">
          Giriş yaparken ek güvenlik sağlar.
        </Typography>
      </Paper>

      <Divider className={styles.divider} />

      <Paper className={styles.card} style={{ border: "1px solid #f44336" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Hesabı Kalıcı Olarak Sil
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Bu işlem geri alınamaz. Tüm verileriniz silinecek.
        </Typography>
        <Box mt={2}>
          <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
            Hesabı Sil
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacySecurityPage;
