import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";
import NotificationForm from "../../components/NotificationBadge/NotificationForm/NotificationForm";
import { createNotification } from "../../services/notificationService";
import { getDomains } from "../../services/domainService";
import { getNotificationTypes } from "../../services/notificationTypeService";
import Navbar from "../../components/Navbar/Navbar";

const CreateNotificationPage = () => {
  const [domains, setDomains] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [domainsData, typesData] = await Promise.all([
          getDomains(),
          getNotificationTypes(),  // <== burada veri geliyor mu?
        ]);
        setDomains(domainsData);
        setNotificationTypes(typesData); // <== burada konsola bastır
        console.log("Notification Types:", typesData);
      } catch (error) {
        setErrorMessage("Veriler alınırken hata oluştu.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateNotification = async (formData) => {
    try {
      console.log("Form Data Before API Call:", formData); // Gönderilen veriyi kontrol et
  
      const response = await createNotification(
        parseInt(formData.domain_id),
        parseInt(formData.type_id),
        formData.message_body
      );
  
      console.log("API Response:", response); // API yanıtını kontrol et
  
      if (response && response.message) {
        let successMessage = response.message;
  
        // Manually translate the success message if needed
        if (successMessage === "Notification created and email sent") {
          successMessage = "Bildirim başarıyla oluşturuldu ve e-posta gönderildi.";
        }
  
        setSuccessMessage(successMessage);
      } else {
        setErrorMessage("Bildirim oluşturulamadı.");
      }
  
    } catch (err) {
      console.error("Error in Notification Creation:", err);
      setErrorMessage(`Bildirim oluşturulamadı: ${err.response ? err.response.data.message : err.message}`);
    }
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <NotificationForm
          domains={domains}
          notificationTypes={notificationTypes}
          onSubmit={handleCreateNotification}
        />
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      </Container>
    </>
  );
};

export default CreateNotificationPage;
