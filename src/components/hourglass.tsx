// components/hourglass.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useHourglassStore } from '../../store/hourglassStore';
import Cookies from 'js-cookie';

const Hourglass: React.FC = () => {
  const startTime = useHourglassStore((state) => state.startTime);
  const duration = useHourglassStore((state) => state.duration);
  const endTime = useHourglassStore((state) => state.endTime);
  const isRunning = useHourglassStore((state) => state.isRunning);
  const setEndTime = useHourglassStore((state) => state.setEndTime);
  const toggleRunning = useHourglassStore((state) => state.toggleRunning);
  const stopTimer = useHourglassStore((state) => state.stopTimer);

  const [remainingTime, setRemainingTime] = useState<number>(duration);

  useEffect(() => {
    const savedState = Cookies.get('timerState');
    if (savedState) {
      const { startTime, duration, isRunning } = JSON.parse(savedState);
      const now = new Date().getTime();
      const endTime = new Date(startTime).getTime() + duration;
      if (isRunning && now < endTime) {
        setRemainingTime(endTime - now);
      } else if (isRunning && now >= endTime) {
        setEndTime(new Date());
        stopTimer();
        alert('Time is up!');
      }
    }
  }, [setEndTime, stopTimer]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && duration > 0) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = (startTime?.getTime() || 0) + duration;
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
          clearInterval(timer);
          setEndTime(new Date());
          stopTimer();
          alert('Time is up!');
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, duration, startTime, setEndTime, stopTimer]);

  return (
    <div>
      <h1>Time Tracker</h1>
      <div>
        <button onClick={toggleRunning}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={stopTimer}>Stop</button>
      </div>
      <div>
        <p>Start Time: {startTime ? startTime.toString() : 'Not set'}</p>
        <p>Remaining Time: {Math.ceil(remainingTime / 1000)} seconds</p>
      </div>
    </div>
  );
};

export default Hourglass;
