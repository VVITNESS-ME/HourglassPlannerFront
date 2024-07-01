'use client';

import React, { useState } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Button from './Button';
import CustomInput from './CustomInput';

const TimerSelector: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const handleSetTime = useHourglassStore((state) => state.handleSetTime);
  const toggleRunning = useHourglassStore((state) => state.toggleRunning);

  const handleClick = (label: string, seconds: number) => {
    setActiveButton(label);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    handleSetTime(hours, minutes, remainingSeconds);
    toggleRunning(); // 타이머 시작
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <Button label="10분" onClick={() => handleClick('10분', 10 * 60)} isActive={activeButton === '10분'} />
        <Button label="30분" onClick={() => handleClick('30분', 30 * 60)} isActive={activeButton === '30분'} />
        <Button label="1시간" onClick={() => handleClick('1시간', 60 * 60)} isActive={activeButton === '1시간'} />
        <Button label="∞" onClick={() => handleClick('∞', Infinity)} isActive={activeButton === '∞'} />
      </div>
      <CustomInput />
    </div>
  );
};

export default TimerSelector;
