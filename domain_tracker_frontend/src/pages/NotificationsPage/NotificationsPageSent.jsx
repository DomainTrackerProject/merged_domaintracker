import React, { useEffect, useState } from 'react';
import { getSentNotifications } from '../../services/notificationService';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

const NotificationsPageSent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getSentNotifications().then((res) => setNotifications(res.data));
  }, []);

  return (
    <Paper style={{ padding: '1rem', marginTop: '5rem' }}>
      <h2>Gönderilen Bildirimler</h2>
      <List>
        {notifications.map((notif) => (
          <ListItem key={notif.notification_id}>
            <ListItemText
              primary={`${notif.domain.domain_name} - ${notif.notification_type.type_name}`}
              secondary={`Mesaj: ${notif.message_body}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationsPageSent;
