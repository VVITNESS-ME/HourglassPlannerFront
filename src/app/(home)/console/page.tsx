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

interface Task {
  color: string;
  taskId: bigint;
  title: string;
  userCategoryName: string;
}

const MainConsole: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  const handleTaskComplete = (taskId: bigint) => {
    setTodayTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
    const completedTask = todayTasks.find(task => task.taskId === taskId);
    if (completedTask) {
      setCompletedTasks(prevTasks => [...prevTasks, completedTask]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen p-8 bg-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="flex-1 min-w-[400px] max-w-[700px] h-[650px] mb-4">
            <Calendar/>
          </div>
          <div className="flex-1 min-w-[400px] max-w-[700px] h-[650px] mb-4">
            <TodayTasks tasks={todayTasks} setTasks={setTodayTasks} onTaskComplete={handleTaskComplete}/>
          </div>
          <div className="flex-1 min-w/[400px] max-w/[700px] h-[650px] mb-4">
            <Hourglass/>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="flex-1 min-w/[400px] max-w/[700px] max-h/[700px] mb-4">
            <SandTimerTasks/>
          </div>
          <div className="flex-1 min-w/[400px] max-w/[700px] max-h/[700px] mb-4">
            <CompletedTasks tasks={completedTasks} setTasks={setCompletedTasks} onTaskComplete={handleTaskComplete}/>
          </div>
          <div className="flex-1 min-w/[400px] max-w/[700px] max-h/[700px] mb-4">
            <AchievementCard/>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MainConsole;
