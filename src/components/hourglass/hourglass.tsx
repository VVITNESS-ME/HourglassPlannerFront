'use client';

import React, { useState } from 'react';
import TimerSelector from './timerSelector';
import HourglassAni from './hourglassAni';
import TimerRunning from './timerRunning';
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
    <div className="flex flex-col items-center justify-center">
      <HourglassAni/>
      {isRunning ? <TimerRunning /> : <TimerSelector />}
    </div>
  );
};

export default Hourglass;
