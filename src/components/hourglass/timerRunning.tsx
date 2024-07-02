'use client';

import React, { useState, useEffect } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Cookies from 'js-cookie';
import Button from "@/components/hourglass/Button";

const TimerRunning: React.FC = () => {
  const timeStart = useHourglassStore((state) => state.timeStart);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);
  const timeEnd = useHourglassStore((state) => state.timeEnd);
  const isRunning = useHourglassStore((state) => state.isRunning);
  const setTimeEnd = useHourglassStore((state) => state.setTimeEnd);
  const toggleRunning = useHourglassStore((state) => state.toggleRunning);
  const stopTimer = useHourglassStore((state) => state.stopTimer);
  const incrementTimeBurst = useHourglassStore((state) => state.incrementTimeBurst);

  const formatRemainingTime = (milliseconds) => {
    if (milliseconds <= 0) return '0 seconds';

    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} 시간 ${minutes} 분 ${seconds} 초`;
  }

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
      <br/>
      <h1>Time Tracker</h1>
      <div>
        <p>남은시간: {timeGoal !== null ? formatRemainingTime(timeGoal - (timeBurst || 0)) : 'N/A'}</p>
      </div>
      <div>
        <Button label="종료" onClick={stopTimer} isActive={false}/>
      </div>
    </div>
  );
};

export default TimerRunning;
