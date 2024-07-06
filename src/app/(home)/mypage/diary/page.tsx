'use client';

import React, { useEffect } from 'react';
import useDiaryState from '../../../../../store/diaryStore';
import Calendar from '../../../../components/mypage/diary/calendar'
import HourglassList from '../../../../components/mypage/diary/hourglassList';
import HourglassDetail from '../../../../components/mypage/diary/hourglassDetail';
import TilConsole from "@/components/mypage/diary/tilConsole";
import ProfileCard from "@/components/mypage/profile/profileCard";
import CategorySettings from "@/components/mypage/profile/categorySettings";
import TitleList from "@/components/mypage/profile/titleList";

const Diary: React.FC = () => {
  const { setHourglasses, setTil, setSelectedDate } = useDiaryState();

  useEffect(() => {
    const today = new Date();
    const initialHourglassesData = [
      {
        hId: '1',
        category: '다섯글자글',
        categoryColor: '#F2CD88',
        task: 'Develop feature X',
        description: 'Implementing the new feature X for the project.',
        timeStart: '2023-07-05T09:00:00Z',
        timeEnd: '2023-07-05T12:00:00Z',
        timeBurst: 180,
        satisfaction: 4,
      },
      {
        hId: '2',
        category: 'Exercise',
        categoryColor: '#F2BA52',
        task: 'Morning run',
        description: '30-minute morning run in the park.',
        timeStart: '2023-07-05T06:00:00Z',
        timeEnd: '2023-07-05T06:30:00Z',
        timeBurst: 30,
        satisfaction: 5,
      },
      {
        hId: '3',
        category: 'Exercise',
        categoryColor: '#F2A950',
        task: 'Morning run',
        description: '30-minute morning run in the park.',
        timeStart: '2023-07-05T06:00:00Z',
        timeEnd: '2023-07-05T06:30:00Z',
        timeBurst: 30,
        satisfaction: 3,
      },
      {
        hId: '4',
        category: 'Exercise',
        categoryColor: '#BFBFBF',
        task: 'Morning run',
        description: '30-minute morning run in the park.',
        timeStart: '2023-07-05T06:00:00Z',
        timeEnd: '2023-07-05T06:30:00Z',
        timeBurst: 30,
        satisfaction: 2,
      },
    ];

    setHourglasses(initialHourglassesData);
    setTil('Today I learned about advanced TypeScript features.');
    setSelectedDate(today);
  }, [setHourglasses, setTil, setSelectedDate]);

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
