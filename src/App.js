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
        setTemperatures(response.data.temperatures.latest);
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
        {Object.entries(temperatures).map(([name, temp], index) => (
          <li key={index}>{name}: {temp}°C</li>
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
