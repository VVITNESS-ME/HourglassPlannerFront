'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import useDiaryState from '../../../store/diaryStore';
import styles from './calendar.module.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tasks, setTasks, setTil, selectedDate, setSelectedDate } = useDiaryState();

  const fetchData = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      const tasksResponse = await fetch(`https://api.example.com/tasks?date=${formattedDate}`);
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);

      const tilResponse = await fetch(`https://api.example.com/til?date=${formattedDate}`);
      const tilData = await tilResponse.json();
      setTil(tilData.til);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    fetchData(today);
  }, []);

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
        <div className={`${styles.col} ${styles.colStart}`} onClick={prevMonth}>
          <div className="icon">chevron_left</div>
        </div>
        <div className={`${styles.col} ${styles.colCenter}`}>
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className={`${styles.col} ${styles.colEnd}`} onClick={nextMonth}>
          <div className="icon">chevron_right</div>
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
      <div className={styles.dataDisplay}>
        <h3>Tasks</h3>
        {tasks.map((task, index) => (
          <div key={index}>
            <p>Category: {task.category}</p>
            <p>Task: {task.task}</p>
            <p>Start: {task.timeStart}</p>
            <p>End: {task.timeEnd}</p>
            <p>Satisfaction: {task.satisfaction}</p>
          </div>
        ))}
        <h3>TIL</h3>
        <p>{useDiaryState.getState().til}</p>
      </div>
    </div>
  );
};

export default Calendar;
