import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { utcToZonedTime, format } from 'date-fns-tz';
import TemperatureChart from './TemperatureChart';
import TemperatureCheckboxes from './TemperatureCheckbox';

const TemperatureVisualizer = () => {
  const [temperatures, setTemperatures] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Retrieve previously selected temperatures from localStorage
  const previouslySelectedTemperatures = JSON.parse(localStorage.getItem('selectedTemperatures')) || {};

  const [selectedTemperatures, setSelectedTemperatures] = useState(previouslySelectedTemperatures);

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
  const finlandTimeZone = 'Europe/Helsinki';

  const handleCheckboxChange = (event) => {
    const updatedSelectedTemperatures = {
      ...selectedTemperatures,
      [event.target.name]: event.target.checked,
    };

    // Save the updated selection to localStorage
    localStorage.setItem('selectedTemperatures', JSON.stringify(updatedSelectedTemperatures));

    setSelectedTemperatures(updatedSelectedTemperatures);
  };
  
  return (
    <div className="temperature-visualizer">
      <h2>Lämpötilat:</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(temperatures)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .map(([name, data], index) => (
            <li key={index}>
              <b>{name}:</b> {data.latest.temperature_calibrated} °C  
            </li>
          ))}
      </ul>
      <h2>24 h minimit ja maksimit:</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(temperatures).sort(([nameA], [nameB]) => nameA.localeCompare(nameB)).map(([name, data], index) => {
          const min_datetime_local = data.min_max.min_datetime ? format(utcToZonedTime(data.min_max.min_datetime, finlandTimeZone), 'EEE HH:mm') : '';
          const max_datetime_local = data.min_max.max_datetime ? format(utcToZonedTime(data.min_max.max_datetime, finlandTimeZone), 'EEE HH:mm') : '';
          const latest_datetime_local = data.latest.datetime_str ? format(utcToZonedTime(data.latest.datetime_str, finlandTimeZone), 'EEE HH:mm') : '';

          return (
            <li key={index} > 
              <h4>{name}:</h4><br />
              <b>Latest:</b> {data.latest.temperature_calibrated}°C at {latest_datetime_local}<br />
              <b>Min:</b> {data.min_max.min}°C at {min_datetime_local}<br />
              <b>Max:</b> {data.min_max.max}°C at {max_datetime_local}<br />
            </li>
          )
        })}
      </ul>    
     
      <TemperatureCheckboxes temperatures={temperatures} handleCheckboxChange={handleCheckboxChange} selectedTemperatures={selectedTemperatures} />

      <TemperatureChart selectedTemperatures={selectedTemperatures} />

    </div>
  );
};

function App() {
  return (
    <div className="App">
      <iframe src="http://46.254.100.42/36f72cf4-e543-474b-aea4-080851abfbc8.html" width="640" height="360" frameborder="no" scrolling="no" allowfullscreen="true"></iframe>

      <TemperatureVisualizer />
    </div>
  );
}

export default App;
