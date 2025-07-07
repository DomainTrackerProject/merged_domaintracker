import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import styles from './styles/NotificationForm.module.css';

 
const NotificationForm = ({ domains, notificationTypes, onSubmit }) => {
  const [formData, setFormData] = useState({
    domain_id: '',
    type_id: '',
    message_body: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    setTimeout(() => {
      if (!formData.message_body.trim()) {
        setError('Mesaj boş olamaz.');
      } else {
        setMessage(null);
        onSubmit(formData); 
        setFormData({
          domain_id: '',
          type_id: '',
          message_body: '',
        });
      }
    }, 500);
  };

  return (
    <Paper elevation={3} className={styles.container}>
      <Typography variant="h5" align="center" gutterBottom>
        Bildirim Oluştur
      </Typography>

      {message && <Alert severity="success" className={styles.alert}>{message}</Alert>}
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          select
          fullWidth
          label="Domain Seç"
          name="domain_id"
          value={formData.domain_id}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="">-- Domain Seçin --</MenuItem>
          {domains.map((domain) => (
            <MenuItem key={domain.domain_id} value={domain.domain_id}>
              {domain.domain_name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Bildirim Türü"
          name="type_id"
          value={formData.type_id}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="">-- Tür Seçin --</MenuItem>
          {notificationTypes.map((type) => (
            <MenuItem  key={type.type_id} value={type.type_id}>
              {type.type_name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Mesaj"
          name="message_body"
          value={formData.message_body}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="Bildirim mesajınızı buraya yazın..."
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          className={styles.submitButton}
        >
          Gönder
        </Button>
      </form>
    </Paper>
  );
};

export default NotificationForm;
