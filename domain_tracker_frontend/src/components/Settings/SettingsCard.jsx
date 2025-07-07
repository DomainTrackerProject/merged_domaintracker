import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import styles from "./styles/SettingsCard.module.css";

const SettingsCard = ({ title, description, icon, onClick }) => {
  return (
    <Card className={styles.card} onClick={onClick} style={{ cursor: "pointer" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h6" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
