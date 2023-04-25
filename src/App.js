import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const TemperatureVisualizer = () => {
  const [temperatures, setTemperatures] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ckslcpsx8d.execute-api.eu-central-1.amazonaws.com/v1/ruuvi-data');
        setTemperatures(response.data.temperatures.latest);
      } catch (error) {
        console.error('Error fetching temperatures:', error);
      }
    };

    fetchData(); // Fetch data immediately on component mount
    const intervalId = setInterval(fetchData, 300000); // Update every 5 minutes (300000 ms)

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="temperature-visualizer">
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(temperatures).map(([name, temp], index) => (
          <li key={index}>{name}: {temp}°C</li>
        ))}
      </ul>
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
