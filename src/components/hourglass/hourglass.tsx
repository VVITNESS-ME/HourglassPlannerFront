'use client';

import React, {useEffect, useRef, useState} from 'react';
import TimerSelector from './timerSelector';
import HourglassAni from './hourglassAni';
import TimerRunning from './timerRunning';
import { useHourglassStore } from '../../../store/hourglassStore';
// import DailyDataModal from "@/components/hourglass/dailyDataModal";
import FinishedDataModal from './finishedDataModal';
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
  const {beep, setBeep} = useHourglassStore();
  const taskName = useHourglassStore(state => state.taskName);
  const toggleBBMode = useHourglassStore((state) => state.toggleBBMode);
  const resultModalOpen = useHourglassStore((state) => state.resultModalOpen);
  const closeResultModal = useHourglassStore((state) => state.closeResultModal);
  const audioRef = useRef<HTMLAudioElement>(null);
  // 모바일 버전일 경우 
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if(audioRef.current){
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
    }
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
    width = 200
    // return (
    //     <div className={`flex flex-col mt-auto items-center justify-center max-w-[600px] max-h-[800px] w-[200px]`}>
    //       <h2 className="min-h-[24px]">{taskName}</h2>
    //       <HourglassAni wd={180} />
    //       {isRunning ? <TimerRunning wd={200}/> : <TimerSelector wd={200}/>}
    //       <DailyDataModal isOpen={resultModalOpen} onClose={closeResultModal} />
    //     </div>
    //   );
  }

  return (
    <div className={`flex flex-col items-center justify-center max-w-[600px] max-h-[800px] w-[${width}px]`}>
      <audio ref={audioRef} autoPlay>
        <source src="../beep.mp3" type="audio/mpeg"/>
      </audio>
      <h2 className="min-h-[40px] text-3xl font-semibold text-[#333333]">{taskName}</h2>
      <HourglassAni wd={width * 5 / 6}/>
      {isRunning ? <TimerRunning wd={width}/> : <TimerSelector wd={width}/>}
      <FinishedDataModal isOpen={resultModalOpen} onClose={closeResultModal}/>
    </div>
  );

};

export default Hourglass;