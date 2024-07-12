'use client';

import React, { useEffect } from 'react';
import TimerSelector from './timerSelector';
import HourglassAni from './hourglassAni';
import TimerRunning from './timerRunning';
import { useHourglassStore, fetchHourglassInProgress } from '../../../store/hourglassStore';
import DailyDataModal from "@/components/hourglass/dailyDataModal";

const Hourglass: React.FC = () => {
  const { isRunning, isInitialized, initialize } = useHourglassStore(state => ({
    isRunning: state.isRunning,
    isInitialized: state.isInitialized,
    initialize: state.initialize,
  }));
  const taskName = useHourglassStore(state => state.taskName);
  const toggleBBMode = useHourglassStore((state) => state.toggleBBMode);
  const resultModalOpen = useHourglassStore((state) => state.resultModalOpen);
  const closeResultModal = useHourglassStore((state) => state.closeResultModal);
  const checkHourglassInProgress = useHourglassStore((state) => state.checkHourglassInProgress);
  const setCheckHourglassInProgress = useHourglassStore(state => state.setCheckHourglassInProgress);
  useEffect(() => {
    initialize();
    if(!checkHourglassInProgress){
      fetchHourglassInProgress();
      setCheckHourglassInProgress(true);
    }
  }, [initialize]);
  if (!isInitialized) {
    return <div>Loading...</div>; // 초기화 중일 때 로딩 상태 표시
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="min-h-[24px]">{taskName}</h2>
      <HourglassAni />
      {isRunning ? <TimerRunning /> : <TimerSelector />}
      <button onClick={toggleBBMode}>외쳐 BB!!</button>
      <DailyDataModal isOpen={resultModalOpen} onClose={closeResultModal} />
    </div>
  );
};

export default Hourglass;
