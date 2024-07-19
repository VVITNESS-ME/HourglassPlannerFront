'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, differenceInMinutes } from 'date-fns';
import {useHourglassStore} from "../../../store/hourglassStore";

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
      text: '오늘의 활동 시간',
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
          return value + '분'; // 시간으로 표시
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
  const [activities, setActivities] = useState<{ label: string, time: number, burst: number, color: string }[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [totalBurstTime, setTotalBurstTime] = useState(0);
  const { isRunning } = useHourglassStore();
  const fetchData = useCallback(async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/calendar?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      const categoryTimes: { [key: string]: { time: number, burst: number, color: string } } = {};
      let totalTime = 0;
      let totalBurstTime = 0;

      data.data.records.forEach((record: any) => {
        const timeStart = new Date(record.timeStart);
        const timeEnd = new Date(record.timeEnd);
        const duration = differenceInMinutes(timeEnd, timeStart);

        totalTime += duration;
        totalBurstTime += Math.floor(record.timeBurst / 60);

        if (!categoryTimes[record.categoryName]) {
          categoryTimes[record.categoryName] = { time: 0, burst: 0, color: record.color };
        }
        categoryTimes[record.categoryName].time += duration;
        categoryTimes[record.categoryName].burst += Math.floor(record.timeBurst / 60)
      });

      const activities = Object.keys(categoryTimes).map(key => ({
        label: key,
        time: categoryTimes[key].time,
        burst: categoryTimes[key].burst,
        color: categoryTimes[key].color,
      }));

      setActivities(activities);
      setTotalTime(totalTime);
      setTotalBurstTime(totalBurstTime);

    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, []);

  useEffect(() => {
    fetchData(new Date());
  }, [fetchData, isRunning]);

  const data = {
    labels: [''],
    datasets: activities.map((activity) => ({
      label: activity.label,
      data: [activity.burst],
      backgroundColor: activity.color,
      barThickness: 10, // 막대 두께 설정
    })),
  };

  return (
    <CardLayout title="오늘의 성취도" width="w-80" height="h-auto">
      <div className="text-center p-4">
        <div className="text-2xl font-bold mb-2">
          {Math.floor(totalBurstTime / 60)}시간 {totalBurstTime % 60}분 <span className="text-xl font-normal">/ 총 {Math.floor(totalTime / 60)}시간 {totalTime % 60}분</span>
        </div>
        <div className="text-xl font-bold mb-4">집중도 {(totalBurstTime / totalTime * 100).toFixed(2)}%</div>
        <div className="mb-4">
          <Bar data={data} options={options}/>
        </div>
        <div className="flex justify-around text-sm text-gray-700">
          {activities.map((activity) => (
            <div key={activity.label} className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: activity.color}}></span>{' '}
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
