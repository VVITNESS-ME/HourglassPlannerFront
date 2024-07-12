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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-96">
        <div className="p-6">
          <div className='flex w-full justify-between'>
            <div className="text-lg font-bold mb-4">Daily Data Summary</div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" color='#aaaaaa' viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center mb-4">
            <h3 className="text-xl font-bold mb-4">오늘의 학습시간: {totalBurst}</h3>
            <p className="text-lg font-medium mb-4">카테고리별 통계</p>
            <div className="w-80">
              <Pie data={pieChartData} />
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-sandy-2 text-white rounded hover:bg-sandy-3 w-full"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyDataModal;
