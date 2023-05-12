import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const TemperatureVisualizer = () => {
  const [temperatures, setTemperatures] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ckslcpsx8d.execute-api.eu-central-1.amazonaws.com/v1/ruuvi-data');
        setTemperatures(response.data.temperatures);
        setTimeElapsed(0); // Reset timeElapsed on data update
      } catch (error) {
        console.error('Error fetching temperatures:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 300000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeElapsed(timeElapsed => timeElapsed + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <div className="temperature-visualizer">
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(temperatures)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .map(([name, data], index) => (
            <li key={index}>
              {name}: {data.latest} °C
            </li>
          ))}
      </ul>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(temperatures)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .map(([name, data], index) => (
            <li key={index}>
              {name}:
              Latest: {data.latest.temperature_calibrated}°C at {data.latest.datetime_str},
              Min: {data.min_max.min}°C at {data.min_max.min_datetime},
              Max: {data.min_max.max}°C at {data.min_max.max_datetime}
            </li>

          ))}
      </ul>
      <p>Time since last update: {minutes}m {seconds}s</p>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <TemperatureVisualizer />
    </div>
  );
}

export default App;
