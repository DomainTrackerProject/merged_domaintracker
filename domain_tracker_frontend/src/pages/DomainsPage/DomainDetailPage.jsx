import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDomainById, deleteDomain } from "../../services/domainService";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./styles/DomainDetailPage.module.css";
import DomainIcon from "@mui/icons-material/Language";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";

const DomainDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const data = await getDomainById(id);
        console.log("Domain verisi:", data)
        setDomain(data);
      } catch (error) {
        console.error("Detaylar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomain();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteDomain(id);
      setSnackbarOpen(true);
      setTimeout(() => navigate("/domains"), 1500);
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "success";
      case "Pasif":
        return "warning";
      case "Süresi Dolmuş":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Navbar />
     
      <Container maxWidth="md" className={styles.pageContainer}>
           
        {loading ? (
          <CircularProgress />
        ) : !domain ? (
          <Typography variant="h6">Domain bulunamadı.</Typography>
        ) : (
          <Paper elevation={4} className={styles.card}>
           
            <Stack spacing={3}>
           
              <Box display="flex" alignItems="center" gap={2}>
                <DomainIcon color="primary" fontSize="large" />
                <Typography variant="h4">{domain.domain_name}</Typography>
              </Box>

              <Divider />

              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="action" />
                <Typography variant="body1">Durum:</Typography>
                <Chip
                  label={domain.status}
                  color={getStatusColor(domain.status)}
                  variant="outlined"
                  className={styles.chip}
                />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="action" />
                <Typography variant="body1">Kayıt Firması: {domain.registrar || "Bilinmiyor"}</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <EventIcon color="action" />
                <Typography variant="body1">Kayıt Tarihi: {domain.creation_date || "Bilinmiyor"}</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="action" />
                <Typography variant="body1">Name Serverlar:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {Array.isArray(domain.name_servers) ? domain.name_servers.join(", ") : "Yok"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="action" />
                <Typography variant="body1">Son WHOIS Kontrolü: {domain.last_whois_check || "Yok"}</Typography>
              </Box>


              <Box display="flex" alignItems="center" gap={1}>
                <EventIcon color="action" />
                <Typography variant="body1">
                  Son Kullanma Tarihi: {domain.expiration_date}
                </Typography>
              </Box>

              <Divider />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/domains/${id}/edit`)}
              >
                Güncelle
              </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setConfirmOpen(true)}
                >
                  Sil
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  onClick={() =>navigate(`/domains/${id}/domain-notification-settings`)}
                >
                  Bildirim Ayarları
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Container>

      {/* Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Bu domain silinsin mi?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Vazgeç</Button>
          <Button color="error" onClick={handleDelete}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Domain başarıyla silindi!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DomainDetailPage;
