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
          <div className="flex flex-col gap-4">
            <div className="flex w-[450px] h-[420px] mb-4">
              <Calendar/>
            </div>
            <div className="flex w-[450px] h-[420px] mb-4">
              <SandTimerSecretary/>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex w-[450px] h-[420px] mb-4">
              <TodayTasks tasks={todayTasks} setTasks={setTodayTasks} onTaskComplete={handleTaskComplete}/>
            </div>
            <div className="flex w-[450px] h-[420px] mb-4">
              <CompletedTasks tasks={completedTasks} setTasks={setCompletedTasks} onTaskComplete={handleTaskComplete}/>
            </div>
          </div>

          <div className="flex justify-center border-4 border-black items-center w-[450px] h-[874px] mb-4 relative bg-console-layout rounded mypage-md border">
            <Hourglass width={250}/>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MainConsole;
