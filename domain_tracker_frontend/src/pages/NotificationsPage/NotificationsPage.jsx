import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Container, Typography } from '@mui/material';
import { getNotifications, deleteNotification } from '../../services/notificationService';
import NotificationList from '../../components/NotificationBadge/NotificationList/NotificationList';
import Navbar from '../../components/Navbar/Navbar';
import styles from './styles/NotificationsPage.module.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Bildirimleri getir
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        console.log('Notification:', data);
        setNotifications(data); // API'den gelen veriyi state'e set et
      } catch (err) {
        setError('Bildirimler yüklenirken hata oluştu');
      }
    };

    fetchNotifications();
  }, []);

  // Silme işlemi
  const handleDelete = async (notificationId) => {
    try {
      // API'yi çağırarak bildirimi sil
      await deleteNotification(notificationId);
      // State'den silinen bildirimi çıkar
      setNotifications((prev) =>
        prev.filter((notif) => notif.notification_id !== notificationId) // notification_id'yi kontrol et
      );
    } catch (err) {
      setError('Silme işlemi başarısız oldu');
    }
  };

  return (
    <>
      <Navbar />
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.title} gutterBottom>
          Bildirimler
        </Typography>

        {/* NotificationList bileşenine notifications ve onDelete propslarını ilet */}
        <NotificationList
          notifications={notifications}
          onDelete={handleDelete}
        />

        {/* Hata mesajlarını göstermek için Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default NotificationPage;
