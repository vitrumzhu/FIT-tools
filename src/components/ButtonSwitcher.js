import React, { useState, useEffect } from 'react';

const ButtonSwitcher = ({laberText, defaultValue, onChange}) => {
  const [isChecked, setIsChecked] = useState(defaultValue  || false)

  useEffect(() => {
    onChange(isChecked);
  }, [isChecked, onChange]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <>
      <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
        <input
          type='checkbox'
          name='autoSaver'
          className='sr-only'
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
            isChecked ? 'bg-[#83d582]' : 'bg-[#fcbebe]'
          }`}
        >
          <span
            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
              isChecked ? 'translate-x-6' : ''
            }`}
          ></span>
        </span>
        <span className='label flex items-center text-sm font-medium text-white'>
          {laberText} <span className='pl-1'> {isChecked ? 'On' : 'Off'} </span>
        </span>
      </label>
    </>
  )
}

export default ButtonSwitcher
