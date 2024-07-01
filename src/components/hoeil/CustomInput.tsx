// components/CustomInput.tsx
'use client';

import React, { useState } from 'react';
import Button from './Button';
import { isAscii } from 'buffer';

interface CustomInputProps {
  onStart: (time: number) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ onStart }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStartClick = () => {
    const time = parseInt(inputValue, 10) * 60;
    if (!isNaN(time)) {
      onStart(time);
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
