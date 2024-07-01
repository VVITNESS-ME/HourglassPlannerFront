// components/TimerSelector.tsx
'use client';

import React, { useState } from 'react';
import Button from './Button';

interface TimerSelectorProps {
  onSelect: (time: number) => void;
}

const TimerSelector: React.FC<TimerSelectorProps> = ({ onSelect }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleClick = (label: string, time: number) => {
    setActiveButton(label);
    onSelect(time);
  };

  return (
    <div className="flex justify-center">
      <Button label="10분" onClick={() => handleClick('10분', 10 * 60)} isActive={activeButton === '10분'} />
      <Button label="30분" onClick={() => handleClick('30분', 30 * 60)} isActive={activeButton === '30분'} />
      <Button label="1시간" onClick={() => handleClick('1시간', 60 * 60)} isActive={activeButton === '1시간'} />
      <Button label="∞" onClick={() => handleClick('∞', Infinity)} isActive={activeButton === '∞'} />
    </div>
  );
};

export default TimerSelector;
