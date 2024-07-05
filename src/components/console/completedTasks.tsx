// components/CompletedTasks.tsx
'use client';

import React from 'react';
import CardLayout from './cardLayout';

const CompletedTasks: React.FC = () => {
  const tasks = [
    { text: '사피엔스 책 읽기', color: 'purple' },
    { text: '굉장히 길고 긴 추가 완료 1', color: 'green' },
    { text: '굉장히 길고 긴 추가 완료 2', color: 'blue' },
    { text: '굉장히 길고 긴 추가 완료 3', color: 'yellow' },
    { text: '굉장히 길고 긴 추가 완료 4', color: 'orange' },
    { text: '굉장히 길고 긴 추가 완료 5', color: 'brown' },
    { text: '굉장히 길고 긴 추가 완료 6', color: 'pink' },
    { text: '굉장히 길고 긴 추가 완료 7', color: 'red' },
  ];

  return (
    <CardLayout title="해낸 일" color="bg-white-200"> {/* 배경색 수정 */}
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

export default CompletedTasks;
