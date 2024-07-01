'use client';

import React, { useState, useEffect } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Cookies from 'js-cookie';
import HourglassAni from './hourglassAni';

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

  const [remainingTime, setRemainingTime] = useState<number>(timeGoal !== null ? timeGoal : 0);

  useEffect(() => {
    const savedState = Cookies.get('timerState');
    if (savedState) {
      const { timeStart, timeBurst, timeGoal, isRunning } = JSON.parse(savedState);
      const now = new Date().getTime();
      const endTime = new Date(timeStart).getTime() + timeGoal;
      if (isRunning && now < endTime) {
        setRemainingTime(endTime - now);
      } else if (isRunning && now >= endTime) {
        setTimeEnd(new Date());
        stopTimer();
        alert('Time is up!');
      }
    }
  }, [setTimeEnd, stopTimer]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        incrementTimeBurst();
        const now = new Date().getTime();
        const endTime = (timeStart?.getTime() || 0) + (timeGoal || 0);
        const timeLeft = endTime - now;

        if (timeGoal !== null && timeLeft <= 0) {
          clearInterval(timer);
          setTimeEnd(new Date());
          stopTimer();
          alert('Time is up!');
        } else if (timeGoal !== null) {
          setRemainingTime(timeLeft);
        } else {
          setRemainingTime((timeBurst || 0) + 1000);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeStart, timeGoal, timeBurst, setTimeEnd, stopTimer, incrementTimeBurst]);

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
        <p>Remaining Time: {Math.ceil(remainingTime / 1000)} seconds</p>
      </div>
    </div>
  );
};

export default HourglassFunction;
