// components/CompletedTasks.tsx
'use client';

import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import CardLayout from '../cardLayout';

interface Task {
  text: string;
  color: string;
  taskId: bigint;
}

const CompletedTasks: React.FC<{ tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>; onTaskComplete: (taskId: bigint) => void }> = ({ tasks, setTasks, onTaskComplete }) => {
  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/todo/completion`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedTasks = data.data.schedules.map((task: any) => ({
          text: task.title,
          color: task.color,
          taskId: BigInt(task.taskId),
        }));
        setTasks(fetchedTasks);
      } else {
        console.error('Failed to fetch completed tasks');
      }
    } catch (error) {
      console.error('Error fetching completed tasks', error);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: any) => handleDrop(item.taskId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleDrop = async (taskId: bigint) => {
    console.log(`Dropped task with ID: ${taskId}`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/todo/completion?taskId=${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Task completed successfully');
        onTaskComplete(taskId);
      } else {
        console.error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task', error);
    }
  };

  return (
    <CardLayout title="해낸 일" color="bg-white-200"> {/* 배경색 수정 */}
      <ul ref={drop} className={`min-h-[200px] ${isOver ? 'bg-green-100' : ''}`}>
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
