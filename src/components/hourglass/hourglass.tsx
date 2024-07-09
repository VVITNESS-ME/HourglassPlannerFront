'use client';

import React, { useEffect } from 'react';
import TimerSelector from './timerSelector';
import HourglassAni from './hourglassAni';
import TimerRunning from './timerRunning';
import { useHourglassStore } from '../../../store/hourglassStore';

const Hourglass: React.FC = () => {
  const { isRunning, isInitialized, initialize } = useHourglassStore(state => ({
    isRunning: state.isRunning,
    isInitialized: state.isInitialized,
    initialize: state.initialize,
  }));
  const toggleBBMode = useHourglassStore((state) => state.toggleBBMode);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <div>Loading...</div>; // 초기화 중일 때 로딩 상태 표시
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={toggleBBMode}>외쳐 BB!!</button>
      <HourglassAni/>
      {isRunning ? <TimerRunning /> : <TimerSelector />}
    </div>
  );
};

export default Hourglass;
