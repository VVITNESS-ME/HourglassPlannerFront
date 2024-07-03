'use client';

import React, { useState, useEffect } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Cookies from 'js-cookie';
import Button from './button';
import ToggleSwitch from './toggleSwitch';
import Modal from './timerModal';

const TimerRunning: React.FC = () => {
  const timeStart = useHourglassStore((state) => state.timeStart);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);
  const timeEnd = useHourglassStore((state) => state.timeEnd);
  const isRunning = useHourglassStore((state) => state.isRunning);
  const pause = useHourglassStore((state) => state.pause);
  const modalOpen = useHourglassStore((state) => state.modalOpen);
  const setTimeEnd = useHourglassStore((state) => state.setTimeEnd);
  const togglePause = useHourglassStore((state) => state.togglePause);
  const stopTimer = useHourglassStore((state) => state.stopTimer);
  const incrementTimeBurst = useHourglassStore((state) => state.incrementTimeBurst);
  const popUpModal = useHourglassStore((state) => state.popUpModal);
  const [hideTimer, toggleTimer] = useState(false);
  const hideToggle = () => { toggleTimer(!hideTimer); };

  const stopTimerAndPopUpModal = () => {
    popUpModal();
  }

  const formatRemainingTime = (milliseconds: number) => {
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

    if (isRunning && !pause) {
      timer = setInterval(() => {
        incrementTimeBurst();

        if (timeGoal !== null && timeBurst !== null && timeBurst >= timeGoal) {
          clearInterval(timer);
          setTimeEnd(new Date());
          stopTimerAndPopUpModal();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, pause, timeBurst, timeGoal, setTimeEnd, stopTimer, incrementTimeBurst]);

  return (
    <div className='flex flex-col w-max justify-center items-center text-2xl'>
      <ToggleSwitch hideTimer={hideTimer} toggleTimer={hideToggle} />
      <div {...(hideTimer ? { className: "flex flex-col items-center" } : { className: "hidden" })}>
        <div className='mt-6'>
          {
            timeGoal !== null ? (
              timeGoal - (timeBurst || 0) > 86400000
                ? <p>진행시간: {formatRemainingTime(timeBurst || 0)}</p>
                : <p>남은시간: {formatRemainingTime(timeGoal - (timeBurst || 0))}</p>
            ) : 'N/A'
          }
        </div>
        <button className='mt-2' onClick={togglePause}>pause/restart</button>
      </div>
      <div>
        <Button label="종료" onClick={stopTimerAndPopUpModal} isActive={false} />
      </div>
      <Modal isOpen={modalOpen} onClose={stopTimer} />
    </div>
  );
};

export default TimerRunning;
