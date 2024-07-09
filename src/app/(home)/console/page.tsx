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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1">
          <Calendar />
        </div>
        <div className="col-span-1">
          <TodayTasks />
        </div>
        <div className="col-span-1">
          <Hourglass />
        </div>
        <div className="col-span-1">
          <SandTimerTasks />
        </div>
        <div className="col-span-1">
          <CompletedTasks />
        </div>
        <div className="col-span-1">
          <AchievementCard />
        </div>
      </div>
    </div>
  );
};

export default MainConsole;
