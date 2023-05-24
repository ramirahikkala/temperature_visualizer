import React from 'react';

const TemperatureCheckboxes = ({ temperatures, handleCheckboxChange, selectedTemperatures }) => {
  const temperatureKeys = Object.keys(temperatures);

  return (
    <div>
      {temperatureKeys.map((key, index) => (
        <label key={index}>
          <input
            type="checkbox"
            name={key}
            onChange={handleCheckboxChange}
            checked={selectedTemperatures[key] || false}
          />
          {key}
        </label>
      ))}
    </div>
  );
};

export default TemperatureCheckboxes;
