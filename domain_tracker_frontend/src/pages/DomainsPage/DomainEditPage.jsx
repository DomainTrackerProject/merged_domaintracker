import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDomainById, updateDomain } from "../../services/domainService";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./styles/DomainEditPage.module.css";

const DomainEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState({
    domain_name: "",
    expiration_date: "",
    status: ""
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const data = await getDomainById(id);
        setDomain(data);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };
    fetchDomain();
  }, [id]);

  const handleChange = (e) => {
    setDomain({ ...domain, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateDomain(id, domain);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Güncelleme başarısız:", err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate(`/domains/${id}`);
  };

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="sm" className={styles.formBox}>
        <Navbar />
        <Typography variant="h5" gutterBottom>
          Domain Güncelle
        </Typography>
        <Stack spacing={2}>
          <TextField
            name="domain_name"
            label="Domain Adı"
            value={domain.domain_name}
            onChange={handleChange}
          />
          <TextField
            name="expiration_date"
            label="Son Kullanma Tarihi"
            type="date"
            value={domain.expiration_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="status"
            label="Durum"
            value={domain.status}
            onChange={handleChange}
          />
          <Button variant="contained" onClick={handleUpdate}>
            Kaydet
          </Button>
        </Stack>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            Domain başarıyla güncellendi!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DomainEditPage;
