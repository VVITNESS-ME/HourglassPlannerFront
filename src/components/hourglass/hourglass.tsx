'use client';

import React, { useEffect } from 'react';
import TimerSelector from './timerSelector';
import HourglassAni from './hourglassAni';
import TimerRunning from './timerRunning';
import { useHourglassStore } from '../../../store/hourglassStore';
import DailyDataModal from "@/components/hourglass/dailyDataModal";

const Hourglass: React.FC = () => {
  const { isRunning, isInitialized, initialize } = useHourglassStore(state => ({
    isRunning: state.isRunning,
    isInitialized: state.isInitialized,
    initialize: state.initialize,
  }));
  const toggleBBMode = useHourglassStore((state) => state.toggleBBMode);
  const resultModalOpen = useHourglassStore((state) => state.resultModalOpen);
  const closeResultModal = useHourglassStore((state) => state.closeResultModal);
  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <div>Loading...</div>; // 초기화 중일 때 로딩 상태 표시
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <HourglassAni/>
      {isRunning ? <TimerRunning /> : <TimerSelector />}
      <button onClick={toggleBBMode}>외쳐 BB!!</button>
      <DailyDataModal isOpen={resultModalOpen} onClose={closeResultModal} />
    </div>
  );
};

export default Hourglass;
