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
  const start = useHourglassStore<Date|null>(state => state.timeStart);
  const end = useHourglassStore<Date|null>(state => state.timeEnd);
  const burst1000 = useHourglassStore<number|null>(state => state.timeBurst);
  const categoryName = useHourglassStore(state => state.dailyData.at(-1)?.categoryName);
  if (!isOpen) return null;
  if (!start || !end || !burst1000|| !categoryName) return null;
  else {
  const burst = burst1000/1000;
  const total = (end.getTime()-start.getTime())*6/100;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const netHours = Math.floor(burst / 3600);
  const netMinutes = Math.floor((burst % 3600) / 60);
  const paused = total-burst;
  const pieChartData = {
    labels: [categoryName?categoryName:"순 공부시간", "졸음/자리비움"],
    datasets: [
      {
        data: [Math.floor(burst/60), Math.floor(paused/60)],
        backgroundColor: ["#6ecc7e", "red"],
      },
    ],
  };
  
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
              <div className='flex'>집중도: </div>
              {paused>3?<div className='flex text-red-500'>{(burst*100/total).toFixed(1)}%</div>:
              <div className='flex text-red-500'>100%</div>}
              
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
  );};}

export default FinishedDataModal;