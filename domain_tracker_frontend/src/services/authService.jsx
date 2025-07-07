import apiClient from "./api";

// 📌 Giriş Yap
export const loginUser = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    return apiClient.request("post", "auth/token", formData, {
        "Content-Type": "application/x-www-form-urlencoded",
    });
};

// 📌 Kayıt Ol
export const registerUser = async (userData) => {
    return apiClient.request("post", "/auth", userData);
};

// 📌 Çıkış Yap
export const logoutUser = () => {
    localStorage.removeItem("token");
};

// 📌 Şifre Sıfırlama Maili Gönder
export const forgotPassword = async (email) => {
    return apiClient.request("post", "/auth/forgot-password", { email });
};

// 📌 Şifre Sıfırla
export const resetPassword = async (reset_code, new_password) => {
    return apiClient.request("post", "/auth/reset-password", { reset_code, new_password });
};

// 📌 Giriş Yapan Kullanıcının Bilgilerini Getir
export const getCurrentUser = async () => {
    return apiClient.request("get", "/auth/me");
};

// 📌 Kullanıcı Bilgilerini Güncelle
export const updateUser = async (updateData) => {
    return apiClient.request("put", "/auth/update", updateData);
};

// 📌 Kullanıcıyı Sil
export const deleteUser = async () => {
    return apiClient.request("delete", "/auth/delete");
};

// 📌 2FA Aç/Kapat
export const toggleTwoFactor = async () => {
    return apiClient.request("post", "/auth/2fa/toggle");
};
  
// 📌 2FA Durumunu Al
export const getTwoFactorStatus = async () => {
    return apiClient.request("get", "/auth/2fa/status");
};
  