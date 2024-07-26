'use client';

import React, { useEffect, useState } from 'react';
import CardLayout from '../cardLayout';
import useConsoleStore from '../../../store/consoleStore'; // useConsoleStore 훅 임포트

interface Task {
  text: string;
  status: string;
}

const SandTimerSecretary: React.FC = () => {
  const { schedules } = useConsoleStore(); // useConsoleStore에서 schedules 상태 사용
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]); // 정렬된 태스크 상태

  // schedules가 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    console.log('schedules:', schedules);
    const sortedSchedules = schedules
      .map(schedule => ({
        text: schedule.description,
        dday: schedule.dday,
        status: `D-${schedule.dday}`
      }))
      .sort((a, b) => a.dday - b.dday); // dDay 기준으로 오름차순 정렬

    setSortedTasks(sortedSchedules);
  }, [schedules]); // schedules가 변경될 때마다 이 effect를 다시 실행

  return (
    <div className="w-full h-full border-4 border-black bg-console-layout rounded-sm shadow-md">
      <CardLayout title="모래시계 비서" width="w-full" height="h-[330px]" color="bg-console-layout"> {/* 배경색 수정 */}
        <ul>
          {sortedTasks.map((task, index) => (
            <li key={index} className="flex text-4xl justify-between items-center p-3 mb-2 bg-console-active rounded whitespace-nowrap pr-4">
              <span>{task.text}</span>
              <span className="text-red-500">{task.status}</span>
            </li>
          ))}
        </ul>
      </CardLayout>
    </div>
  );
};

export default SandTimerSecretary;
``
