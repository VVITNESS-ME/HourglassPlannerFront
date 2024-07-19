'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import styles from './gardenCalendar.module.css';
import useStatisticsStore from '../../../../store/statisticsStore';

interface Grass {
  date: string;
  totalBurst: number;
}

interface GardenCalendarProps {
  initialEntries?: Grass[];
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
  const [tooltip, setTooltip] = useState<{ date: string, timeBurst: number } | null>(null);
  const grasses = useStatisticsStore(state => state.grasses);
  const setGrasses = useStatisticsStore(state => state.setGrasses);
  const setSelectedDate = useStatisticsStore(state => state.setSelectedDate);
  const setRangeSelection = useStatisticsStore(state => state.setRangeSelection);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const fetchData = async (start: string, end: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statics/garden?start=${start}&end=${end}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      const convertedEntries = data.data.entries.map((entry: Grass) => ({
        ...entry,
        timeBurst: Math.floor(entry.totalBurst), // 초를 분으로 변환
      }));
      setGrasses(convertedEntries);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    fetchData(format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd'));
  }, [currentMonth]);

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
        const grass = grasses.find(entry => isSameDay(new Date(entry.date), currentDay));
        const bgColor = grass ? getBackgroundColor(grass.timeBurst) : 'transparent';
        days.push(
          <div
            key={currentDay.toString()}
            className={`${styles.cell} ${isSameDay(currentDay, new Date()) ? styles.today : ''} ${!isSameMonth(currentDay, monthStart) ? styles.disabled : ''}`}
            onMouseEnter={() => grass && setTooltip({ date: grass.date, timeBurst: grass.timeBurst })}
            onMouseLeave={() => setTooltip(null)}
            onClick={() => {
              setSelectedDate(currentDay);
              setRangeSelection('daily');
            }}
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
    <div className="flex flex-col justify-center border items-center relative overflow-hidden h-[510px] bg-[#eeeeee] rounded-lg shadow-lg">
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
