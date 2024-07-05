'use client';

import React from 'react';
import useDiaryState from '../../../store/diaryStore';
import styles from './hourglassList.module.css';
import { format, parseISO } from 'date-fns';

const HourglassList: React.FC = () => {
  const { hourglass } = useDiaryState();

  const renderStars = (satisfaction: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < satisfaction ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatTime = (time: string) => {
    const date = parseISO(time);
    return format(date, 'HH:mm');
  };

  return (
    <div className={styles.hourglassList}>
      <h3>일간 작업 목록</h3>
      <div className={styles.list}>
        {hourglass.map((task, index) => (
          <div key={index} className={styles.task}>
            <div className={styles.category}>{task.category}</div>
            <div className={styles.details}>
              <p className={styles.taskName} title={task.task}>{task.task}</p>
              <p className={styles.description} title={task.description}>{task.description}</p>
              <p className={styles.time}>{task.timeBurst}분</p>
              <p className={styles.timeRange}>{formatTime(task.timeStart)} ~ {formatTime(task.timeEnd)}</p>
              <div className={styles.satisfaction}>{renderStars(task.satisfaction)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourglassList;
