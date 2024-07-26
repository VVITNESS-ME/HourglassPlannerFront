'use client';

import React, { useState } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Button from './button';

const TimerSelector = ({wd}:any) => {
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

  const inputValueInt = parseInt(inputValue, 10);
  const isValidInput = !isNaN(inputValueInt) && Number.isInteger(inputValueInt) && inputValueInt > 0 && inputValueInt <= 2880000;

  return (
    <div className="flex flex-col justify-center">
      {wd>240?<div className='flex flex-wrap pt-4 justify-center items-center'>
        <Button label="10분" onClick={() => handleClick('10분', 10 * 60)} isActive={activeButton === '10분'} />
        <Button label="30분" onClick={() => handleClick('30분', 90 * 60)} isActive={activeButton === '30분'} />
        <Button label="1시간" onClick={() => handleClick('1시간', 60 * 60)} isActive={activeButton === '1시간'} />
        <Button label="∞" onClick={() => handleClick('∞', 60*60*800)} isActive={activeButton === '∞'} />
      </div>
      :<div className='flex flex-wrap pt-1 justify-center items-center'>
        <Button label="10" onClick={() => handleClick('10분', 10 * 60)} isActive={activeButton === '10분'} width='w-12' height='h-10'/>
        <Button label="30" onClick={() => handleClick('30분', 90 * 60)} isActive={activeButton === '30분'} width='w-12' height='h-10' />
        <Button label="1H" onClick={() => handleClick('1시간', 60 * 60)} isActive={activeButton === '1시간'} width='w-12' height='h-10' />
        <Button label="∞" onClick={() => handleClick('∞', 60*60*800)} isActive={activeButton === '∞'} width='w-12' height='h-10' />
      </div>
      }

      {wd>240? <div className='flex justify-center'>
          <input
            type="text"
            className="p-2 m-2 border-4 border-black text-2xl  rounded w-64"
            placeholder="직접 입력 (분)"
            value={inputValue}
            onChange={handleInputChange}
          />
          {
            (!isValidInput) ?
              <button disabled className={`w-[136px] h-14 p-2 m-2 text-black border-4 border-black text-2xl rounded bg-mono-2`}>시작</button>
              : <Button label="시작" onClick={() => {
                handleClick('시작', parseInt(inputValue) * 60)
              }} isActive={false}/>
          }
        </div>
        : <div className='flex justify-center'>
          <input
            type="text"
            className="p-2 m-2 border text-l border-4 border-black rounded w-32"
            placeholder="직접 입력 (분)"
            value={inputValue}
            onChange={handleInputChange}
          />
          {
            (!isValidInput) ?
              <button disabled className={`w-16 h-12 p-2 m-2 text-black text-xl border-4 border-black rounded bg-mono-2`}>시작</button>
              : <Button label="시작" onClick={() => {
                handleClick('시작', parseInt(inputValue) * 60)
              }} isActive={false}/>
          }
        </div>
      }
    </div>
  );
};

export default TimerSelector;
