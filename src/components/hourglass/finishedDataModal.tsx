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

interface FinishedDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinishedDataModal: React.FC<FinishedDataModalProps> = ({ isOpen, onClose }) => {
  const finishData = useHourglassStore<DailyData>(state => state.dailyData.at(-1)!);
  const total = (finishData.end.getTime()-finishData.start.getTime())/1000
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const netHours = Math.floor(finishData.burst / 3600);
  const netMinutes = Math.floor((finishData.burst % 3600) / 60);
  const pieChartData = {
    labels: [finishData.categoryName, "졸음/자리비움"],
    datasets: [
      {
        data: [finishData.burst, (total-finishData.burst)],
        backgroundColor: [finishData.color, "red"],
      },
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-10">
      <div className="bg-white z-50 rounded-lg overflow-hidden shadow-lg w-96">
        <div className="p-6">
          <div className='flex w-full justify-between'>
            <div className="text-lg font-bold mb-4">Hourglass Data Summary</div>
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
            <div className="text-xl font-bold mb-2">
              총 공부시간: {hours} 시간 {minutes} 분
            </div>
            <div className="text-xl font-bold mb-2">
              순 공부시간: {netHours} 시간 {netMinutes} 분
            </div>
            <div className="flex flex-row text-2xl font-bold mb-4">
              <div className='flex'>집중도: {(finishData.burst*100/total).toFixed(1)}</div> 
              <div className='flex text-red-500'>%</div> 
            </div>
            <p className="text-lg font-medium mb-4">집중도 통계</p>
            <div className="w-96">
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

export default FinishedDataModal;