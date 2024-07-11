'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import useStatisticsStore, { fetchDailyData, fetchWeeklyData, fetchMonthlyData } from '../../../../store/statisticsStore';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

interface PieData {
  label: string;
  value: number;
  backgroundColor: string;
}

interface DailyData {
  weekDay: string;
  totalBurst: number;
}

interface MonthData {
  date: string;
  totalBurst: number;
}

interface MonthlyData {
  month: string;
  totalBurst: number;
}

const fillMissingMonthlyData = (data: MonthlyData[]): MonthlyData[] => {
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  return months.map(month => data.find(item => item.month === month) || { month, totalBurst: 0 });
};

const StatisticsContent: React.FC = () => {
  const { pieData, dailyData, weeklyData, monthlyData, setPieData, setDailyData, setWeeklyData, setMonthlyData } = useStatisticsStore();
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        let data;
        const state = useStatisticsStore.getState();
        switch (selectedTab) {
          case 'daily':
            data = await fetchDailyData(state);
            if (data) {
              setPieData(data.data.byCategory || []);
              setDailyData(data.data.byDays || []);
            }
            break;
          case 'weekly':
            data = await fetchWeeklyData(state);
            if (data) {
              setPieData(data.data.byCategory || []);
              setWeeklyData(data.data.byDays || []);
            }
            break;
          case 'monthly':
            data = await fetchMonthlyData(state);
            if (data) {
              setPieData(data.data.byCategory || []);
              setMonthlyData(fillMissingMonthlyData(data.data.byMonths || []));
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
    labels: dailyData.map(item => item.weekDay),
    datasets: [
      {
        label: '공부 시간',
        data: dailyData.map(item => item.totalBurst),
        borderColor: '#1E90FF',
        fill: false,
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyData.map(item => item.date),
    datasets: [
      {
        label: '공부 시간',
        data: weeklyData.map(item => item.totalBurst),
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
        data: monthlyData.map(item => item.totalBurst),
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
            <h3 className="text-xl font-bold mb-4">총 공부시간: {dailyData.reduce((acc, cur) => acc + cur.totalBurst, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Line data={dailyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {weeklyData.reduce((acc, cur) => acc + cur.totalBurst, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Bar data={weeklyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-xl font-bold mb-4">총 공부시간: {monthlyData.reduce((acc, cur) => acc + cur.totalBurst, 0)}분</h3>
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
