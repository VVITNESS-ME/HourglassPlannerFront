'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import useDiaryStore from '../../../store/diaryStore';
import styles from './calendar.module.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { hourglasses, setHourglasses, setTil, selectedDate, setSelectedDate } = useDiaryStore();

  const fetchData = useCallback(async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/calendar?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHourglasses(data.hourglassData);
      setTil(data.til);
    } catch (error) {
      console.error('Error fetching data', error);
      // 데이터 로딩 실패 시 사용자에게 알림 (옵션)
      alert('Failed to load data. Please try again later.');
    }
  }, [setHourglasses, setTil]);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    fetchData(today);
  }, [fetchData, setSelectedDate]);

  const handleDayClick = (day: Date) => {
    const today = new Date();
    if (day <= today) {
      setSelectedDate(day);
      fetchData(day);
    }
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className={`${styles.header} ${styles.row}`}>
        <div className={`${styles.nav}`} onClick={prevMonth}>
          <div className="icon">&lt;</div>
        </div>
        <div className={`${styles.colCenter}`}>
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className={`${styles.nav}`} onClick={nextMonth}>
          <div className="icon">&gt;</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eee";
    const days = [];

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={`${styles.col} ${styles.colCenter}`} key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isFutureDate = day > new Date();
        days.push(
          <div
            className={`${styles.col} ${styles.cell} ${!isSameMonth(day, monthStart) ? styles.disabled : selectedDate && isSameDay(day, selectedDate) ? styles.selected : ""} ${isFutureDate ? styles.future : ""}`}
            key={day.toString()}
            onClick={() => !isFutureDate && handleDayClick(cloneDay)}
          >
            <span className={styles.number}>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.row} key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className={styles.body}>{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className={styles.calendar}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;