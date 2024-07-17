'use client';

import React, { useEffect, useState } from 'react';
import TimerSelector from './timerSelector';
import HourglassAni from './hourglassAni';
import TimerRunning from './timerRunning';
import { useHourglassStore } from '../../../store/hourglassStore';
import DailyDataModal from "@/components/hourglass/dailyDataModal";
import Cookies from "js-cookie";

interface Props{
  width?: number
}

const Hourglass: React.FC<Props> = ({width=300}) => {
  const { isRunning, isInitialized, initialize, fetchHourglassInProgress } = useHourglassStore(state => ({
    isRunning: state.isRunning,
    isInitialized: state.isInitialized,
    initialize: state.initialize,
    fetchHourglassInProgress: state.fetchHourglassInProgress,
  }));
  const taskName = useHourglassStore(state => state.taskName);
  const toggleBBMode = useHourglassStore((state) => state.toggleBBMode);
  const resultModalOpen = useHourglassStore((state) => state.resultModalOpen);
  const closeResultModal = useHourglassStore((state) => state.closeResultModal);

  // 모바일 버전일 경우 
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 모바일 뷰포트 너비 기준 설정
    };

    handleResize(); // 초기 실행
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const beforeCondition = Cookies.get('timerState');
    console.log(beforeCondition)
    if (beforeCondition) {
      try {
        const parsedState = JSON.parse(beforeCondition);
        console.log(parsedState);
        initialize();
      } catch (e) {
        fetchHourglassInProgress();
      }
    } else {
      fetchHourglassInProgress();
    }
  }, [initialize, fetchHourglassInProgress]);

  if (!isInitialized) {
    return <div>Loading...</div>; // 초기화 중일 때 로딩 상태 표시
  }

  if (isMobile) {
    return (
        <div className={`container flex flex-col fixed bottom-20 items-center justify-center max-w-[600px] max-h-[800px] w-[240px]`}>
          <h2 className="min-h-[24px]">{taskName}</h2>
          <HourglassAni wd={200} />
          {isRunning ? <TimerRunning /> : <TimerSelector />}
          <button onClick={toggleBBMode}>외쳐 BB!!</button>
          <DailyDataModal isOpen={resultModalOpen} onClose={closeResultModal} />
        </div>
      );
  }

  return (
    <div className={`container flex flex-col items-center justify-center max-w-[600px] max-h-[800px] w-[${width}px]`}>
      <h2 className="min-h-[24px]">{taskName}</h2>
      <HourglassAni wd={width*5/6} />
      {isRunning ? <TimerRunning /> : <TimerSelector />}
      <button onClick={toggleBBMode}>외쳐 BB!!</button>
      <DailyDataModal isOpen={resultModalOpen} onClose={closeResultModal} />
    </div>
  );

};

export default Hourglass;