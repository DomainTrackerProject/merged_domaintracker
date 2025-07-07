import React, { useState, useEffect } from "react";
import {useNavigate} from"react-router-dom";
import { Container, Typography, Grid, Button } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import AddDomainModal from "./AddDomainModal";
import DomainList from "../../components/Table/DomainList/DomainList";
import { getDomains } from "../../services/domainService";
import styles from "./styles/DomainPage.module.css";

const DomainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await getDomains();
        console.log(response);
        setDomains(response);

      } catch (error) {
        console.error("Domain verileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const handleSendNotification = (event) => {
    navigate(`/createNotification`);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          {/* Sayfa Başlığı */}
          <Grid item xs={12}>
            <Typography variant="h4" className={styles.pageTitle}>
            Domain Yönetimi
            </Typography>
          </Grid>

          {/* Yeni Domain Ekleme Butonu */}
          <Grid container  direction="column" spacing={2} className={styles.verticalButtons}>
            <Grid item xs={12}>
              <Button
                className={styles.actionButton}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setIsModalOpen(true)}
              >
                Yeni Domain Ekle
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={styles.actionButton}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSendNotification}
              >
                Bildirim Ayarla
              </Button>
            </Grid>
          </Grid>


          {/* Domain Listesi */}
          <Grid item xs={12}>
            {loading ? (
              <Typography>Yükleniyor...</Typography>
            ) : (
              <DomainList domains={domains} />
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Modal Bileşeni */}
      <AddDomainModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DomainPage;
