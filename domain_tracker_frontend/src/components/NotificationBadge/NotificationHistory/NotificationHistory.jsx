import React from "react";
import { List, ListItem, ListItemText, Chip } from "@mui/material";
import styles from "./styles/NotificationHistory.module.css";

// Örnek veriler
const notifications = [
  { id: 1, domain: "example.com", date: "2024-03-20", status: "Gönderildi" },
  { id: 2, domain: "testdomain.net", date: "2024-03-19", status: "Beklemede" }
];

const NotificationHistory = () => {
  return (
    <div className={styles.container}>
      <h3>Bildirim Geçmişi</h3>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.id}>
            <ListItemText primary={notification.domain} secondary={`Tarih: ${notification.date}`} />
            <Chip label={notification.status} color={notification.status === "Gönderildi" ? "success" : "warning"} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NotificationHistory;
