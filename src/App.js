import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { utcToZonedTime, format } from 'date-fns-tz';
import TemperatureChart from './TemperatureChart';
import TemperatureCheckboxes from './TemperatureCheckbox';


const TemperatureVisualizer = () => {
  const [temperatures, setTemperatures] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [plants, setPlants] = useState({});

  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const response = await axios.get('https://0iq8z0yqd8.execute-api.eu-central-1.amazonaws.com/v1/plants');
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlantsData();
    const intervalId = setInterval(fetchPlantsData, 300000);

    return () => clearInterval(intervalId);
  }, []);


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

      <h2>Kasviluettelo:</h2>
      <h3>{plants.title}</h3>
      <ul>
        {plants.plantCounts?.map((plantCount, index) => (
          <li key={index}>
            <h4>{plantCount.heading}</h4>
            <p>Yhteensä kasveja: {plantCount.totalPlants}</p>
            <ul>
              {plantCount.subheadings?.map((subheading, subIndex) => (
                <li key={subIndex}>
                  <p>{subheading.subheading}: {subheading.plants}</p>
                </li>
              ))}
            </ul>
          </li>
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
