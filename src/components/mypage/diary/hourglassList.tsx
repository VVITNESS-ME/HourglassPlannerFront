'use client';

import React from 'react';
import useDiaryState, { Hourglass } from '../../../../store/diaryStore'; // Hourglass 타입을 가져옵니다.
import styles from './hourglassList.module.css';
import { format, parseISO } from 'date-fns';

const HourglassList: React.FC = () => {
  const { hourglass, setSelectedHourglass } = useDiaryState();

  const formatTime = (time: string) => {
    const date = parseISO(time);
    return format(date, 'HH:mm');
  };

  const handleTaskClick = (task: Hourglass) => {
    setSelectedHourglass(task);
  };

  return (
    <div className={styles.hourglassList}>
      <h3>일간 작업 목록</h3>
      <div className={styles.list}>
        {hourglass.map((task, index) => (
          <div key={index} className={styles.task} onClick={() => handleTaskClick(task)}>
            <div className={styles.category} style={{ backgroundColor: task.categoryColor }}>{task.category}</div>
            <div className={styles.details}>
              <p className={styles.taskName} title={task.task}>{task.task}</p>
              <p className={styles.description} title={task.description}>{task.description}</p>
              <div className={styles.timeRangeContainer}>
                <p className={styles.time}>{task.timeBurst}분</p>
                <p className={styles.timeRange}>{formatTime(task.timeStart)} ~ {formatTime(task.timeEnd)}</p>
                <div className={styles.satisfaction}>
                  {'★'.repeat(task.satisfaction).split('').map((star, i) => (
                    <span key={i} className={styles.star}>{star}</span>
                  ))}
                  {'☆'.repeat(5 - task.satisfaction).split('').map((star, i) => (
                    <span key={i} className={styles.star}>{star}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourglassList;
