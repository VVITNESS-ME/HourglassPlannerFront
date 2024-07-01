'use client';

import React, { useState, useEffect } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Cookies from 'js-cookie';

const HourglassFunction: React.FC = () => {
  const timeStart = useHourglassStore((state) => state.timeStart);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);
  const timeEnd = useHourglassStore((state) => state.timeEnd);
  const isRunning = useHourglassStore((state) => state.isRunning);
  const setTimeEnd = useHourglassStore((state) => state.setTimeEnd);
  const toggleRunning = useHourglassStore((state) => state.toggleRunning);
  const stopTimer = useHourglassStore((state) => state.stopTimer);
  const incrementTimeBurst = useHourglassStore((state) => state.incrementTimeBurst);

  useEffect(() => {
    const savedState = Cookies.get('timerState');
    if (savedState) {
      const { timeStart, timeBurst, timeGoal, isRunning } = JSON.parse(savedState);
      const now = new Date().getTime();
      const endTime = new Date(timeStart).getTime() + timeGoal;
      if (isRunning && now < endTime) {
        incrementTimeBurst();
      } else if (isRunning && now >= endTime) {
        setTimeEnd(new Date());
        stopTimer();
        alert('Time is up!');
      }
    }
  }, [setTimeEnd, stopTimer, incrementTimeBurst]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        incrementTimeBurst();

        if (timeGoal !== null && timeBurst !== null && timeBurst >= timeGoal) {
          clearInterval(timer);
          setTimeEnd(new Date());
          stopTimer();
          alert('Time is up!');
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeBurst, timeGoal, setTimeEnd, stopTimer, incrementTimeBurst]);

  return (
    <div className='flex flex-col w-max justify-center items-center'>
      <br />
      <h1>Time Tracker</h1>
      <div>
        <button onClick={toggleRunning}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={stopTimer}>Stop</button>
      </div>
      <div>
        <p>Start Time: {timeStart ? timeStart.toString() : 'Not set'}</p>
        <p>Elapsed Time: {Math.ceil((timeBurst || 0) / 1000)} seconds</p>
        <p>Remaining Time: {timeGoal !== null ? Math.ceil((timeGoal - (timeBurst || 0)) / 1000) : 'N/A'} seconds</p>
      </div>
    </div>
  );
};

export default HourglassFunction;
