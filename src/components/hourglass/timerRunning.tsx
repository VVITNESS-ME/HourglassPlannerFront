'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHourglassStore } from '../../../store/hourglassStore';
import Cookies from 'js-cookie';
import Button from './button';
import ToggleSwitch from './toggleSwitch';
import Modal from './timerModal';

interface UserCategory {
  userCategoryId: number;
  categoryName: string;
  color: string;
}

interface Props {
  wd: number;
}

const TimerRunning: React.FC<Props> = ({ wd }) => {
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);
  const isRunning = useHourglassStore((state) => state.isRunning);
  const pause = useHourglassStore((state) => state.pause);
  const modalOpen = useHourglassStore((state) => state.modalOpen);
  const setTimeEnd = useHourglassStore((state) => state.setTimeEnd);
  const stopTimer = useHourglassStore((state) => state.stopTimer);
  const stopTimerWithNOAuth = useHourglassStore((state) => state.stopTimerWithNOAuth);
  const incrementTimeBurst = useHourglassStore((state) => state.incrementTimeBurst);
  const popUpModal = useHourglassStore((state) => state.popUpModal);
  const [hideTimer, toggleTimer] = useState(true);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const last_check_time = useRef<number>(new Date().getTime());

  const hideToggle = () => { toggleTimer(!hideTimer); };

  const stopTimerAndFetchCategories = useCallback(async () => {
    const token = Cookies.get(process.env.NEXT_ACCESS_TOKEN_KEY || 'token');
    setTimeout(() => {
      popUpModal();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }, 1000);
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUserCategories(data.data.userCategoriesWithName);
        }
      } catch (error) {
        console.error('Failed to fetch user categories:', error);
      }
    } else {
      stopTimerWithNOAuth();
    }
  }, [popUpModal, stopTimerWithNOAuth]);

  useEffect(() => {
    console.log(userCategories);
  }, [userCategories]);

  const formatRemainingTime = (milliseconds: number) => {
    if (milliseconds <= 0) return '0 seconds';

    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} 시간 ${minutes} 분 ${seconds} 초`;
  };

  useEffect(() => {
    const savedState = Cookies.get('timerState');
    console.log("11");
    if (savedState) {
      const { timeStart, timeGoal, isRunning } = JSON.parse(savedState);
      if (isRunning) {
        const now = new Date().getTime();
        const endTime = new Date(timeStart).getTime() + timeGoal;
        workerRef.current = new Worker('/workers/timerWorker.js');
        workerRef.current.postMessage({ action: 'start', timeStart });
        workerRef.current.onmessage = (event) => {
          const { type, elapsed } = event.data;
          if (isRunning && now < endTime) {
            incrementTimeBurst(elapsed);
            last_check_time.current = new Date().getTime();
          } else if (isRunning && now >= endTime) {
            setTimeEnd(new Date());
            stopTimerAndFetchCategories();
            workerRef.current?.terminate();
          }
        };
      }
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, [setTimeEnd, incrementTimeBurst]);

  useEffect(() => {
    let timer: NodeJS.Timeout | number;
    if (isRunning && !pause) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        incrementTimeBurst(now - last_check_time.current);
        last_check_time.current = now;
        if (timeGoal !== null && timeBurst !== null && timeBurst >= timeGoal) {
          clearInterval(timer);
          setTimeEnd(new Date());
          stopTimerAndFetchCategories();
        }
      }, 1000);
    } else if (pause && workerRef.current) {
      workerRef.current.postMessage({ action: 'stop' });
    } else if (!isRunning && workerRef.current) {
      workerRef.current.postMessage({ action: 'resume' });
    }
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [stopTimerAndFetchCategories, isRunning, pause, timeBurst, timeGoal, setTimeEnd, incrementTimeBurst]);


  if (wd > 250) return (
    <div className='flex flex-col w-max justify-center items-center text-lg md:text-2xl mb-4'>
      <ToggleSwitch hideTimer={hideTimer} toggleTimer={hideToggle} />
      <div {...(hideTimer ? { className: "flex flex-col items-center" } : { className: "hidden" })}>
        <div className='mt-4 mb-2'>
          {timeGoal !== null ? (
            timeGoal - (timeBurst || 0) > 86400000
              ? <p>진행시간: {formatRemainingTime(timeBurst || 0)}</p>
              : <p>남은시간: {formatRemainingTime(timeGoal - (timeBurst || 0))}</p>
          ) : 'N/A'}
        </div>
      </div>
      <div>
        <Button label="종료" onClick={stopTimerAndFetchCategories} isActive={false} />
      </div>
      <Modal isOpen={modalOpen} userCategories={userCategories} setUserCategories={setUserCategories} />
      {timeBurst! >= timeGoal! ? <div style={{ display: "hidden" }}>
        <audio ref={audioRef} autoPlay>
          <source src="../beep.mp3" type="audio/mpeg" />
        </audio>
      </div> : null}
    </div>
  );
  else return (
    <div className='flex flex-col w-max justify-center items-center text-lg md:text-lg'>
      <ToggleSwitch hideTimer={hideTimer} toggleTimer={hideToggle} />
      <div {...(hideTimer ? { className: "flex flex-col items-center" } : { className: "hidden" })}>
        <div className='mt-1'>
          {timeGoal !== null ? (
            timeGoal - (timeBurst || 0) > 86400000
              ? <p>진행시간: {formatRemainingTime(timeBurst || 0)}</p>
              : <p>남은시간: {formatRemainingTime(timeGoal - (timeBurst || 0))}</p>
          ) : 'N/A'}
        </div>
      </div>
      <div>
        <Button label="종료" onClick={stopTimerAndFetchCategories} isActive={false} width='w-16' height='h-10' />
      </div>
      <Modal isOpen={modalOpen} userCategories={userCategories} setUserCategories={setUserCategories} />
      {timeBurst! >= timeGoal! ? <div style={{ display: "hidden" }}>
        <audio ref={audioRef} autoPlay>
          <source src="../beep.mp3" type="audio/mpeg" />
        </audio>
      </div> : null}
    </div>
  );
};

export default TimerRunning;
