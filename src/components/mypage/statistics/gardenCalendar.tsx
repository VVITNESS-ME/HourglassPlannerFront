'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import styles from './gardenCalendar.module.css';

interface DiaryEntry {
  date: string;
  timeBurst: number;
}

interface GardenCalendarProps {
  initialEntries?: DiaryEntry[];
}

const getBackgroundColor = (timeBurst: number) => {
  if (timeBurst >= 600) {
    return 'gold';
  } else if (timeBurst >= 300) {
    return '#F2A950';
  } else if (timeBurst >= 180) {
    return '#F2BA52';
  } else if (timeBurst > 0) {
    return '#ECDBBA';
  } else {
    return 'transparent';
  }
};

const GardenCalendar: React.FC<GardenCalendarProps> = ({ initialEntries = [] }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ date: string, timeBurst: number } | null>(null);

  const fetchData = async (start: string, end: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics/garden?start=${start}&end=${end}`);
      const data = await response.json();
      // 초단위를 분단위로 변환
      const convertedEntries = data.entries.map((entry: DiaryEntry) => ({
        ...entry,
        timeBurst: Math.floor(entry.timeBurst / 60), // 초를 분으로 변환
      }));
      setEntries(convertedEntries);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    if (initialEntries.length === 0) {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      fetchData(start, end);
    }
  }, [initialEntries, initialEntries.length, currentMonth]);

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';
    return (
      <div className={styles.header}>
        <div className={styles.nav} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          &lt;
        </div>
        <div className={styles.title}>{format(currentMonth, dateFormat)}</div>
        <div className={styles.nav} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          &gt;
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className={styles.day}>
          {format(addDays(startDate, i), 'EEE')}
        </div>
      );
    }
    return <div className={styles.days}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const weeks = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const entry = entries.find(entry => isSameDay(new Date(entry.date), currentDay));
        const bgColor = entry ? getBackgroundColor(entry.timeBurst) : 'transparent';
        days.push(
          <div
            key={currentDay.toString()}
            className={`${styles.cell} ${isSameDay(currentDay, new Date()) ? styles.today : ''} ${!isSameMonth(currentDay, monthStart) ? styles.disabled : ''}`}
            onMouseEnter={() => entry && setTooltip({ date: entry.date, timeBurst: entry.timeBurst })}
            onMouseLeave={() => setTooltip(null)}
            style={{ backgroundColor: bgColor }}
          >
            <span className={styles.number}>{format(currentDay, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      weeks.push(
        <div key={day.toString()} className={styles.week}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className={styles.cells}>{weeks}</div>;
  };

  return (
    <div className={styles.garden}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {tooltip && (
        <div className={styles.tooltip}>
          <p>{tooltip.date}</p>
          <p>공부시간(분): {tooltip.timeBurst}</p>
        </div>
      )}
    </div>
  );
};

export default GardenCalendar;
