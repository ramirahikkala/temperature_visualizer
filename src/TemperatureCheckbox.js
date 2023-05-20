import React from 'react';

const TemperatureCheckboxes = ({ temperatures, handleCheckboxChange }) => {
  const temperatureKeys = Object.keys(temperatures);

  return (
    <div>
      {temperatureKeys.map((key, index) => (
        <label key={index}>
          <input
            type="checkbox"
            name={key}
            onChange={handleCheckboxChange}
          />
          {key}
        </label>
      ))}
    </div>
  );
};

export default TemperatureCheckboxes;
