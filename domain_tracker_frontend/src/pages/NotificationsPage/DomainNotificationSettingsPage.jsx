import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import {
  getDomainNotificationSettings,
  createDomainNotificationSetting,
  updateDomainNotificationSetting,
  deleteDomainNotificationSetting
} from '../../services/domainNotificationSettingService';

import { getDomains } from '../../services/domainService';
import { getNotificationTypes } from '../../services/notificationTypeService';
import Navbar from '../../components/Navbar/Navbar';

const DomainNotificationSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ domain_id: '', type_id: '', setting_id: null });
  const [domainMap, setDomainMap] = useState({});
  const [typeMap, setTypeMap] = useState({});

  const fetchSettings = async () => {
    try {
      const res = await getDomainNotificationSettings();
      setSettings(res.data || res);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings([]);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [domainRes, typeRes] = await Promise.all([
        getDomains(),
        getNotificationTypes()
      ]);

      const domains = domainRes.data || domainRes;
      const types = typeRes.data || typeRes;

      const dMap = {};
      domains.forEach(d => {
        dMap[d.domain_id] = d.domain_name;
      });

      const tMap = {};
      types.forEach((t, index) => {
        // index + 1 to simulate type_id if not exists
        tMap[t.type_id || index + 1] = t.type_name;
      });

      setDomainMap(dMap);
      setTypeMap(tMap);
    } catch (err) {
      console.error("Metadata fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchMetadata();
  }, []);

  const handleOpen = (setting) => {
    if (setting) {
      setForm({ ...setting });
    } else {
      setForm({ domain_id: '', type_id: '', setting_id: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (form.setting_id) {
        await updateDomainNotificationSetting(form.setting_id, form.domain_id, form.type_id);
      } else {
        await createDomainNotificationSetting(form.domain_id, form.type_id);
      }
      fetchSettings();
      handleClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDomainNotificationSetting(id);
      fetchSettings();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container>
      <Navbar/>
      <Typography variant="h4" gutterBottom>Bildirim Ayarları</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>Yeni Ayar Ekle</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Domain</TableCell>
            <TableCell>Bildirim Türü</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {settings.length > 0 ? (
            settings.map((s) => (
              <TableRow key={`${s.setting_id}-${s.type_id}-${s.domain_id}`}>
                <TableCell>{s.setting_id}</TableCell>
                <TableCell>{domainMap[s.domain_id] || `(${s.domain_id})`}</TableCell>
                <TableCell>{typeMap[s.type_id] || `(${s.type_id})`}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(s)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(s.setting_id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">Bildirim Ayarı bulunmamaktadır.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.setting_id ? "Ayarı Güncelle" : "Yeni Ayar Ekle"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Domain</InputLabel>
            <Select
              name="domain_id"
              value={form.domain_id}
              onChange={handleChange}
              label="Domain"
            >
              {Object.entries(domainMap).map(([id, name]) => (
                <MenuItem key={id} value={id}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Bildirim Türü</InputLabel>
            <Select
              name="type_id"
              value={form.type_id}
              onChange={handleChange}
              label="Bildirim Türü"
            >
              {Object.entries(typeMap).map(([id, name]) => (
                <MenuItem key={id} value={id}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DomainNotificationSettingsPage;
