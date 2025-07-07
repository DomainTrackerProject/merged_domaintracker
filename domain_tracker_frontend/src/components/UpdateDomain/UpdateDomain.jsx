import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getDomainById, updateDomain } from "../../services/domainService";
import styles from "./UpdateDomain.module.css";

const statusOptions = ["Aktif", "Pasif", "Süresi Dolmuş"];

const UpdateDomain = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    domain_name: "",
    status: "",
    expiration_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const data = await getDomainById(id);
        setFormData(data);
      } catch (err) {
        console.error("Veri alınamadı", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDomain();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDomain(id, formData);
      setSnackbarOpen(true);
      setTimeout(() => navigate(`/domains/${id}`), 1500);
    } catch (err) {
      console.error("Güncelleme başarısız", err);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.wrapper}>
      <Paper elevation={4} className={styles.card}>
        <Typography variant="h5" gutterBottom>
          Domain Güncelle
        </Typography>
        {!loading && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Domain Adı"
                name="domain_name"
                value={formData.domain_name}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                select
                label="Durum"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Son Kullanma Tarihi"
                name="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />

              <Button type="submit" variant="contained" color="primary">
                Güncelle
              </Button>
            </Stack>
          </form>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Domain başarıyla güncellendi!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateDomain;
