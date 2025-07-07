import { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import styles from "./styles/ForgotPasswordForm.module.css"; // CSS Modülü

const ForgotPasswordForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email);
    };

    return (
        <Box className={styles.forgotPasswordContainer}>
            <Paper elevation={3} className={styles.formBox}>
                <Typography variant="h6" className={styles.title}>
                    Lütfen E-posta Adresinizi Girin
                </Typography>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <TextField
                        fullWidth
                        type="email"
                        label="E-posta adresinizi girin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" className={styles.button}>
                        Gönder
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ForgotPasswordForm;
