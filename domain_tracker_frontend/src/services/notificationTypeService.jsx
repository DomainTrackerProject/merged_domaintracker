// src/api/notificationTypeApi.js
import apiClient from './api';

// Bildirim tiplerini listele
export const getNotificationTypes = async () => {
    return apiClient.request('get', '/notification_type/');
};

// Yeni bildirim tipi oluştur
export const createNotificationType = async (type_name, description = '') => {
    return apiClient.request('post', '/notification_type/', {
        type_name: type_name,
        description
    });
};

// Belirli bir bildirimi getir
export const getNotificationTypeById = async (typeId) => {
    return apiClient.request('get', `/notification_type/${typeId}`);
};

// Bildirim tipini güncelle
export const updateNotificationType = async (typeId, typeName, description = '') => {
    return apiClient.request('put', `/notification_type/${typeId}`, {
        type_name: typeName,
        description
    });
};

// Bildirim tipini sil
export const deleteNotificationType = async (typeId) => {
    return apiClient.request('delete', `/notification_type/${typeId}`);
};
