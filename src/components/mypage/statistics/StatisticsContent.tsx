// components/StatisticsPage.tsx
'use client';

import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const StatisticsContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const pieData = {
    labels: ['핀토스', '운동', '알고리즘', '기타'],
    datasets: [
      {
        data: [30, 15, 20, 35],
        backgroundColor: ['#FF4500', '#FFD700', '#808080', '#D3D3D3'],
      },
    ],
  };

  const dailyData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '공부 시간',
        data: [120, 150, 180, 200, 150, 120, 180],
        borderColor: '#1E90FF',
        fill: false,
      },
    ],
  };

  const weeklyData = {
    labels: ['1주', '2주', '3주', '4주'],
    datasets: [
      {
        label: '공부 시간',
        data: [400, 500, 450, 600],
        borderColor: '#1E90FF',
        fill: false,
      },
    ],
  };

  const monthlyData = {
    labels: ['7월', '8월', '9월', '10월', '11월', '12월', '1월'],
    datasets: [
      {
        label: '공부 시간',
        data: [400, 500, 600, 550, 650, 700, 800],
        backgroundColor: '#1E90FF',
      },
    ],
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex justify-between items-center mb-8 w-full">
        <div>
          <h2 className="text-2xl font-bold mb-4">June 2024</h2>
          <div className="flex justify-center items-center space-x-2">
            <button>Prev</button>
            <button>Next</button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">카테고리별 통계</h3>
          <Pie data={pieData} />
        </div>
      </div>
      <div className="w-full">
        <Tabs>
          <TabList>
            <Tab>일간 통계</Tab>
            <Tab>주간 통계</Tab>
            <Tab>월간 통계</Tab>
          </TabList>

          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: 00시간 00분</h3>
            <Line data={dailyData} />
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: 00시간 00분</h3>
            <Line data={weeklyData} />
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: 00시간 00분</h3>
            <div className="bg-yellow-300 rounded-lg p-4">
              <Bar data={monthlyData} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default StatisticsContent;
