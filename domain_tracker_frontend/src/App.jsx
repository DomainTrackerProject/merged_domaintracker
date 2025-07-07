import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import Dashboard from "./pages/DashboardPage/Dashboard.jsx";
import DomainPage from "./pages/DomainsPage/DomainPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage.jsx";
import AddDomainModal from "./pages/DomainsPage/AddDomainModal.jsx";
import DomainDetailPage from "./pages/DomainsPage/DomainDetailPage.jsx";
import AccountPage from "./pages/AccountPage/AccountPage.jsx";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage.jsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx";
import CreateNotificationPage from "./pages/NotificationsPage/CreateNotificationPage.jsx";
import DomainEditPage from "./pages/DomainsPage/DomainEditPage.jsx";
import DomainNotificationSettingsPage from "./pages/NotificationsPage/DomainNotificationSettingsPage.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import NavigationListener from "./components/NavigationListener/NavigationListener.jsx";
import NotificationDetailPage from "./pages/NotificationsPage/NotificationDetailPage.jsx";
import NotificationDaysPage from "./pages/NotificationsPage/NotificationDaysPage.jsx";
import PrivacySecurityPage from "./pages/PrivacySecurityPage/PrivacySecurityPage.jsx";
import SupportPage from "./pages/SupportPage/SupportPage.jsx";

function App() {
  const location = useLocation();

  // Check if the current route is login or register pages
  const isAuthPage = location.pathname === "/" || location.pathname === "/register" || location.pathname === "/reset-password";

  return (
    <NavigationListener>
      {(navHistory) => (
        <>
          {/* Conditionally render the Navbar */}
          {!isAuthPage && <Navbar {...navHistory} />}
          
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/domains" element={<DomainPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/domain/:id" element={<DomainDetailPage />} />
            <Route path="/add-domain" element={<AddDomainModal />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/privacy" element={<PrivacySecurityPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notification/:id" element={<NotificationDetailPage/>} />
            <Route path="/createNotification" element={<CreateNotificationPage />} />
            <Route path="/domains/:id/edit" element={<DomainEditPage />} />
            <Route path="/domains/:id/domain-notification-settings" element={<DomainNotificationSettingsPage />} />
            <Route path="/notifications/:id/days" element={<NotificationDaysPage />} />
          </Routes>
        </>
      )}
    </NavigationListener>
  );
}

export default App;
