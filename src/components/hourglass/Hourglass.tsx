'use client';

import React, { useState } from 'react';
import TimerSelector from './TimerSelector';
import HourglassAni from './hourglassAni';
import HourglassFunction from './timerRunning';
import { useHourglassStore } from '../../../store/hourglassStore';

const Hourglass: React.FC = () => {
  const isRunning = useHourglassStore((state) => state.isRunning);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
  };

  const handleStart = (time: number) => {
    setSelectedTime(time);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HourglassAni/>
      {isRunning ? <HourglassFunction /> : <TimerSelector />}
    </div>
  );
};

export default Hourglass;
