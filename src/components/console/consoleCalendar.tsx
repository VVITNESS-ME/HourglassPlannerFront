'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import useConsoleStore from '../../../store/consoleStore';
import styles from '../mypage/diary/calendar.module.css';
import ScheduleModal from './consoleCalendarModal';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { schedules, setSchedules } = useConsoleStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/calendar/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSchedules(data.data.schedules);
      } else {
        console.error('Failed to fetch schedules');
      }
    } catch (error) {
      console.error('Error fetching schedules', error);
    }
  };

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    fetchSchedules();
  }, []);

  const handleDayClick = (day: Date) => {
    const today = new Date();
    if (day <= today) {
      setSelectedDate(day);
      setIsModalOpen(true); // 모달 열기
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRegisterSchedules = (schedules: string[]) => {
    // 여기에 일정 등록 로직 구현
    console.log('Registered schedules:', schedules);
    setIsModalOpen(false); // 일정 등록 후 모달 닫기
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
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isSameDayInSchedules = schedules.some(schedule => isSameDay(new Date(schedule.dDay), cloneDay));

        days.push(
          <div
            className={`${styles.col} ${styles.cell} ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''} ${isSameDayInSchedules ? 'bg-[#f4a261] text-white' : ''} ${isSelected ? 'bg-orange-500 text-white' : ''} ${isFutureDate ? styles.future : ""}`}
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
    <div className={`${styles.calendar} p-4 max-w-md mx-auto bg-white rounded-lg shadow-md`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRegister={handleRegisterSchedules}
        selectedDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
      />
    </div>
  );
};

export default Calendar;
