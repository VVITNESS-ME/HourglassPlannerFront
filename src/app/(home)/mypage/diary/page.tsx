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
        <div className="flex-1 w-[450px] mb-4">
          <Calendar/>
        </div>
        <div className="flex-1 w-[450px] mb-4">
          <TilConsole/>
        </div>
      </ div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 w-[450px] h-[380px] mb-4">
          <HourglassList/>
        </div>
        <div className="flex-1 w-[450px] h-[380px] mb-4">
          <HourglassDetail/>
        </div>
      </div>
    </div>
  );
};

export default Diary;
