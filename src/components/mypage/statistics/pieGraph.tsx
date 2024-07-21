'use client';

import React, {useCallback, useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import useStatisticsStore from '../../../../store/statisticsStore';
import Button from '@/components/general/button';
import {format} from "date-fns";

const PieGraph: React.FC = () => {
  const { selectedDate, setSelectedDate, pieData, fetchDayData} = useStatisticsStore();
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const pieChartData = {
    labels: pieData.map(item => item.categoryName),
    datasets: [
      {
        data: pieData.map(item => item.ratio),
        backgroundColor: pieData.map(item => item.color),
      },
    ],
  };

  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);
  return (
    <div className="flex flex-col items-center border mb-8 w-full h-[457px] bg-[#eeeeee] shadow-lg rounded-lg">
      <div className="flex flex-col items-center mt-4 mb-1">
        <h2 className="text-2xl font-bold mb-1">{selectedDate?.toLocaleDateString('ko-KR')}</h2>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2">일일 통계</h3>
        <div className="w-80 mb-4">
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default PieGraph;
