'use client';

import React, {useCallback, useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import useStatisticsStore from '../../../../store/statisticsStore';
import Button from '@/components/general/button';
import {format} from "date-fns";

const PieGraph: React.FC = () => {
  const { selectedDate, setSelectedDate, pieData, fetchDayData} = useStatisticsStore();
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 29, // 범례 글꼴 크기
          },
          color: '#000000',
        },
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
      },
    },
  };

  const pieChartData = {
    labels: pieData.map(item => item.categoryName),
    datasets: [
      {
        data: pieData.map(item => item.ratio),
        backgroundColor: pieData.map(item => item.color),
      },
    ],
  };

  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);
  return (
    <div className="flex flex-col items-center border w-full h-[600px] bg-mypage-layout mypage-md rounded">
      <div className="flex flex-col items-center mt-4 mb-1">
        <h2 className="text-2xl font-bold mb-1">{selectedDate?.toLocaleDateString('ko-KR')}</h2>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-4xl font-bold mb-2">일일 집중도 통계</h3>
        <div className="mb-4 w-[450px]">
          <Pie data={pieChartData} options={options}/>
        </div>
      </div>
    </div>
  );
};

export default PieGraph;
