'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import useStatisticsStore, { fetchDailyData, fetchWeeklyData, fetchMonthlyData } from '../../../../store/statisticsStore';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

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

const StatisticsContent: React.FC = () => {
  const { pieData, dailyData, weeklyData, monthlyData, selectedDate, setSelectedDate, setPieData, setDailyData, setWeeklyData, setMonthlyData } = useStatisticsStore();
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Fetch data on mount and when selectedTab or selectedDate changes
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        let data;
        switch (selectedTab) {
          case 'daily':
            // data = await fetchDailyData();
            data = { pieData: transformedPieData, dailyStatistics: transformedDailyData }; // 테스트 데이터 사용
            if (data) {
              setPieData(data.pieData);
              setDailyData(data.dailyStatistics);
            }
            break;
          case 'weekly':
            // data = await fetchWeeklyData();
            data = { pieData: transformedPieData, weeklyStatistics: transformedWeeklyData }; // 테스트 데이터 사용
            if (data) {
              setPieData(data.pieData);
              setWeeklyData(data.weeklyStatistics);
            }
            break;
          case 'monthly':
            // data = await fetchMonthlyData();
            data = { pieData: transformedPieData, monthlyStatistics: transformedMonthlyData }; // 테스트 데이터 사용
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
  }, [selectedTab, selectedDate, setPieData, setDailyData, setWeeklyData, setMonthlyData]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTabSelect = (index: number) => {
    const tabMapping = ['daily', 'weekly', 'monthly'];
    setSelectedTab(tabMapping[index] as 'daily' | 'weekly' | 'monthly');
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
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex justify-between items-center mb-8 w-full">
        <div>
          <h2 className="text-2xl font-bold mb-4">{selectedDate?.toLocaleDateString('ko-KR')}</h2>
          <div className="flex justify-center items-center space-x-2">
            <button onClick={() => handleDateChange(new Date(selectedDate!.getTime() - 86400000))}>Prev</button>
            <button onClick={() => handleDateChange(new Date(selectedDate!.getTime() + 86400000))}>Next</button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">카테고리별 통계</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
      <div className="w-full">
        <Tabs onSelect={handleTabSelect}>
          <TabList>
            <Tab>일간 통계</Tab>
            <Tab>주간 통계</Tab>
            <Tab>월간 통계</Tab>
          </TabList>

          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {dailyData.reduce((acc, cur) => acc + cur.studyTime, 0)}분</h3>
            <Line data={dailyChartData} />
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {weeklyData.reduce((acc, cur) => acc + cur.studyTime, 0)}분</h3>
            <Line data={weeklyChartData} />
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {monthlyData.reduce((acc, cur) => acc + cur.studyTime, 0)}분</h3>
            <div className="rounded-lg p-4">
              <Bar data={monthlyChartData} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default StatisticsContent;
