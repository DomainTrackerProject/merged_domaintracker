import apiClient from './api';

// Create a new domain notification setting
export const createDomainNotificationSetting = async (domainId, typeId) => {
    return apiClient.request('post', '/domain_notification_setting/', {
        domain_id: domainId,
        type_id: typeId
    });
};

// Get all domain notification settings
export const getDomainNotificationSettings = async () => {
    return apiClient.request('get', '/domain_notification_setting/');
};

// Get a single domain notification setting by ID
export const getDomainNotificationSettingById = async (settingId) => {
    return apiClient.request('get', `/domain_notification_setting/${settingId}`);
};

// Update a domain notification setting
export const updateDomainNotificationSetting = async (settingId, domainId, typeId) => {
    return apiClient.request('put', `/domain_notification_setting/${settingId}`, {
        domain_id: domainId,
        type_id: typeId
    });
};

// Delete a domain notification setting
export const deleteDomainNotificationSetting = async (settingId) => {
    return apiClient.request('delete', `/domain_notification_setting/${settingId}`);
};