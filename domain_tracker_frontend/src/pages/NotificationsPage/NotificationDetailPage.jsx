import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar
} from '@mui/material';
import { getNotificationById, updateNotification } from '../../services/notificationService';
import { getDomains } from '../../services/domainService';
import { getNotificationTypes } from '../../services/notificationTypeService';
import { createNotificationDay } from '../../services/notificationDayService';
import Navbar from '../../components/Navbar/Navbar';
import styles from './styles/NotificationDetailPage.module.css';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);

  const [domainId, setDomainId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [notifyDay, setNotifyDay] = useState('');

  const [domainOptions, setDomainOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    width: { xs: '90%', sm: 400 },
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNotifyModalOpen = () => setNotifyModalOpen(true);
  const handleNotifyModalClose = () => setNotifyModalOpen(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [notif, domains, types] = await Promise.all([
          getNotificationById(id),
          getDomains(),
          getNotificationTypes()
        ]);
        setNotification(notif);
        setDomainId(notif.domain_id);
        setTypeId(notif.type_id);
        setMessageBody(notif.message_body);
        setDomainOptions(domains);
        setTypeOptions(types);
      } catch (err) {
        setError('Veriler alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateNotification(id, parseInt(domainId), parseInt(typeId), messageBody);
      const updated = await getNotificationById(id);
      setNotification(updated);
      setSnackbarMessage("Bildirim güncellendi.");
      setSnackbarOpen(true);
      handleClose();
    } catch (err) {
      setError('Güncelleme sırasında hata oluştu.');
    }
  };

  const handleNotifyDaySubmit = async () => {
    try {
      await createNotificationDay(parseInt(id), parseInt(notifyDay));
      setSnackbarMessage("Bildirim gönderim günü ayarlandı.");
      setSnackbarOpen(true);
      handleNotifyModalClose();
    } catch (err) {
      setError("Bildirim günü ayarlanırken hata oluştu.");
    }
  };

  return (
    <>
      <Navbar />
      <Container className={styles.container}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Card className={styles.card}>
            <CardContent>
              <Typography className={styles.title}>Bildirim Detayları</Typography>
              <Typography className={styles.field}><strong>ID:</strong> {notification.notification_id}</Typography>
              <Typography className={styles.field}><strong>Domain:</strong> {notification.domain_name}</Typography>
              <Typography className={styles.field}><strong>Tip:</strong> {notification.type_name}</Typography>
              <Typography className={styles.field}><strong>Durum:</strong> {notification.status}</Typography>
              <Typography className={styles.field}><strong>Mesaj:</strong> {notification.message_body}</Typography>
              <Typography className={styles.field}><strong>Tarih:</strong> {new Date(notification.created_at).toLocaleString()}</Typography>

              <div className={styles.buttonGroup}>
                <Button
                  variant="contained"
                  onClick={handleNotifyModalOpen}
                  className={styles.actionButton}
                >
                  Bildirim Günü Belirle
                </Button>

                <Button
                  variant="contained"
                  onClick={handleOpen}
                  className={styles.updateButton}
                >
                  Güncelle
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate(`/notifications/${id}/days`)}
                  className={styles.actionButton}
                >
                  Bildirim Tarihleri
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Güncelle Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Bildirim Güncelle
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Domain</InputLabel>
            <Select
              value={domainId}
              label="Domain"
              onChange={(e) => setDomainId(e.target.value)}
            >
              {domainOptions.map((domain) => (
                <MenuItem key={domain.domain_id} value={domain.domain_id}>
                  {domain.domain_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Bildirim Türü</InputLabel>
            <Select
              value={typeId}
              label="Tip"
              onChange={(e) => setTypeId(e.target.value)}
            >
              {typeOptions.map((type) => (
                <MenuItem key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Mesaj"
            multiline
            rows={4}
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdate}
            sx={{
              mt: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#155fa0' }
            }}
          >
            Kaydet
          </Button>
        </Box>
      </Modal>

      {/* Bildirim Günü Modal */}
      <Modal open={notifyModalOpen} onClose={handleNotifyModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Bildirim Gönderim Günü Ayarla
          </Typography>

          <TextField
            fullWidth
            label="Kaç gün önceden bildirilsin?"
            type="number"
            value={notifyDay}
            onChange={(e) => setNotifyDay(e.target.value)}
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleNotifyDaySubmit}
            sx={{
              mt: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#155fa0' }
            }}
          >
            Kaydet
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default NotificationDetailPage;
