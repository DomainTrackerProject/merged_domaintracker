import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/notification/${notification.notification_id}`);
  };

  return (
    <ListItem
      divider
      button
      onClick={handleClick}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation(); // Delete'e tıklanırsa navigasyonu engelle
            onDelete(notification.notification_id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText
        primary={notification.message_body}
        secondary={`${notification.type_name} | ${notification.domain_name} | ${new Date(notification.created_at).toLocaleString()}`}
      />
    </ListItem>
  );
};

export default NotificationItem;
