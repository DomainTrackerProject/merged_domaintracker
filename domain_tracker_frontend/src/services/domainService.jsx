import apiClient from './api';

// Tüm domainleri getir
export const getDomains = async () => {
    return apiClient.request('get', '/domain/');
};

// Belirli bir domain'i ID ile getir
export const getDomainById = async (domainId) => {
    return apiClient.request('get', `/domain/${domainId}`);
};

// Yeni domain oluştur
export const createDomain = async (domainData) => {
    return apiClient.request('post', '/domain/', domainData);
};

// Domain bilgilerini güncelle
export const updateDomain = async (domainId, domainData) => {
    return apiClient.request('put', `/domain/${domainId}`, domainData);
};

// Domain sil
export const deleteDomain = async (domainId) => {
    return apiClient.request('delete', `/domain/${domainId}`);
};

// Domain'e ait WHOIS bilgilerini yenile
export const refreshDomainWhois = async (domainId) => {
    return apiClient.request('put', `/domain/${domainId}/refresh`);
};
