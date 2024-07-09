// components/MainConsole.tsx
'use client';

import React from 'react';
import AchievementCard from '../../../components/console/achievementCard';
import CompletedTasks from '../../../components/console/completedTasks';
import SandTimerTasks from '../../../components/console/sandTimerSecretary';
import TodayTasks from '../../../components/console/todayTasks';
import Hourglass from '../../../components/hourglass/hourglass';
import Calendar from "@/components/console/consoleCalendar";


const MainConsole: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px] max-w-[700px] h-[650px] mb-4">
          <Calendar/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] h-[650px] mb-4">
          <TodayTasks/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] h-[650px] mb-4">
          <Hourglass/>
        </div>
      </ div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px] max-w-[700px] max-h-[700px] mb-4">
          <SandTimerTasks/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] max-h-[700px] mb-4">
          <CompletedTasks/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] max-h-[700px] mb-4">
          <AchievementCard/>
        </div>
      </ div>
    </div>
  );
};

export default MainConsole;
