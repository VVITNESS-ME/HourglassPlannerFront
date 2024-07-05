'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import useDiaryState from '../../../store/diaryStore';
import styles from './calendar.module.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { hourglass, setHourglass, setTil, selectedDate, setSelectedDate } = useDiaryState();

  const fetchData = useCallback(async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/calendar?date=${formattedDate}`);
      const data = await response.json();
      setHourglass(data.hourglassData);
      setTil(data.til);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, [setHourglass, setTil]);

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
        <div className={`${styles.col} ${styles.colStart} ${styles.nav}`} onClick={prevMonth}>
          <div className="icon">&lt;</div>
        </div>
        <div className={`${styles.col} ${styles.colCenter}`}>
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className={`${styles.col} ${styles.colEnd} ${styles.nav}`} onClick={nextMonth}>
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
            className={`${styles.col} ${styles.cell} ${!isSameMonth(day, monthStart) ? styles.disabled : isSameDay(day, selectedDate!) ? styles.selected : ""} ${isFutureDate ? styles.future : ""}`}
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
