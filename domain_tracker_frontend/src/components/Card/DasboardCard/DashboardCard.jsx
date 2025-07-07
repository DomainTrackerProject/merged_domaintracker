import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { FaGlobe, FaBell, FaClock } from "react-icons/fa";
import styles from "./styles/DashboardCard.module.css";

const icons = {
  globe: <FaGlobe className={styles.cardIcon} />,
  bell: <FaBell className={styles.cardIcon} />,
  clock: <FaClock className={styles.cardIcon} />
};

const DashboardCard = ({ title, value, color, icon }) => {
  return (
    <Card className={styles.dashboardCard} style={{ borderLeft: `5px solid ${color}` }}>
      <CardContent className={styles.cardContent}>
        {icons[icon]}
        <div>
          <Typography variant="h6" className={styles.cardTitle}>{title}</Typography>
          <Typography variant="h4" className={styles.cardValue}>{value}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
