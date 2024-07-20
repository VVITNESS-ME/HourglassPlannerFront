// components/MainConsole.tsx
'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AchievementCard from '../../../components/console/achievementCard';
import CompletedTasks from '../../../components/console/completedTasks';
import SandTimerTasks from '../../../components/console/sandTimerSecretary';
import TodayTasks from '../../../components/console/todayTasks';
import Hourglass from '../../../components/hourglass/hourglass';
import Calendar from "@/components/console/consoleCalendar";
import { Task } from '@/type/types';
import SandTimerSecretary from "../../../components/console/sandTimerSecretary";

const MainConsole: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  const handleTaskComplete = (taskId: number) => {
    setTodayTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
    const completedTask = todayTasks.find(task => task.taskId === taskId);
    if (completedTask) {
      setCompletedTasks(prevTasks => [...prevTasks, completedTask]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="flex w-[450px] h-[420px] mb-4 ">
            <Calendar/>
          </div>
          <div className="flex w-[450px] h-[420px] mb-4 ">
            <TodayTasks tasks={todayTasks} setTasks={setTodayTasks} onTaskComplete={handleTaskComplete}/>
          </div>
          <div className="flex justify-center items-center w-[450px] h-[420px] mb-4 relative bg-[#eeeeee] rounded-lg shadow-lg border">
            <Hourglass width={150}/>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="flex w-[450px] h-[410px]">
            <SandTimerSecretary/>
          </div>
          <div className="flex w-[450px] h-[410px]">
            <CompletedTasks tasks={completedTasks} setTasks={setCompletedTasks} onTaskComplete={handleTaskComplete}/>
          </div>
          <div className="flex w-[450px] h-[410px]">
            <AchievementCard/>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MainConsole;
