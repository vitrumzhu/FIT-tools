// RangeInput.js

import React, { useState } from 'react';

const RangeInput = ({ label, min, max, defaultValue, onValueChange, fixValue, fixLevel, symbol }) => {
  const [value, setValue] = useState(defaultValue);
  if (!fixValue) {
    fixValue = 1;
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="p-4">
      <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="altitude">
        {label} { fixValue!== 1 ? (value / fixValue).toFixed(fixLevel) : value } {!symbol? null: symbol}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        className="w-full"
      />
    </div>
  );
};

export default RangeInput;