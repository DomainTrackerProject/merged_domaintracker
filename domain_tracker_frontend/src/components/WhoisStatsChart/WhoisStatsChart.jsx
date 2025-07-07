import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./styles/WhoisStatsChart.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
  datasets: [
    {
      label: "WHOIS Sorguları",
      data: [5, 12, 7, 9, 15, 8, 11],
      backgroundColor: "rgba(33, 150, 243, 0.6)"
    }
  ]
};

const WhoisStatsChart = () => {
  return (
    <div className={styles.chartContainer}>
      <h3>Haftalık WHOIS Sorguları</h3>
      <Bar data={data} />
    </div>
  );
};

export default WhoisStatsChart;
