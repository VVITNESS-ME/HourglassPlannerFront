'use client';
import React from 'react';
import StatisticsContent from '../../../../components/mypage/statistics/StatisticsContent';
import GardenCalendar from '@/components/mypage/statistics/gardenCalendar';
import PieGraph from '@/components/mypage/statistics/pieGraph';
import ProfileCard from "@/components/mypage/profile/profileCard";
import CategorySettings from "@/components/mypage/profile/categorySettings";
import TitleList from "@/components/mypage/profile/titleList";

const Statistics = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
         <div className="flex-1 min-w-[400px] max-w-[600px] mb-4">
           <GardenCalendar/>
         </div>
         <div className="flex-1 min-w-[400px] max-w-[600px] mb-4">
           <PieGraph/>
         </div>
      </div>
      <StatisticsContent/>
    </div>
  );
};

export default Statistics;
