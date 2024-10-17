import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MissingDataAnalysisProps {
  missingDataAnalysis: {
    tableLevelMetrics: {
      totalRows: number;
      totalColumns: number;
      totalMissing: number;
      missingPercentage: number;
    };
    columnMissing: Record<string, number>;
    missingPatterns: Record<string, number>;
  };
}

const MissingDataAnalysis: React.FC<MissingDataAnalysisProps> = ({ missingDataAnalysis }) => {
  const { tableLevelMetrics, columnMissing, missingPatterns } = missingDataAnalysis;

  const columnMissingData = {
    labels: Object.keys(columnMissing),
    datasets: [
      {
        label: 'Missing Values per Column',
        data: Object.values(columnMissing),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const patternData = {
    labels: Object.keys(missingPatterns),
    datasets: [
      {
        label: 'Missing Data Pattern Count',
        data: Object.values(missingPatterns),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Missing Data Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Missing Data Analysis</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold">Table-level Metrics</h4>
          <ul>
            <li>Total Rows: {tableLevelMetrics.totalRows}</li>
            <li>Total Columns: {tableLevelMetrics.totalColumns}</li>
            <li>Total Missing Values: {tableLevelMetrics.totalMissing}</li>
            <li>Missing Percentage: {tableLevelMetrics.missingPercentage.toFixed(2)}%</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Missing Values per Column</h4>
          <Bar data={columnMissingData} options={options} />
        </div>
      </div>
      <div>
        <h4 className="font-semibold">Missing Data Patterns</h4>
        <Bar data={patternData} options={options} />
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">Pattern Explanation:</h4>
        <p className="text-sm text-gray-600">
          Each bar represents a unique pattern of missing data across columns.
          The pattern is a binary string where '1' indicates presence and '0' indicates absence of data.
          The height of the bar shows how many rows follow that specific pattern.
        </p>
      </div>
    </div>
  );
};

export default MissingDataAnalysis;