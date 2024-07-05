'use client';

import React, { useEffect } from 'react';
import useDiaryState from '../../../../store/diaryStore';
import Calendar from '../../../components/diary/calendar';
import HourglassList from '../../../components/diary/hourglassList';

const TestPage: React.FC = () => {
  const { setHourglass, setTil, setSelectedDate } = useDiaryState();

  useEffect(() => {
    // 초기 테스트 데이터를 설정합니다.
    const today = new Date();
    const initialHourglassData = [
      {
        hId: '1',
        category: 'Work',
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
        task: 'Morning run',
        description: '30-minute morning run in the park.',
        timeStart: '2023-07-05T06:00:00Z',
        timeEnd: '2023-07-05T06:30:00Z',
        timeBurst: 30,
        satisfaction: 5,
      },
      {
        hId: '2',
        category: 'Exercise',
        task: 'Morning run',
        description: '30-minute morning run in the park.',
        timeStart: '2023-07-05T06:00:00Z',
        timeEnd: '2023-07-05T06:30:00Z',
        timeBurst: 30,
        satisfaction: 3,
      },
      {
        hId: '2',
        category: 'Exercise',
        task: 'Morning run',
        description: '30-minute morning run in the park.',
        timeStart: '2023-07-05T06:00:00Z',
        timeEnd: '2023-07-05T06:30:00Z',
        timeBurst: 30,
        satisfaction: 2,
      },
    ];

    setHourglass(initialHourglassData);
    setTil('Today I learned about advanced TypeScript features.');
    setSelectedDate(today);
  }, [setHourglass, setTil, setSelectedDate]);

  return (
    <div>
      <h1>테스트 페이지</h1>
      <Calendar />
      <HourglassList/>
    </div>
  );
};

export default TestPage;
