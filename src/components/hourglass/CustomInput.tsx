'use client';

import React, { useState } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Button from './Button';

const CustomInput: React.FC= () => {
  const [inputValue, setInputValue] = useState('');
  const handleSetTime = useHourglassStore((state) => state.handleSetTime);
  const toggleRunning = useHourglassStore((state) => state.toggleRunning);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStartClick = () => {
    const time = parseInt(inputValue, 10) * 60;
    if (!isNaN(time)) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const remainingSeconds = time % 60;
      handleSetTime(hours, minutes, remainingSeconds);
      toggleRunning(); // 타이머 시작
    }
  };

  return (
    <div className="flex justify-center mt-4 font-bold">
      <input
        type="text"
        className="p-2 m-2 border border-gray-300 rounded"
        placeholder="직접 입력 (분)"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button label="시작" onClick={handleStartClick} isActive={false} />
    </div>
  );
};

export default CustomInput;
