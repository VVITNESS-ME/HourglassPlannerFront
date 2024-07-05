// components/TodayTasks.tsx
'use client';

import React from 'react';
import CardLayout from './cardLayout';

const TodayTasks: React.FC = () => {
  const tasks = [
    { text: '시니컬한 개구리 풀기', color: 'gray' },
    { text: '크래프톤 정글 발표', color: 'lightgray' },
    { text: 'Spring JPA 1장 강의', color: 'green' },
    { text: '굉장히 길고 긴 추가 할일 1', color: 'blue' },
    { text: '굉장히 길고 긴 추가 할일 2', color: 'red' },
    { text: '굉장히 길고 긴 추가 할일 333333333333333333333333333', color: 'purple' },
    { text: '굉장히 길고 긴 추가 할일 4', color: 'orange' },
    { text: '굉장히 길고 긴 추가 할일 5', color: 'brown' },
    { text: '굉장히 길고 긴 추가 할일 6', color: 'pink' },
    { text: '굉장히 길고 긴 추가 할일 7', color: 'yellow' },
  ];

  return (
    <CardLayout title="오늘의 할일" color="bg-blue-200"> {/* 배경색 수정 */}
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center mb-2 whitespace-nowrap pr-4">  {/* 오른쪽 패딩 추가 */}
            <span>{task.text}</span>
            <span className={`ml-2 w-3 h-3 rounded-full`} style={{ backgroundColor: task.color }}></span>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default TodayTasks;
