'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import useConsoleStore from '../../../store/consoleStore';
import styles from '../mypage/diary/calendar.module.css';
import ScheduleModal from './consoleCalendarModal';

interface Schedule {
  dDay: number; // Assuming Schedule has a property named dDay of type number
  description: string;
}

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
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 날짜 비교
    if (day >= today) {
      setSelectedDate(day);
      setIsModalOpen(true); // 모달 열기
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRegisterSchedules = (newSchedules: string[]) => {
    const td = new Date();

    // 등록된 일정을 state에 반영
    const formattedSchedules = newSchedules.map(schedule => ({
      description: schedule,
      dday: Math.ceil((selectedDate!.getTime() - td.getTime()) / (1000 * 60 * 60 * 24)),
    }));

    setSchedules([...schedules, ...formattedSchedules]);

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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 날짜 비교
        const isFutureOrTodayDate = day >= today; // 오늘 또는 미래 날짜인 경우
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isSameDayInSchedules = schedules.some(schedule => isSameDay(new Date(schedule.dday), cloneDay));

        days.push(
          <div
            className={`${styles.col} ${styles.cell} ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''} ${isSameDayInSchedules ? 'bg-[#f4a261] text-white' : ''} ${isSelected ? 'bg-orange-500 text-white' : ''} ${isFutureOrTodayDate ? styles.future : ""}`}
            key={day.toString()}
            onClick={() => isFutureOrTodayDate && handleDayClick(cloneDay)}
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
    <div className={`${styles.calendar} p-4 w-full mx-auto bg-[#eeeeee] border rounded-lg shadow-lg h-full`}>
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
