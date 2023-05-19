import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { utcToZonedTime, format } from 'date-fns-tz';

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
  const finlandTimeZone = 'Europe/Helsinki';

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
      <h2>Minimit ja maksimit:</h2>
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
      <h2>Measurement Details:</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(temperatures).sort(([nameA], [nameB
  ]) => nameA.localeCompare(nameB)).map(([name, data], index) => {
    const latest_datetime_local = data.latest.datetime_str ? format(utcToZonedTime(data.latest.datetime_str, finlandTimeZone), 'EEE HH:mm') : '';

    return (
      <li key={index} >
        <h4>{name}:</h4><br />
        <b>Measurement Sequence Number:</b> {data.latest.measurement_sequence_number}<br />
        <b>Movement Counter:</b> {data.latest.movement_counter}<br />
        <b>MAC:</b> {data.latest.mac}<br />
        <b>Battery:</b> {data.latest.battery}<br />
        <b>Acceleration:</b> X: {data.latest.acceleration_x}, Y: {data.latest.acceleration_y}, Z: {data.latest.acceleration_z}, Total: {data.latest.acceleration}<br />
        <b>Data Format:</b> {data.latest.data_format}<br />
        <b>Pressure:</b> {data.latest.pressure}<br />
        <b>Transmission Power:</b> {data.latest.tx_power}<br />
        <b>Humidity:</b> {data.latest.humidity}<br />
        <b>RSSI:</b> {data.latest.rssi}<br />
        <b>Calibrated Temperature:</b> {data.latest.temperature_calibrated}°C at {latest_datetime_local}<br />
      </li>
    )
  })}
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
