'use client';

import React, { useCallback, useEffect } from 'react';
import useStatisticsStore from '../../../../store/statisticsStore';

const AttentionMetric: React.FC = () => {
  const { totalTime, miaTime } = useStatisticsStore((state) => ({
    totalTime: state.totalTime,
    miaTime: state.miaTime
  }));

  const attentionRatio = totalTime ? ((totalTime - miaTime) / totalTime) * 100 : 0;

  return (
    <div className="flex flex-col border mb-8 w-full h-[190px] bg-mypage-layout shadow-lg rounded-lg p-4">
      <div>
        <p className="text-xl">집중도</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-2xl">집중도: {attentionRatio.toFixed(0)}%</p>
        <p className="text-2xl">총 공부 시간: {Math.floor(totalTime / 3600)} 시간 {Math.floor((totalTime % 3600) / 60)} 분</p>
        <p className="text-2xl">졸음, 자리이탈: {Math.floor(miaTime / 3600)} 시간 {Math.floor((miaTime % 3600) / 60)} 분</p>
      </div>
    </div>
  );
};

export default AttentionMetric;
