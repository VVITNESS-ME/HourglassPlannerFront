'use client';
import React from 'react';
import StatisticsContent from '../../../../components/mypage/statistics/StatisticsContent';
import GardenCalendar from '@/components/mypage/statistics/gardenCalendar';
import PieGraph from '@/components/mypage/statistics/pieGraph';
import AttentionMetric from "@/components/mypage/statistics/attentionMetri";

const Statistics = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 w-[600px] mb-4">
          <div className="flex-1 w-[600px] mb-4">
            <GardenCalendar/>
          </div>
          <div className="flex-1 w-[600px]">
            <AttentionMetric/>
          </div>
        </div>
        <div className="flex-1 w-[600px]">
          <PieGraph/>
        </div>
      </div>
      <div className="pb-10">
        <StatisticsContent/>
      </div>
    </div>
  );
};

export default Statistics;
