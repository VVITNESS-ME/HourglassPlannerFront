'use client';

import React, { useState } from 'react';
import TimerSelector from './TimerSelector';
import CustomInput from './CustomInput';
import HourglassAni from './hourglassAni';
import HourglassFunction from './hourglassFunction';

const Hourglass: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
  };

  const handleStart = (time: number) => {
    setSelectedTime(time);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <HourglassAni/>
      <TimerSelector/>
      <HourglassFunction />
    </div>
  );
};

export default Hourglass;
