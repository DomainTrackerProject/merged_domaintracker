import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Account from "../../components/Account/Account";
import { getCurrentUser } from "../../services/authService";
import styles from "./styles/AccountPage.module.css";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError("Kullanıcı bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <Container className={styles.container}>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {user && <Account user={user} />}
      </Container>
    </>
  );
};

export default AccountPage;
