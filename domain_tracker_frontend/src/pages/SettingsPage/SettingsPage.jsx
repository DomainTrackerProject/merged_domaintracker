import React from "react";
import { Grid, Typography, Container } from "@mui/material";
import SettingsCard from "../../components/Settings/SettingsCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./styles/SettingsPage.module.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  const settingsItems = [
    {
      title: "Hesap Ayarları",
      description: "Şifre değiştir, kullanıcı bilgilerini güncelle.",
      icon: <AccountCircleIcon color="primary" />,
      onClick: () => navigate("/account"),
    },
    {
      title: "Bildirimler",
      description: "E-posta ve sistem bildirim tercihlerini düzenle.",
      icon: <NotificationsIcon color="primary" />,
      onClick: () => navigate("/notifications"),
    },
    {
      title: "Gizlilik ve Güvenlik",
      description: "Hesap güvenliğini yönet.",
      icon: <SecurityIcon color="primary" />,
      onClick: () => navigate("/privacy"),
    },
  ];

  return (
    <>
      <Navbar />
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.title} gutterBottom>
          Ayarlar
        </Typography>
        <Grid container spacing={3}>
          {settingsItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SettingsCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={item.onClick}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default SettingsPage;
