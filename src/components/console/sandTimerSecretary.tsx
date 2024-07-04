// components/SandTimerTasks.tsx
'use client';

import React from 'react';
import CardLayout from './cardLayout';

const SandTimerTasks: React.FC = () => {
  const tasks = [
    { text: '기획 발표', status: 'D-DAY' },
    { text: 'MVP 개발', status: 'D-7' },
    { text: '1차 완성 마감', status: 'D-15' },
    { text: '폴리싱 마감', status: 'D-25' },
    { text: '최종 발표 리허설', status: 'D-26' },
    { text: '굉장히 길고 긴 추가 일정 1', status: 'D-30' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 22222222222222222222', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 22', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
    { text: '굉장히 길고 긴 추가 일정 2', status: 'D-40' },
  ];

  return (
    <CardLayout title="모래시계 비서" width="w-80" height="h-72"> {/* 높이와 너비 수정 */}
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center mb-2 whitespace-nowrap">
            <span>{task.text}</span>
            <span className="text-red-500">{task.status}</span>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default SandTimerTasks;
