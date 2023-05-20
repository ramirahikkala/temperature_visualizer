import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend);


function TemperatureChart({ selectedTemperatures }) {
  const [chartData, setChartData] = useState(null);

  // Array of colors for the chart lines
  const colors = ['rgba(75,192,192,1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];

  useEffect(() => {
    const fetchTemperatureData = async () => {
      const datasets = await Promise.all(
        Object.keys(selectedTemperatures).map(async (name, index) => {
          if (selectedTemperatures[name]) {
            const response = await fetch(`https://ckslcpsx8d.execute-api.eu-central-1.amazonaws.com/v1/ruuvi-data?measurementPoint=${name}&timeRange=24`);
            const data = await response.json();
            return {
              label: name,
              data: data.map(item => ({ x: new Date(item.datetime), y: parseFloat(item.temperature) })),
              borderColor: colors[index % colors.length],
              fill: false,
            };
          }
          return null;
        })
      );

      setChartData({
        datasets: datasets.filter(dataset => dataset !== null),
      });
    };

    fetchTemperatureData();
  }, [selectedTemperatures]);

  return (
    <div>
      {chartData &&
        <Line 
          data={chartData} 
          options={{ 
            scales: {
              x: { type: 'time' },
            },
          }} 
        />
      }
    </div>
  );
}

export default TemperatureChart;
