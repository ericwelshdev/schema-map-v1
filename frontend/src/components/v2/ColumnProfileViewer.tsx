import React from 'react';
import { ColumnProfile, AdvancedProfile } from '../types';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ColumnProfileViewerProps {
  columnName: string;
  profile: ColumnProfile;
  advancedProfile: AdvancedProfile;
}

const ColumnProfileViewer: React.FC<ColumnProfileViewerProps> = ({
  columnName,
  profile,
  advancedProfile,
}) => {
  return (
    <div className="mb-8 p-4 border rounded-lg">
      <h4 className="text-lg font-semibold mb-2">{columnName}</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold">Basic Profile</h5>
          <ul>
            <li>Data Type: {profile.dataType}</li>
            <li>Unique Count: {profile.uniqueCount}</li>
            <li>Null Count: {profile.nullCount}</li>
            <li>Min Value: {profile.minValue}</li>
            <li>Max Value: {profile.maxValue}</li>
            <li>Average Value: {profile.avgValue?.toFixed(2)}</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold">Advanced Profile</h5>
          <ul>
            <li>Mean: {advancedProfile.mean.toFixed(2)}</li>
            <li>Median: {advancedProfile.median.toFixed(2)}</li>
            <li>Mode: {advancedProfile.mode}</li>
            <li>Standard Deviation: {advancedProfile.standardDeviation.toFixed(2)}</li>
            <li>Variance: {advancedProfile.variance.toFixed(2)}</li>
            <li>Skewness: {advancedProfile.skewness.toFixed(2)}</li>
            <li>Kurtosis: {advancedProfile.kurtosis.toFixed(2)}</li>
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <h5 className="font-semibold">Histogram</h5>
        <Bar
          data={{
            labels: advancedProfile.histogram.bins,
            datasets: [
              {
                label: 'Frequency',
                data: advancedProfile.histogram.counts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: `Histogram of ${columnName}`,
              },
            },
          }}
        />
      </div>
      <div className="mt-4">
        <h5 className="font-semibold">Box Plot</h5>
        <div className="h-20">
          <Line
            data={{
              labels: ['Min', 'Q1', 'Median', 'Q3', 'Max'],
              datasets: [
                {
                  label: 'Box Plot',
                  data: [
                    advancedProfile.boxPlotData.min,
                    advancedProfile.boxPlotData.q1,
                    advancedProfile.boxPlotData.median,
                    advancedProfile.boxPlotData.q3,
                    advancedProfile.boxPlotData.max,
                  ],
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: `Box Plot of ${columnName}`,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColumnProfileViewer;