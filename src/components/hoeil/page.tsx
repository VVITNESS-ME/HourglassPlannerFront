// pages/index.tsx
'use client';

import React, { useState } from 'react';
import TimerSelector from './TimerSelector';
import CustomInput from './CustomInput';
import Hourglasss from './Hourglasss';

const Home: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
  };

  const handleStart = (time: number) => {
    setSelectedTime(time);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Hourglasss />
      <TimerSelector onSelect={handleTimeSelect} />
      <CustomInput onStart={handleStart} />
      {selectedTime !== null && (
        <div className="mt-4">
          <h2>Selected Time: {selectedTime === Infinity ? '∞' : `${selectedTime / 60}분`}</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
