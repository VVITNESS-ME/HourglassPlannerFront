'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import useStatisticsStore from '../../../../store/statisticsStore';

const PieGraph: React.FC = () => {
  const selectedDate = useStatisticsStore(state => state.selectedDate);
  const setSelectedDate = useStatisticsStore(state => state.setSelectedDate);
  const pieData = useStatisticsStore(state => state.pieData);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const pieChartData = {
    labels: pieData.map(item => item.label),
    datasets: [
      {
        data: pieData.map(item => item.value),
        backgroundColor: pieData.map(item => item.backgroundColor),
      },
    ],
  };

  return (
    <div className="flex flex-col items-center mb-8 w-full">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-bold mb-2">{selectedDate?.toLocaleDateString('ko-KR')}</h2>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleDateChange(new Date(selectedDate!.getTime() - 86400000))}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleDateChange(new Date(selectedDate!.getTime() + 86400000))}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4">카테고리별 통계</h3>
        <div className="w-80">
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default PieGraph;
