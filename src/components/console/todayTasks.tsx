'use client';

import React, { useState } from 'react';
import CardLayout from '../cardLayout';
import TodoModal from './todoModal';

const TodayTasks: React.FC = () => {


  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleAddTask = (task: { text: string; color: string }) => {
    setTasks([...tasks, task]);
  };

  const handleTaskClick = (taskText: string) => {
    setSelectedTask(taskText === selectedTask ? null : taskText);
  };

  return (
    <div>
      <CardLayout title="오늘의 할일" color="bg-blue-200">
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex justify-between items-center mb-2 p-2 border rounded-lg cursor-pointer ${
                selectedTask === task.text ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleTaskClick(task.text)}
            >
              <span>{task.text}</span>
              <span className={`ml-2 w-3 h-3 rounded-full`} style={{ backgroundColor: task.color }}></span>
            </li>
          ))}
        </ul>
        <button
          className="text-gray-500 mt-2"
          onClick={() => setIsModalOpen(true)}
        >
          + 할 일 추가
        </button>
      </CardLayout>
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default TodayTasks;
