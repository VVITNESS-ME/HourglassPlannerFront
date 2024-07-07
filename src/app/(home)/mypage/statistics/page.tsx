'use client';
import React from 'react';
import StatisticsContent from '../../../../components/mypage/statistics/StatisticsContent';
import GardenCalendar from "@/components/mypage/statistics/gardenCalendar";

const Statistics = () => {
  return (
    <div className="App">
      <GardenCalendar />
      <StatisticsContent />
    </div>
  );
};

export default Statistics;
