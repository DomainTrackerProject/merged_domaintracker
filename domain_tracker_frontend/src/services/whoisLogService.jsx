import apiClient from './api';

// Get all WHOIS logs
export const getWhoisLogs = async () => {
    return apiClient.request('get', '/whois_log/');
};

// Get a specific WHOIS log by ID
export const getWhoisLogById = async (logId) => {
    return apiClient.request('get', `/whois_log/${logId}`);
};

