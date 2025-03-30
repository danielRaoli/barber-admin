"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  datasets: [
    {
      label: "Agendamentos",
      data: [12, 19, 15, 17, 22, 25, 10],
      backgroundColor: "rgba(99, 102, 241, 0.5)",
    },
  ],
};

export function Overview() {
  return <Bar data={data} />;
}
