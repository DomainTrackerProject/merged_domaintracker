import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, InputAdornment, IconButton
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import styles from "./styles/AddDomain.module.css";

const AddDomain = ({ open, onClose, onSubmit, loading }) => {
  const [domainName, setDomainName] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ domainName, expirationDate });
    setDomainName("");
    setExpirationDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Domain Ekle</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit} className={styles.form}>
            <TextField
              label="Domain Adı"
              fullWidth
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              required
              margin="dense"
              className={styles.input}
            />
           <DatePicker
            disablePast
            value={expirationDate}
            onChange={(newValue) => setExpirationDate(newValue)}
            format="DD.MM.YYYY"
            label="Bitiş Tarihi"
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                margin="dense"
                placeholder="GG.AA.YYYY"
                className={styles.input}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '& input': {
                      padding: '12px 16px',
                      fontSize: '16px',
                      letterSpacing: '1px',
                    },
                  },
                }}
              />
            )}
          />


  
        </form>
        </DialogContent>
        <DialogActions className={styles.buttonContainer}>
          <Button onClick={onClose} className={`${styles.button} ${styles.secondary}`} disabled={loading}>
            İptal
          </Button>
          <Button
            type="submit"
            onClick={handleFormSubmit}
            variant="contained"
            className={`${styles.button} ${styles.primary}`}
            disabled={loading}
          >
            {loading ? "Ekleniyor..." : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddDomain;
