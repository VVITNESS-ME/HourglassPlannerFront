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
    <div className="flex flex-col border-4 border-black w-full h-[253px] bg-mypage-layout mypage-md rounded p-4">
      <div>
        <p className="text-3xl font-semibold">집중도</p>
      </div>
      <div className="flex flex-col items-center justify-between h-full py-4">
        <p className="text-4xl"><strong>집중도:</strong> {attentionRatio.toFixed(0)}%</p>
        <p className="text-4xl"><strong>활동시간:</strong> {Math.floor(totalTime / 3600)} 시간 {Math.floor((totalTime % 3600) / 60)} 분</p>
        <p className="text-4xl"><strong>졸음, 자리이탈:</strong> {Math.floor(miaTime / 3600)} 시간 {Math.floor((miaTime % 3600) / 60)} 분</p>
      </div>
    </div>
  );
};

export default AttentionMetric;
