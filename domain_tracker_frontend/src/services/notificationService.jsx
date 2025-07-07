import apiClient from './api';

// Create a new notification and send email
export const createNotification = async (domainId, typeId, messageBody) => {
    return apiClient.request('post', '/notification/', {
        domain_id: domainId,
        type_id: typeId,
        message_body: messageBody
    });
};

export const getSentNotifications = async () => {
    return apiClient.request('get', '/notification/sent');
  };
  

// Get all notifications
export const getNotifications = async () => {
    return apiClient.request('get', '/notification/');
};

// Get a specific notification by ID
export const getNotificationById = async (notificationId) => {
    return apiClient.request('get', `/notification/${notificationId}`);
};

// Update a notification
export const updateNotification = async (notificationId, domainId, typeId, messageBody) => {
    return apiClient.request('put', `/notification/${notificationId}`, {
        domain_id: domainId,
        type_id: typeId,
        message_body: messageBody
    });
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
    return apiClient.request('delete', `/notification/${notificationId}`);
};
