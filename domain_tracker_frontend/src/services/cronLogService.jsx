// src/api/cronLogApi.js
import apiClient from './api';

// Tüm cron loglarını getir
export const getCronLogs = async () => {
    return apiClient.request('get', '/cron_logs/');
};

// Belirli bir cron logunu getir
export const getCronLogById = async (logId) => {
    return apiClient.request('get', `/cron_logs/${logId}`);
};


// Cron log sil
export const deleteCronLog = async (logId) => {
    return apiClient.request('delete', `/cron_logs/${logId}`);
};
