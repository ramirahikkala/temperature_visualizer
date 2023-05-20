import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import axios from 'axios';

Chart.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend);

function TemperatureChart({ selectedTemperatures }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const newChartData = { labels: [], datasets: [] };

            console.log("selectedTemperatures", selectedTemperatures); // Debugging point 1

            for (let key in selectedTemperatures) {
                if (!selectedTemperatures[key]) continue;

                try {
                    const response = await axios.get(`https://ckslcpsx8d.execute-api.eu-central-1.amazonaws.com/v1/ruuvi-data?measurementPoint=${key}&timeRange=24`);
                    const data = response.data;
                    const temperatures = data.map(item => parseFloat(item.temperature));
                    const datetimes = data.map(item => new Date(item.datetime));

                    console.log(`Data for ${key}`, data); // Debugging point 2

                    newChartData.labels = datetimes;
                    newChartData.datasets.push({
                        label: key,
                        data: temperatures,
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false,
                    });

                } catch (error) {
                    console.error('Error fetching temperatures:', error);
                }
            }

            setChartData(newChartData);
        };

        fetchData();
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
