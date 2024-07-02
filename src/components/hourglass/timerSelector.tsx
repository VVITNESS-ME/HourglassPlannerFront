'use client';

import React, { useState } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Button from './button';

const TimerSelector: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const handleSetTime = useHourglassStore((state) => state.handleSetTime);
  const toggleRunning = useHourglassStore((state) => state.toggleRunning);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClick = (label: string, seconds: number) => {
    setActiveButton(label);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const Seconds = seconds % 60;
    handleSetTime(hours, minutes, Seconds);
    {toggleRunning}; // {동적!} 타이머 시작
  };

  return (
    <div className="flex flex-col justify-center">
      <div className='flex flex-row'>
        <Button label="10분" onClick={() => handleClick('10분', 10 * 60)} isActive={activeButton === '10분'} />
        <Button label="30분" onClick={() => handleClick('30분', 30 * 60)} isActive={activeButton === '30분'} />
        <Button label="1시간" onClick={() => handleClick('1시간', 60 * 60)} isActive={activeButton === '1시간'} />
        <Button label="∞" onClick={() => handleClick('∞', 60*60*800)} isActive={activeButton === '∞'} />
      </div>
      <div className='flex justify-center mt-4'>
        <input
          type="text"
          className="p-2 m-2 border border-mono-2 rounded"
          placeholder="직접 입력 (분)"
          value={inputValue}
          onChange={handleInputChange}
        />
        {
          (inputValue==='0' || inputValue==='') ? <button disabled className={`w-24 h-12 p-2 m-2 text-black rounded bg-mono-2`}>시작</button>
          : <Button label="시작" onClick={() => {handleClick('시작', parseInt(inputValue) * 60)}} isActive={false} />
        }
        {/* <Button label="시작" disabled onClick={() => {handleClick('시작', parseInt(inputValue) * 60)}} isActive={false} /> */}
      </div>
    </div>
  );
};

export default TimerSelector;
