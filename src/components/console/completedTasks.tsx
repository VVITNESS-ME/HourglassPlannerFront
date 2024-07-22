'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import CardLayout from '../cardLayout';
import { Task } from '@/type/types';

interface CompletedTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskComplete: (taskId: number) => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ tasks, setTasks, onTaskComplete }) => {
  const fetchCompletedTasks = useCallback(async () => {
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
          title: task.title,
          color: task.color,
          taskId: task.taskId,
        }));
        setTasks(fetchedTasks);
      } else {
        console.error('Failed to fetch completed tasks');
      }
    } catch (error) {
      console.error('Error fetching completed tasks', error);
    }
  }, [setTasks]);

  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  const handleDrop = async (taskId: number) => {
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
        fetchCompletedTasks();
      } else {
        console.error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task', error);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: any) => handleDrop(item.taskId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLUListElement>(null);
  drop(ref);

  return (
    <div className="w-full h-full border rounded mypage-md">
      <CardLayout title="해낸 일">
        <ul ref={ref} className={`min-h-[200px] ${isOver ? 'bg-other-100' : ''}`}>
          {tasks.map((task, index) => (
            <li key={index} className="flex justify-between text-2xl bg-console-active h-14 rounded-sm pd items-center p-3 mb-2 whitespace-nowrap pr-4">
              <span>{task.title}</span>
              <span className={`ml-2 w-8 h-8 rounded-full`} style={{ backgroundColor: task.color }}></span>
            </li>
          ))}
        </ul>
      </CardLayout>
    </div>
  );
};

export default CompletedTasks;
