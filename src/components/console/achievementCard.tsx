// components/AchievementCard.tsx
'use client';

import React from 'react';
import CardLayout from '../cardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Tick,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Chart.js에서 필요한 구성 요소를 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ChartOptions 타입 정의
const options: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y', // 가로 막대 그래프로 설정
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '오늘의 성취도',
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const activityTime = context.raw;
          return `${context.dataset.label}: ${activityTime}분`;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      stacked: true, // 막대 그래프를 쌓아서 단일 막대처럼 보이게 설정
      ticks: {
        callback: function (value: string | number) {
          return value + '%'; // 비율로 표시
        },
      },
    },
    y: {
      beginAtZero: true,
      stacked: true, // 막대 그래프를 쌓아서 단일 막대처럼 보이게 설정
    },
  },
};

const AchievementCard: React.FC = () => {
  // 전체 시간을 기준으로 비율을 계산한 더미 데이터
  const totalMinutes = 9 * 60 + 20; // 총 시간 (분 단위)
  const activities = [
    { label: '책 읽기', time: 150, color: '#8A2BE2' },
    { label: 'Spring', time: 150, color: '#228B22' },
    { label: '기타', time: 150, color: '#FFA500' },
    { label: '알고리즘', time: 45, color: '#8B0000' },
  ];
  const totalTime = activities.reduce((sum, activity) => sum + activity.time, 0);

  const data = {
    labels: [''],
    datasets: activities.map((activity) => ({
      label: activity.label,
      data: [(activity.time / totalTime) * 100],
      backgroundColor: activity.color,
      barThickness: 10, // 막대 두께 설정
    })),
  };

  return (
    <CardLayout title="오늘의 성취도" width="w-80" height="h-auto">
      <div className="text-center p-4">
        <div className="text-2xl font-bold mb-2">
          07시간 45분 <span className="text-xl font-normal">/ 총 9시간 20분</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">평소보다 33% 많이 공부하셨습니다.</div>
        <div className="text-xl font-bold mb-4">집중도 75%</div>
        <div className="mb-4">
          <Bar data={data} options={options} />
        </div>
        <div className="flex justify-around text-sm text-gray-700">
          {activities.map((activity) => (
            <div key={activity.label} className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: activity.color }}></span>{' '}
                {activity.label}
              </div>
              <div className="font-bold">{activity.time}분</div>
            </div>
          ))}
        </div>
      </div>
    </CardLayout>
  );
};

export default AchievementCard;
