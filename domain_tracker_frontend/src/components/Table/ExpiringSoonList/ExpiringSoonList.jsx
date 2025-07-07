import React from "react";
import { List, ListItem, ListItemText, Alert } from "@mui/material";
import styles from "./styles/ExpiringSoonList.module.css";

const expiringDomains = [
  { id: 1, name: "expiringdomain.com", expiration: "2024-04-10" },
  { id: 2, name: "urgent-renew.net", expiration: "2024-04-15" }
];

const ExpiringSoonList = () => {
  return (
    <div className={styles.container}>
      <Alert severity="warning">Yakında süresi dolacak domainler:</Alert>
      <List>
        {expiringDomains.map((domain) => (
          <ListItem key={domain.id}>
            <ListItemText primary={domain.name} secondary={`Son Kullanma Tarihi: ${domain.expiration}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ExpiringSoonList;
