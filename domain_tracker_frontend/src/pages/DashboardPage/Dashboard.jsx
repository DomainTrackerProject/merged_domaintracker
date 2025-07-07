import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import DomainList from "../../components/Table/DomainList/DomainList";
import { getDomains } from "../../services/domainService";
import { getSentNotifications } from "../../services/notificationService"; // Bildirim servisini ekle
import styles from "./styles/Dashboard.module.css";
import WhoisLogPage from "../WhoisLogPage/WhoisLogPage";

const Dashboard = () => {
  const [allDomains, setAllDomains] = useState([]);
  const [latestDomains, setLatestDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentNotificationsCount, setSentNotificationsCount] = useState(0); // Yeni state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Domainleri getir
        const domainsResponse = await getDomains();
        setAllDomains(domainsResponse);

        // Tarihe göre sırala ve son 3 domaini al
        const sortedLatest = domainsResponse
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setLatestDomains(sortedLatest);

        // Gönderilen bildirim sayısını getir
        const notificationsResponse = await getSentNotifications();
        setSentNotificationsCount(notificationsResponse.length); // Bildirim sayısını al
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Dashboard Başlık */}
          <Grid item xs={12}>
            <Typography variant="h4" className={styles.pageTitle}>
              Dashboard
            </Typography>
          </Grid>

          {/* Genel Bilgiler Kartları */}
          <Grid item xs={12} sm={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6">Toplam Domain</Typography>
                <Typography variant="h4">{allDomains.length}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6">Aktif Domainler</Typography>
                <Typography variant="h4">
                  {allDomains.filter((d) => d.status === "Aktif").length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6">Pasif Domainler</Typography>
                <Typography variant="h4">
                  {allDomains.filter((d) => d.status !== "Aktif").length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            {/* Gönderilen Bildirimler Kartı */}
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6">Gönderilen Bildirimler</Typography>
                <Typography variant="h4">{sentNotificationsCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* En Son Eklenen Domainler */}
          <Grid item xs={12}>
            <Typography variant="h6">Son Eklenen Domainler</Typography>
            {loading ? (
              <Typography>Yükleniyor...</Typography>
            ) : latestDomains.length > 0 ? (
              <DomainList domains={latestDomains} />
            ) : (
              <Typography>Henüz domain eklenmemiş.</Typography>
            )}
            <WhoisLogPage />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
