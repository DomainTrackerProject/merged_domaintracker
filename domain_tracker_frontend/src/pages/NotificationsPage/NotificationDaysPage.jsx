import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  getNotificationDays,
  deleteNotificationDay,
  updateNotificationDay
} from '../../services/notificationDayService';
import Navbar from '../../components/Navbar/Navbar';
import styles from './styles/NotificationDaysPage.module.css';

const NotificationDaysPage = () => {
  const { id } = useParams(); // notification id from URL
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDayId, setEditDayId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchDays = async () => {
    try {
      const allDays = await getNotificationDays();
      const filteredDays = allDays.filter(day => day.notification_id === parseInt(id));
      setDays(filteredDays);
    } catch (err) {
      setError('Bildirim günleri alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, [id]);

  const handleDelete = async (dayId) => {
    await deleteNotificationDay(dayId);
    fetchDays();
  };

  const handleEdit = (dayId, currentValue) => {
    setEditDayId(dayId);
    setEditValue(currentValue);
  };

  const handleSave = async (dayId) => {
    try {
      const day = days.find(d => d.day_id === dayId);
      if (!day) throw new Error("Day not found");

      await updateNotificationDay(dayId, day.notification_id, parseInt(editValue));
      setEditDayId(null);
      setEditValue('');
      fetchDays();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <>
      <Navbar />
      <Container className={styles.container}>
        <Typography variant="h5" gutterBottom className={styles.title}>
          Bildirim Gönderim Günleri
        </Typography>

        {loading ? (
          <div className={styles.loadingSpinner}>
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : days.length === 0 ? (
          <Typography className={styles.emptyText}>Henüz gün ayarlanmamış.</Typography>
        ) : (
          <Card className={styles.card}>
            <CardContent>
              <List>
                {days.map(day => (
                  <ListItem key={day.day_id} className={styles.listItem} divider>
                    {editDayId === day.day_id ? (
                      <>
                        <TextField
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          size="small"
                          style={{ marginRight: '1rem' }}
                        />
                        <IconButton onClick={() => handleSave(day.day_id)} color="primary">
                          <SaveIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <ListItemText
                          primary={`Son kullanım tarihinden ${day.notify_day} gün önce gönderilecek`}
                          secondary={`Bildirim ID: ${day.notification_id}`}
                        />
                        <IconButton onClick={() => handleEdit(day.day_id, day.notify_day)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(day.day_id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default NotificationDaysPage;
