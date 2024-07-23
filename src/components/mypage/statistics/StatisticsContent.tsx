'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  ChartOptions
} from 'chart.js';
import useStatisticsStore, { fetchDailyData, fetchWeeklyData, fetchMonthlyData } from '../../../../store/statisticsStore';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // 가로 막대 그래프로 설정
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      font: {
        size: 24 // Font size for tick labels
      },
      text: '오늘의 활동 시간',
    },
    tooltip: {
        bodyFont: {
          size: 30, // 툴팁 본문 글꼴 크기
        },
        titleFont: {
          size: 30, // 툴팁 제목 글꼴 크기
        },
        footerFont: {
          size: 30, // 툴팁 바닥 글꼴 크기
        },
      callbacks: {
        label: (context: any) => {
          const activityTime = context.raw;
          return `${context.dataset.label}: ${activityTime.toFixed(1)}시간`;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      stacked: true, // 막대 그래프를 쌓아서 단일 막대처럼 보이게 설정
      min: 0,
      max: 24,
      ticks: {
        font: {
          size: 18 // Font size for tick labels
        },
        stepSize: 1,
        callback: function (value: string | number) {
          return value + '시'; // 시간으로 표시
        },
      },
    },
    y: {
      beginAtZero: true,
      stacked: true, // 막대 그래프를 쌓아서 단일 막대처럼 보이게 설정
    },
  },
};

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
  const { dailyData, weeklyData, monthlyData, selectedDate, setDailyData, setWeeklyData, setMonthlyData, activities } = useStatisticsStore();
  const [selectedTab, setSelectedTab] = useState<'24h' | 'daily' | 'weekly' | 'monthly'>('daily');
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        let data;
        const state = useStatisticsStore.getState();
        switch (selectedTab) {
          case '24h':
            break;
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
    const tabMapping = ['24h', 'daily', 'weekly', 'monthly'];
    setSelectedTab(tabMapping[index] as '24h' | 'daily' | 'weekly' | 'monthly');
  };

  const dailyChartData = {
    labels: dailyData.map(item => item.weekDay),
    datasets: [
      {
        label: '활동 시간',
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
        label: '활동 시간',
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
        label: '활동 시간',
        data: monthlyData.map(item => item.totalBurst),
        backgroundColor: '#1E90FF',
      },
    ],
  };

  const data = {
    labels: [''],
    datasets: activities.map((activity) => ({
      label: activity.label,
      data: [activity.burst], // 배열로 감싸기
      backgroundColor: activity.color, // 각 활동의 색상
      barThickness: 100, // 막대 두께 설정
    })),
  };

  const tooltipOption = {
    tooltip: {
      bodyFont: {
        size: 30, // 툴팁 본문 글꼴 크기
      },
      titleFont: {
        size: 30, // 툴팁 제목 글꼴 크기
      },
      footerFont: {
        size: 30, // 툴팁 바닥 글꼴 크기
      },
    },
  };
  return (
    <div className="p-8 bg-mypage-layout border min-w-[400px] h-[600px] flex flex-col text-3xl items-center rounded mypage-md">
      <div className="w-full">
        <Tabs onSelect={handleTabSelect}>
          <TabList>
            <Tab>활동 시간</Tab>
            <Tab>일일 통계</Tab>
            <Tab>주간 통계</Tab>
            <Tab>월간 통계</Tab>
          </TabList>

          <TabPanel>
            <h3 className="text-3xl font-bold mb-4">24시간 활동 시간</h3>
            <div className="relative w-full h-[400px]">
                <Bar data={data} options={options} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-3xl font-bold mb-4">총 활동시간: {dailyData.reduce((acc, cur) => acc + cur.totalBurst, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Line data={dailyChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: tooltipOption }} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-3xl font-bold mb-4">총 활동시간: {weeklyData.reduce((acc, cur) => acc + cur.totalBurst, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Bar data={weeklyChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: tooltipOption }} />
            </div>
          </TabPanel>
          <TabPanel>
            <h3 className="text-3xl font-bold mb-4">총 활동시간: {monthlyData.reduce((acc, cur) => acc + cur.totalBurst, 0)}분</h3>
            <div className="relative w-full h-[400px]">
              <Bar data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: tooltipOption}} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default StatisticsContent;
