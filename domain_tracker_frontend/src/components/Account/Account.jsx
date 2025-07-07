import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styles from "./styles/Account.module.css";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteUser, logoutUser } from "../../services/authService";

const Account = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user, old_password: "", new_password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateUser(formData);
      setMessage("Profil bilgileri başarıyla güncellendi.");
      setError("");
      setIsEditing(false);
    } catch (err) {
      setError("Profil güncellenemedi. Lütfen tekrar deneyin.");
      setMessage("");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      try {
        await deleteUser();
        logoutUser();
        navigate("/login");
      } catch (err) {
        setError("Hesap silinirken bir hata oluştu.");
        setMessage("");
      }
    }
  };

  return (
    <Paper elevation={3} className={styles.accountContainer}>
      <Box className={styles.profileHeader}>
        <Avatar
          alt={user.firstname}
          src={user.avatar_url || "/default-avatar.png"}
          className={styles.avatar}
        />
        <Box>
          <Typography variant="h6" className={styles.username}>
            {user.firstname} {user.lastname}
          </Typography>
        </Box>
      </Box>

      <Divider className={styles.divider} />

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2} className={styles.infoGrid}>
        {[ 
          { label: "Ad", key: "firstname" },
          { label: "Soyad", key: "lastname" },
          { label: "Email", key: "email" },
          { label: "Telefon", key: "phone_number" },
        ].map(({ label, key }) => (
          <React.Fragment key={key}>
            <Grid item xs={6}><strong>{label}:</strong></Grid>
            <Grid item xs={6}>
              {isEditing ? (
                <TextField
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                />
              ) : (
                formData[key] || "N/A"
              )}
            </Grid>
          </React.Fragment>
        ))}

        {/* Şifre Güncelleme Alanları */}
        {isEditing && (
          <>
            {/* Eski Şifre */}
            <Grid item xs={6}><strong>Eski Şifre:</strong></Grid>
            <Grid item xs={6}>
              <TextField
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                type={showOldPassword ? "text" : "password"}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        edge="end"
                        aria-label="toggle old password visibility"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Yeni Şifre */}
            <Grid item xs={6}><strong>Yeni Şifre:</strong></Grid>
            <Grid item xs={6}>
              <TextField
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                type={showNewPassword ? "text" : "password"}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        aria-label="toggle new password visibility"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Box className={styles.buttonGroup}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Hesabı Sil
        </Button>
        {isEditing ? (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleUpdate}
          >
            Kaydet
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Düzenle
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default Account;
