'use client';

import React, { useState, useEffect } from 'react';
import useDiaryState, { Hourglass } from '../../../../store/diaryStore'; // Hourglass 타입을 가져옵니다.
import styles from './hourglassList.module.css';
import { format, parseISO } from 'date-fns';

const HourglassList: React.FC = () => {
  const { hourglasses, setSelectedHourglass, selectedHourglass } = useDiaryState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hourglasses) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    } else if (hourglasses.length === 0) {
      // 데이터 로딩이 끝난 후 빈 배열 확인
      setLoading(false);
    } else {
      setLoading(false);
      setSelectedHourglass(hourglasses[0]);
    }
  }, [hourglasses, setSelectedHourglass]);

  const formatTime = (time: string) => {
    const date = parseISO(time);
    return format(date, 'HH:mm');
  };

  const handleTaskClick = (task: Hourglass) => {
    setSelectedHourglass(task);
  };

  if (loading) {
    return (
      <div className={styles.hourglassList}>
        <h3>일간 작업 목록</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.hourglassList}>
        <h3>일간 작업 목록</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!hourglasses || hourglasses.length === 0) {
    return (
      <div className={styles.hourglassList}>
        <h3>일간 작업 목록</h3>
        <p>현재 등록된 작업이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="p-4 box-border border bg-mypage-layout h-full rounded mypage-md">
        <div className="pl-2 pr-2 pb-2">
          <h3 className=" font-bold text-2xl">일간 작업 목록</h3>
        </div>
        <div className={styles.list}>
          {hourglasses.map((task) => (
            <div
              key={task.hid}
              className={`${styles.task} bg-mypage-active-1 border border-black ${selectedHourglass && selectedHourglass.hid === task.hid ? styles.selected : ''}`}
              onClick={() => handleTaskClick(task)}
            >
              <div className={styles.category} style={{backgroundColor: task.color}}>{task.categoryName}</div>
              <div className={styles.details}>
                <p className={styles.taskName} title={task.taskName}>{task.taskName}</p>
                <p className={styles.description} title={task.content}>{task.content}</p>
                <div className={styles.timeRangeContainer}>
                  <p className={styles.time}>{Math.floor(task.timeBurst / 60)}분</p>
                  <p className={styles.timeRange}>{formatTime(task.timeStart)} ~ {formatTime(task.timeEnd)}</p>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-8 h-8 cursor-pointer ${task.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.362 4.186a1 1 0 00.95.69h4.398c.969 0 1.371 1.24.588 1.81l-3.558 2.582a1 1 0 00-.364 1.118l1.362 4.186c.3.921-.755 1.688-1.54 1.118l-3.558-2.582a1 1 0 00-1.175 0l-3.558 2.582c-.784.57-1.838-.197-1.54-1.118l1.362-4.186a1 1 0 00-.364-1.118L2.049 9.613c-.784-.57-.38-1.81.588-1.81h4.398a1 1 0 00.95-.69l1.362-4.186z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourglassList;
