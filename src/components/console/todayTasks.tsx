// components/TodayTasks.tsx
'use client';

import React, { useState } from 'react';
import CardLayout from '../cardLayout';
import TodoModal from './todoModal';

const TodayTasks: React.FC = () => {
  const initialTasks = [
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

  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = (task: { text: string; color: string }) => {
    setTasks([...tasks, task]);
  };

  return (
    <div>
      <CardLayout title="오늘의 할일" color="bg-blue-200">
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="flex justify-between items-center mb-2 whitespace-nowrap pr-4">
              <span>{task.text}</span>
              <span className={`ml-2 w-3 h-3 rounded-full`} style={{ backgroundColor: task.color }}></span>
            </li>
          ))}
        </ul>

      </CardLayout>
      <button
          className="text-gray-500 mt-2"
          onClick={() => setIsModalOpen(true)}
        >
          + 할 일 추가
        </button>
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default TodayTasks;
