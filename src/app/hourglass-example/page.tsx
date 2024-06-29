// src/app/hourglass-example/page.tsx
'use client';

import React, { useState } from 'react';
import Hourglass from '../../components/hourglass';
import { useHourglassStore } from '../../../store/hourglassStore';

const Page: React.FC = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const handleSetTime = useHourglassStore((state) => state.handleSetTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSetTime(hours, minutes, seconds);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Hours:
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </label>
        <label>
          Minutes:
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </label>
        <label>
          Seconds:
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
          />
        </label>
        <button type="submit">Set Time</button>
      </form>
      <Hourglass />
    </div>
  );
};

export default Page;
