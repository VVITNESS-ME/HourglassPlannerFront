'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useHourglassStore } from '../../../store/hourglassStore';
import {black} from "next/dist/lib/picocolors";


// Register the elements
Chart.register(ArcElement, Tooltip, Legend);

interface FinishedDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        font: {
          size: 25, // 범례 글꼴 크기
        },
        color: "#000000", // 범례 텍스트 색상
      },
    },
    tooltip: {
      bodyFont: {
        size: 35, // 툴팁 본문 글꼴 크기
      },
      titleFont: {
        size: 35, // 툴팁 제목 글꼴 크기
      },
      footerFont: {
        size: 35, // 툴팁 바닥 글꼴 크기
      },
    },
  },
};

const FinishedDataModal: React.FC<FinishedDataModalProps> = ({ isOpen, onClose }) => {
  const start = useHourglassStore<Date|null>(state => state.timeStart);
  const end = useHourglassStore<Date|null>(state => state.timeEnd);
  const burst1000 = useHourglassStore<number|null>(state => state.timeBurst);
  const categoryName = useHourglassStore(state => state.dailyData.at(-1)?.categoryName);
  if (!isOpen) return null;
  if (!start || !end || !burst1000|| !categoryName) return null;
  else {
  const burst = burst1000/1000;
  const total = (end.getTime()-start.getTime())/1000;
  const hours = Math.floor(total / 60);
  const minutes = Math.floor((total % 60) / 60);
  const netHours = Math.floor(burst / 60);
  const netMinutes = Math.floor((burst % 60) / 60);
  const paused = total-burst;
  const pieChartData = {
    labels: [categoryName?categoryName:"순 활동시간", "졸음/자리비움"],
    datasets: [
      {
        data: [(burst/60).toFixed(2), (paused/60).toFixed(1)],
        backgroundColor: ["#6ecc7e", "red"],
        borderColor: '#000000',
        borderWidth: 4,
      },
    ],
  };
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white border-4 border-black z-50 rounded overflow-hidden mypage-md w-[600px]">
        <div className="p-6">
          <div className='flex w-full justify-between'>
            <div className="text-4xl font-bold mb-4">Hourglass Data Summary</div>
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
            <div className="text-3xl font-bold mb-2">
              총 활동시간: {hours} 시간 {minutes} 분
            </div>
            <div className="text-2xl font-bold mb-2">
              집중시간: {netHours} 시간 {netMinutes} 분
            </div>
            <div className="flex flex-row text-2xl font-bold mb-4">
              <div className='flex'>집중도: </div>
              {paused>3?<div className='flex text-red-500'>{(burst*100/total).toFixed(1)}%</div>:
              <div className='flex text-red-500'>100%</div>}
              
            </div>
            <p className="text-2xl font-medium mb-4">집중도 통계</p>
            <div className="w-96">
              <Pie data={pieChartData} options={options} />
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-sandy-2 border-4 border-black text-black text-3xl font-bold rounded hover:bg-sandy-3 w-full"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );};}

export default FinishedDataModal;