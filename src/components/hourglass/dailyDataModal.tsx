'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useHourglassStore } from '../../../store/hourglassStore';

// Register the elements
Chart.register(ArcElement, Tooltip, Legend);
interface DailyData {
  categoryName: string;
  start: Date;
  end: Date;
  burst: number;
  color: string;
}

interface DailyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DailyDataModal: React.FC<DailyDataModalProps> = ({ isOpen, onClose }) => {
  const pieData = useHourglassStore(state => state.dailyData);

  // Transform the data to aggregate bursts by category
  const aggregatedData = pieData.reduce((acc: DailyData[], curr: DailyData) => {
    const found = acc.find(item => item.categoryName === curr.categoryName);
    if (found) {
      found.burst += curr.burst;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  const totalBurst = aggregatedData.reduce((sum, item) => sum + item.burst, 0);

  const pieChartData = {
    labels: aggregatedData.map(item => item.categoryName),
    datasets: [
      {
        data: aggregatedData.map(item => item.burst),
        backgroundColor: aggregatedData.map(item => item.color),
      },
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col items-center mb-8 w-full relative">
      <button
        className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        X
      </button>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Daily Data Summary</h2>
        <div className="flex space-x-2">
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4">오늘의 학습시간: {totalBurst}</h3>
        <p className="text-lg font-medium mb-4">카테고리별 통계</p>
        <div className="w-80">
          <Pie data={pieChartData}/>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onClose}
      >
        확인
      </button>
    </div>
  );
};

export default DailyDataModal;
