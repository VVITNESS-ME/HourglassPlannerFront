'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import useStatisticsStore, { fetchDailyData, fetchWeeklyData, fetchMonthlyData } from '../../../../store/statisticsStore';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const transformedPieData = [
  { label: '핀토스', value: 30, backgroundColor: '#FF4500' },
  { label: '운동', value: 15, backgroundColor: '#FFD700' },
  { label: '알고리즘', value: 20, backgroundColor: '#808080' },
  { label: '기타', value: 35, backgroundColor: '#D3D3D3' },
];

const transformedDailyData = [
  { day: '월', studyTime: 120 },
  { day: '화', studyTime: 150 },
  { day: '수', studyTime: 180 },
  { day: '목', studyTime: 200 },
];

const transformedWeeklyData = [
  { week: '1주', studyTime: 400 },
  { week: '2주', studyTime: 500 },
  { week: '3주', studyTime: 450 },
  { week: '4주', studyTime: 600 },
];

const transformedMonthlyData = [
  { month: '1', studyTime: 400 },
  { month: '2', studyTime: 500 },
  { month: '3', studyTime: 600 },
  { month: '4', studyTime: 550 },
  { month: '5', studyTime: 650 },
  { month: '6', studyTime: 700 },
  { month: '7', studyTime: 800 },
];

const fillMissingDailyData = (data) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return days.map(day => data.find(item => item.day === day) || { day, studyTime: 0 });
};

const fillMissingWeeklyData = (data) => {
  const weeks = ['1주', '2주', '3주', '4주', '5주'];
  return weeks.map(week => data.find(item => item.week === week) || { week, studyTime: 0 });
};

const fillMissingMonthlyData = (data) => {
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  return months.map(month => data.find(item => item.month === month) || { month, studyTime: 0 });
};

const StatisticsContent: React.FC = () => {
  const { pieData, dailyData, weeklyData, monthlyData, setPieData, setDailyData, setWeeklyData, setMonthlyData } = useStatisticsStore();
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Fetch data on mount and when selectedTab changes
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        let data;
        switch (selectedTab) {
          case 'daily':
            // data = { pieData: transformedPieData, dailyStatistics: fillMissingDailyData(await fetchDailyData()) }; // 실제 데이터 사용
            data = { pieData: transformedPieData, dailyStatistics: fillMissingDailyData(transformedDailyData) }; // 테스트 데이터 사용
            if (data) {
              setPieData(data.pieData);
              setDailyData(data.dailyStatistics);
            }
            break;
          case 'weekly':
            // data = { pieData: transformedPieData, weeklyStatistics: fillMissingWeeklyData(await fetchWeeklyData()) }; // 실제 데이터 사용
            data = { pieData: transformedPieData, weeklyStatistics: fillMissingWeeklyData(transformedWeeklyData) }; // 테스트 데이터 사용
            if (data) {
              setPieData(data.pieData);
              setWeeklyData(data.weeklyStatistics);
            }
            break;
          case 'monthly':
            // data = { pieData: transformedPieData, monthlyStatistics: fillMissingMonthlyData(await fetchMonthlyData()) }; // 실제 데이터 사용
            data = { pieData: transformedPieData, monthlyStatistics: fillMissingMonthlyData(transformedMonthlyData) }; // 테스트 데이터 사용
            if (data) {
              setPieData(data.pieData);
              setMonthlyData(data.monthlyStatistics);
            }
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndSetState();
  }, [selectedTab, setPieData, setDailyData, setWeeklyData, setMonthlyData]);

  const handleTabSelect = (index: number) => {
    const tabMapping = ['daily', 'weekly', 'monthly'];
    setSelectedTab(tabMapping[index] as 'daily' | 'weekly' | 'monthly');
  };

  const dailyChartData = {
    labels: dailyData.map(item => item.day),
    datasets: [
      {
        label: '공부 시간',
        data: dailyData.map(item => item.studyTime),
        borderColor: '#1E90FF',
        fill: false,
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyData.map(item => item.week),
    datasets: [
      {
        label: '공부 시간',
        data: weeklyData.map(item => item.studyTime),
        borderColor: '#1E90FF',
        fill: false,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map(item => `${item.month}월`),
    datasets: [
      {
        label: '공부 시간',
        data: monthlyData.map(item => item.studyTime),
        backgroundColor: '#1E90FF',
      },
    ],
  };
  return (
    <div className="p-8 bg-gray-100 min-w-[400px] h-[600px] flex flex-col items-center">
      <div className="w-full">
        <Tabs onSelect={handleTabSelect}>
          <TabList>
            <Tab>일간 통계</Tab>
            <Tab>주간 통계</Tab>
            <Tab>월간 통계</Tab>
          </TabList>

          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {dailyData.reduce((acc, cur) => acc + cur.studyTime, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Line data={dailyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {weeklyData.reduce((acc, cur) => acc + cur.studyTime, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Line data={weeklyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {monthlyData.reduce((acc, cur) => acc + cur.studyTime, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Bar data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default StatisticsContent;
