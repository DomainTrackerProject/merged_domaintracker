import React, { useState, useMemo } from 'react';
import {
  List,
  Typography,
  TextField,
  Chip,
  Button,
} from '@mui/material';
import NotificationItem from '../NotificationItem/NotificationItem';
import styles from './styles/NotificationList.module.css';

const NotificationList = ({ notifications, onDelete }) => {
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredAndSortedNotifications = useMemo(() => {
    const filtered = notifications.filter((notification) => {
      const combinedText = `
        ${notification.type_name}
        ${notification.domain_name}
        ${new Date(notification.created_at).toLocaleDateString()}
      `.toLowerCase();
      return combinedText.includes(searchText.toLowerCase());
    });

    const sorted = [...filtered].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(fieldA) - new Date(fieldB)
          : new Date(fieldB) - new Date(fieldA);
      } else {
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
    });

    return sorted;
  }, [notifications, searchText, sortField, sortDirection]);

  return (
    <div className={styles.wrapper}>
      <TextField
        label="Ara (tip, domain, tarih)"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={styles.filterInput}
        margin="normal"
      />

      <div className={styles.sortControls}>
        <div className={styles.sortTags}>
          {['created_at', 'type_name', 'domain_name'].map((field) => (
            <Chip
              key={field}
              label={
                field === 'created_at'
                  ? 'Tarih'
                  : field === 'type_name'
                  ? 'Tip'
                  : 'Domain'
              }
              variant={sortField === field ? 'filled' : 'outlined'}
              color={sortField === field ? 'primary' : 'default'}
              onClick={() => setSortField(field)}
              clickable
            />
          ))}
        </div>

        <Button
          variant="outlined"
          onClick={() =>
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
        >
          {sortDirection === 'asc' ? '⬆️ Artan' : '⬇️ Azalan'}
        </Button>
      </div>

      {filteredAndSortedNotifications.length === 0 ? (
        <Typography>Hiç bildirim bulunamadı.</Typography>
      ) : (
        <List className={styles.list}>
          {filteredAndSortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
              onDelete={onDelete}
            />
          ))}
        </List>
      )}
    </div>
  );
};

export default NotificationList;
