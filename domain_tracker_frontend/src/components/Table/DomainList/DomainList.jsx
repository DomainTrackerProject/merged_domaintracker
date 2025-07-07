import React, { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem, TextField
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import styles from "./styles/DomainList.module.css";

const getStatusColor = (status) => {
  const colors = {
    "Aktif": "#4CAF50",
    "Yakında Süresi Dolacak": "#FF9800",
    "Süresi Dolmak Üzere": "#D32F2F",
  };
  return colors[status] || "#607D8B";
};

const DomainList = ({ domains }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeColumn, setActiveColumn] = useState("");

  const handleRowClick = (domainId) => {
    navigate(`/domain/${domainId}`);
  };

  const handleMenuClick = (event, column) => {
    setAnchorEl(event.currentTarget);
    setActiveColumn(column);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveColumn("");
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    handleMenuClose();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredDomains = useMemo(() => {
    return domains
      .filter((domain) =>
        Object.keys(filters).every((key) =>
          domain[key]?.toLowerCase().includes(filters[key]?.toLowerCase() || "")
        )
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valA = a[sortConfig.key].toLowerCase();
        const valB = b[sortConfig.key].toLowerCase();
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [domains, filters, sortConfig]);

  const renderMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleSort(activeColumn, "asc")}>A-Z Sırala</MenuItem>
      <MenuItem onClick={() => handleSort(activeColumn, "desc")}>Z-A Sırala</MenuItem>
      <MenuItem disableRipple>
        <TextField
          variant="standard"
          placeholder="Filtrele"
          fullWidth
          value={filters[activeColumn] || ""}
          onChange={(e) => handleFilterChange(activeColumn, e.target.value)}
        />
      </MenuItem>
    </Menu>
  );

  if (!domains || domains.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Görüntülenecek domain bulunamadı.
      </p>
    );
  }

  return (
    <>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
        <TableHead>
          <TableRow className={styles.headerRow}>
            {["domain_name", "expiration_date", "status"].map((column) => (
              <TableCell key={column} className={styles.headerCell}>
                {column === "domain_name" && "Domain Adı"}
                {column === "expiration_date" && "Son Kullanma Tarihi"}
                {column === "status" && "Durum"}
                <IconButton onClick={(e) => handleMenuClick(e, column)} size="small" sx={{ maxWidth: 32, minWidth: 0, p: 0.5 }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
            {filteredDomains.map((domain) => (
              <TableRow
                key={domain.domain_id}
                className={styles.tableRow}
                hover
                onClick={() => handleRowClick(domain.domain_id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{domain.domain_name}</TableCell>
                <TableCell>{domain.expiration_date}</TableCell>
                <TableCell
                  style={{
                    color: getStatusColor(domain.status),
                    fontWeight: "bold",
                  }}
                >
                  {domain.status}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
      </TableContainer>

      {renderMenu()}
    </>
  );
};

export default DomainList;
