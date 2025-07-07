import apiClient from './api';

// Bildirim günü oluştur
export const createNotificationDay = async (notificationId, notifyDay) => {
    return apiClient.request('post', '/notification_day/', {
      notification_id: notificationId,
      notify_day: notifyDay
    });
  };
  

// Tüm bildirim günlerini getir
export const getNotificationDays = async () => {
    return apiClient.request('get', '/notification_day/');
};

// Belirli bir bildirim gününü getir
export const getNotificationDayById = async (dayId) => {
    return apiClient.request('get', `/notification_day/${dayId}`);
};

// Bildirim gününü güncelle
export const updateNotificationDay = async (dayId,notificationId , notifyDay) => {
    return apiClient.request('put', `/notification_day/${dayId}`, {
        notification_id: notificationId,
        notify_day: notifyDay
    });
};

// Bildirim gününü sil
export const deleteNotificationDay = async (dayId) => {
    return apiClient.request('delete', `/notification_day/${dayId}`);
};
