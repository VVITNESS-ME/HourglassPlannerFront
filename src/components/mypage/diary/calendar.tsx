'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import useDiaryStore from '../../../../store/diaryStore';
import styles from './calendar.module.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { setHourglasses, setTil, selectedDate, setSelectedDate } = useDiaryStore();

  const fetchData = useCallback(async (date: Date) => {
    date.setHours(12);
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/calendar?date=${formattedDate}`, {
        method: 'GET',
          headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setHourglasses(data.data.records);
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
      setSelectedDate(day);
      fetchData(day);
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
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false; // 변경된 부분
        days.push(
          <div
            className={`${styles.col} ${styles.cell} ${!isSameMonth(day, monthStart) ? styles.disabled : isSelected ? styles.selected : ""}`}
            key={day.toString()}
            onClick={() => handleDayClick(cloneDay)}
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
    <div className="w-full border box-border bg-mypage-layout rounded pt-5 pb-9">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
