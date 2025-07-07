import React from "react";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import styles from "./styles/SupportPage.module.css";

const SupportPage = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Destek & Kullanım Rehberi
      </Typography>

      <Typography variant="body1" className={styles.paragraph}>
        Domain Takip Sistemi uygulamasını verimli şekilde kullanabilmeniz için aşağıdaki adımları takip edebilirsiniz:
      </Typography>

      <List className={styles.guideList}>
        <ListItem>
          <ListItemText
            primary="📋 Dashboard"
            secondary="Uygulamaya giriş yaptığınızda, ilk olarak genel durumu görebileceğiniz Dashboard ekranına yönlendirilirsiniz."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="🌐 Domainlerim"
            secondary="Sol menüden 'Domainlerim' sekmesine tıklayarak mevcut domainlerinizi görebilirsiniz."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="➕ Domain Ekle"
            secondary="Yeni bir domain eklemek için menüden 'Domain Ekle' seçeneğine tıklayın. Açılan modal üzerinden domain bilgilerini girerek kaydedin."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="🔍 Arama Özelliği"
            secondary="Üst menüdeki arama kutusunu kullanarak domainler veya menü öğeleri arasında hızlıca arama yapabilirsiniz."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="🔔 Bildirimler"
            secondary="Bildirim ikonuna tıklayarak size gönderilen uyarı veya hatırlatmaları görüntüleyebilirsiniz."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="⚙️ Ayarlar ve Hesap"
            secondary="Profil simgesine tıklayarak hesap ayarlarını ve diğer kişisel bilgilerinizi düzenleyebilirsiniz."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="📞 Yardım Al"
            secondary="Bu sayfa üzerinden temel kullanım bilgilerine ulaşabilir veya destek için bizimle iletişime geçebilirsiniz."
          />
        </ListItem>
      </List>

      <Typography variant="body2" className={styles.footer}>
        Sorularınız için destek ekibimize ulaşın: <a href="mailto:m87823470@gmail.com">destek@domainapp.com</a>
      </Typography>
    </Box>
  );
};

export default SupportPage;
