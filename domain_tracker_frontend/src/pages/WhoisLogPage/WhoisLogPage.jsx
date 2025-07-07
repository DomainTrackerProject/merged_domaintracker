import React, { useEffect, useState } from 'react';
import { getWhoisLogs } from '../../services/whoisLogService';
import styles from './styles/WhoisLogPage.module.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const daysOfWeek = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const WhoisLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getWhoisLogs();
        setLogs(response);
        generateChart(response);
      } catch (err) {
        setError('WHOIS logları alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const generateChart = (data) => {
    const dayCounts = Array(7).fill(0); // index 0 = Pazar, 6 = Cumartesi

    data.forEach((log) => {
      const retrievedAt = log?.retrieved_at;
      if (retrievedAt) {
        const dayIndex = new Date(retrievedAt).getDay();
        dayCounts[dayIndex] += 1;
      }
    });

    setChartData({
      labels: daysOfWeek,
      datasets: [
        {
          label: 'Haftanın Günlerine Göre WHOIS Logları',
          data: dayCounts,
          backgroundColor: '#2e4ecc',
          borderRadius: 6,
        },
      ],
    });
  };

  const formatDateField = (field) => {
    if (Array.isArray(field)) return field[0];
    return field || '-';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>WHOIS Log Kayıtları</h1>

      {loading && <p className={styles.loading}>Yükleniyor...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p className={styles.empty}>Hiç WHOIS kaydı bulunamadı.</p>
      )}

      {chartData && (
        <div className={styles.chartWrapper}>
          <Bar data={chartData} options={{
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } },
          }} />
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>  </th>
              <th>Domain Adı</th>
              <th>Kayıt Tarihi</th>
              <th>Bitiş Tarihi</th>
              <th>Oluşturulma</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => {
              const whois = log.whois_data || {};
              return (
                <tr key={log.log_id}>
                  <td>{index + 1}</td>
                  <td>{whois.domain_name || '-'}</td>
                  <td>{formatDateField(whois.creation_date)}</td>
                  <td>{formatDateField(whois.expiration_date)}</td>
                  <td>{log.retrieved_at ? new Date(log.retrieved_at).toLocaleString() : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WhoisLogPage;
