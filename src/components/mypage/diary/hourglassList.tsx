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
    <div className="max-w-[800px] min-w-[400px]">
      <h3>일간 작업 목록</h3>
      <div className="p-4 box-border border bg-[#eeeeee] rounded-lg shadow-lg">
        <div className={styles.list}>
          {hourglasses.map((task) => (
            <div
              key={task.hid}
              className={`${styles.task} ${selectedHourglass && selectedHourglass.hid === task.hid ? styles.selected : ''}`}
              onClick={() => handleTaskClick(task)}
            >
              <div className={styles.category} style={{ backgroundColor: task.color }}>{task.categoryName}</div>
              <div className={styles.details}>
                <p className={styles.taskName} title={task.taskName}>{task.taskName}</p>
                <p className={styles.description} title={task.content}>{task.content}</p>
                <div className={styles.timeRangeContainer}>
                  <p className={styles.time}>{Math.floor(task.timeBurst / 60)}분</p>
                  <p className={styles.timeRange}>{formatTime(task.timeStart)} ~ {formatTime(task.timeEnd)}</p>
                  <div className={styles.satisfaction}>
                    {'★'.repeat(task.rating).split('').map((star, i) => (
                      <span key={i} className={styles.star}>{star}</span>
                    ))}
                    {'☆'.repeat(5 - task.rating).split('').map((star, i) => (
                      <span key={i} className={styles.star}>{star}</span>
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
