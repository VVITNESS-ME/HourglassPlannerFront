'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import useStatisticsStore, { fetchDailyData, fetchWeeklyData, fetchMonthlyData } from '../../../../store/statisticsStore';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

interface MonthlyData {
  month: number;
  totalBurst: number;
}

interface MonthData {
  date: string;
  totalBurst: number;
}

const fillMissingMonthlyData = (data: MonthlyData[]): MonthData[] => {
  console.log(data);
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 숫자로 된 월 배열 생성
  return months.map(month => {
    const found = data.find(item => item.month === month);
    return {
      date: `${month}월`,
      totalBurst: found ? found.totalBurst : 0,
    };
  });
};

const StatisticsContent: React.FC = () => {
  const { dailyData, weeklyData, monthlyData, selectedDate, setDailyData, setWeeklyData, setMonthlyData } = useStatisticsStore();
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
              setDailyData(data.data.byDays || []);
            }
            break;
          case 'weekly':
            data = await fetchWeeklyData(state);
            if (data) {
              setWeeklyData(data.data.byDays || []);
            }
            break;
          case 'monthly':
            data = await fetchMonthlyData(state);
            if (data) {
              setMonthlyData(fillMissingMonthlyData(data.data.byDays || []));
            }
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndSetState();
  }, [selectedTab, selectedDate, setDailyData, setWeeklyData, setMonthlyData]);

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
    labels: monthlyData.map(item => item.date),
    datasets: [
      {
        label: '공부 시간',
        data: monthlyData.map(item => item.totalBurst),
        backgroundColor: '#1E90FF',
      },
    ],
  };

  return (
    <div className="p-8 bg-[#eeeeee] border min-w-[400px] h-[600px] flex flex-col items-center rounded-lg shadow-lg">
      <div className="w-full">
        <Tabs onSelect={handleTabSelect}>
          <TabList>
            <Tab>주간 통계</Tab>
            <Tab>월간 통계</Tab>
            <Tab>년간 통계</Tab>
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
