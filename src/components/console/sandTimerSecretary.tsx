// components/SandTimerTasks.tsx
'use client';

import React from 'react';
import CardLayout from '../cardLayout';

const SandTimerTasks: React.FC = () => {
  const tasks = [
    { text: '기획 발표', status: 'D-DAY' },
    { text: 'MVP 개발', status: 'D-7' },
    { text: '1차 완성 마감', status: 'D-15' },
    { text: '폴리싱 마감', status: 'D-25' },
    { text: '최종 발표 리허설', status: 'D-26' },
    { text: '굉장히 길고 긴 추가 일정 1', status: 'D-30' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 3', status: 'D-50' },
    { text: '굉장히 길고 긴 추가 일정 4', status: 'D-60' },
    { text: '굉장히 길고 긴 추가 일정 5', status: 'D-70' },
    { text: '굉장히 길고 긴 추가 일정 6', status: 'D-80' },
    { text: '굉장히 길고 긴 추가 일정 7', status: 'D-90' },
  ];

  return (
    <CardLayout title="모래시계 비서" color="bg-green-200"> {/* 배경색 수정 */}
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center mb-2 whitespace-nowrap pr-4">  {/* 오른쪽 패딩 추가 */}
            <span>{task.text}</span>
            <span className="text-red-500">{task.status}</span>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default SandTimerTasks;
