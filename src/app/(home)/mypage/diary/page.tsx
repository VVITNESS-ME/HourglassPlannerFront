'use client';

import React, { useEffect } from 'react';
import Calendar from '../../../../components/mypage/diary/calendar'
import HourglassList from '../../../../components/mypage/diary/hourglassList';
import HourglassDetail from '../../../../components/mypage/diary/hourglassDetail';
import TilConsole from "@/components/mypage/diary/tilConsole";


const Diary: React.FC = () => {

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <Calendar/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <TilConsole/>
        </div>
      </ div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <HourglassList/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <HourglassDetail/>
        </div>
      </div>
      <h1>테스트 페이지</h1>
    </div>
  );
};

export default Diary;
