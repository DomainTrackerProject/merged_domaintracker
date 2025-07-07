import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  InputBase,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  ClickAwayListener,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Language as DomainIcon,
  AddCircleOutline as AddDomainIcon,
} from "@mui/icons-material";
import { FaGlobe } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../Account/AccountMenu";
import { getSentNotifications } from "../../services/notificationService";
import { getDomains } from "../../services/domainService";
import {logoutUser } from '../../services/authService';
import styles from "./styles/Navbar.module.css";
import AddDomainModal from "../../pages/DomainsPage/AddDomainModal";

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchableItems, setSearchableItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDomains, setAllDomains] = useState([]);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "Domainlerim", path: "/domains", icon: <DomainIcon fontSize="small" /> },
    { label: "Domain Ekle", path: "/add-domain", icon: <AddDomainIcon fontSize="small" /> },
    { label: "Bildirimler", path: "/notifications", icon: <NotificationsIcon fontSize="small" /> },

  ];

  useEffect(() => {
    fetchNotifications();
    fetchDomains();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const combined = [
      ...allDomains.map((domain) => ({
        id: domain.domain_id,
        label: domain.domain_name,
        type: "domain",
      })),
      ...menuItems.map((item) => ({
        label: item.label,
        path: item.path,
        type: "menu",
      })),
    ];
    setSearchableItems(combined);
  }, [allDomains]);

  const fetchNotifications = async () => {
    try {
      const response = await getSentNotifications();
      setSentNotifications(response?.data || []);
    } catch {
      setSentNotifications([]);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await getDomains();
      setAllDomains(response);
    } catch (err) {
      console.error("Domainler alınamadı", err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const matches = searchableItems.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(matches);
    setShowSuggestions(Boolean(value));
  };

  const handleNavigation = (path) => {
    if (path === "/add-domain") {
      setIsModalOpen(true);
    } else {
      navigate(path);
    }
    setDrawerOpen(false);
  };
  const handleLogout = () => {
      logoutUser();
      navigate('/');
   };

  return (
    <>
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.title}>
            <FaGlobe />
            Domain Takip
          </Typography>

          <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
            <Box className={styles.searchContainer}>
              <Box className={styles.searchBox}>
                <SearchIcon className={styles.searchIcon} />
                <InputBase
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  className={styles.searchInput}
                />
              </Box>
              {showSuggestions && (
                <Box className={styles.suggestionBox}>
                  {filteredItems.map((item, index) => (
                    <Box
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        if (item.type === "menu") navigate(item.path);
                        else navigate(`/domain/${item.id}`);
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                    >
                      {item.label}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </ClickAwayListener>

          <Box className={styles.icons}>
            {isMobile ? (
              <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            ) : (
              <Box className={styles.navMenu}>
                {menuItems.map((item) => (
                  <Box
                    key={item.label}
                    className={styles.navLink}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label === "Bildirimler" ? (
                      <Badge badgeContent={sentNotifications.length} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                    <span className={styles.navLinkText}>{item.label}</span>
                  </Box>
                ))}
              </Box>

            )}

       
          <div className={styles.accountWrapper}>
              <AccountMenu />
            </div>
          
          </Box>
        </Toolbar>
      </AppBar>

    <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(to bottom, #ffffff, #f4f6f8)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            overflow: "hidden",
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          {/* Üstte Kullanıcı Bilgisi */}
          <Box sx={{
          width: "100%",
          textAlign: "center",
          padding: "24px 16px",
          background: "linear-gradient(135deg, #1976d2, #2196f3)",
          color: "white",
        }}>
          <Box sx={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 1.5,
          }}>
            <DomainIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Domain Takip
          </Typography>
         
        </Box>


          {/* Arama Alanı */}
          <Box sx={{ padding: "16px" }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              padding: '6px 12px',
            }}>
              <SearchIcon sx={{ color: "#1976d2" }} />
              <InputBase
                placeholder="Ara..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ marginLeft: 1, flex: 1 }}
              />
            </Box>
            {/* 🔥 Drawer içi Arama Sonuçları */}
              {showSuggestions && (
                <Box sx={{
                  marginTop: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          padding: "10px 16px",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                        onClick={() => {
                          if (item.type === "menu") navigate(item.path);
                          else navigate(`/domain/${item.id}`);
                          setSearchQuery("");
                          setShowSuggestions(false);
                          setDrawerOpen(false);
                        }}
                      >
                        {item.label}
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ padding: "10px", fontSize: "0.9rem", color: "#888" }}>
                      Sonuç bulunamadı
                    </Typography>
                  )}
                </Box>
            )}

          </Box>

          {/* Menü */}
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: "8px",
                  margin: "4px 8px",
                  transition: "background 0.3s",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    transform: "scale(1.02)",
                  },
                }}
              >
                {item.label === "Bildirimler" ? (
                  <Badge badgeContent={sentNotifications.length} color="error" sx={{ mr: 2 }}>
                    {item.icon}
                  </Badge>
                ) : (
                  <Box sx={{ mr: 2 }}>{item.icon}</Box>
                )}
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {/* Çıkış */}
          <Box sx={{ padding: "16px", borderTop: "1px solid #e0e0e0" }}>
            <ListItem
              button
              onClick={() => {
                console.log("Çıkış Yapılıyor...");
                // logout işlemi burada
                handleLogout();
                setDrawerOpen(false);
              }}
              sx={{
                backgroundColor: "#ef5350",
                color: "#fff",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#e53935",
                },
              }}
            >
              <ListItemText primary="Çıkış Yap" sx={{ textAlign: "center" }} />
            </ListItem>
          </Box>

        </Box>
    </Drawer>




      <AddDomainModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toolbar />
    </>
  );
};

export default Navbar;
