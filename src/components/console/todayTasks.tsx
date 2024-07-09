'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CardLayout from '../cardLayout';
import TodoModal from './todoModal';
import CategoryModal from '../mypage/profile/categoryModal';

const TodayTasks: React.FC = () => {

  interface Task {
    color: string;
    taskId: bigint;
    title: string;
    userCategoryName: string;
  }
  interface UserCategory {
    userCategoryId: number;
    categoryName: string;
    color: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<bigint | null>(null);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/todo/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.data.schedules);
      } else {
        console.error('Failed to fetch schedules');
      }
    } catch (error) {
      console.error('Error fetching schedules', error);
    }
  }, []);

  const fetchUserCategories = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserCategories(data.data.userCategoriesWithName);
      } else {
        console.error('Failed to fetch user categories');
      }
    } catch (error) {
      console.error('Error fetching user categories:', error);
    }
  }, []);

  const handleAddTask = (task: { text: string; color: string; categoryName: string }) => {
    const maxId = tasks.reduce((max, task) => Math.max(max, Number(task.taskId)), 0);
    const newTaskId: bigint = BigInt(maxId + 1);
    const newTask: Task = {
      color: task.color,
      taskId: newTaskId,
      title: task.text,
      userCategoryName: task.categoryName,
    };
    setTasks([...tasks, newTask]);
  };

  const handleAddCategory = async (category: { categoryName: string; color: string }) => {
    // Calculate the new ID
    const maxId = userCategories.reduce((max, category) => Math.max(max, category.userCategoryId), 0);
    const newCategoryId = maxId + 1;

    const newCategory = {
      userCategoryId: newCategoryId,
      categoryName: category.categoryName,
      color: category.color,
    };

    // Optimistically update the UI
    setUserCategories((prevCategories) => [...prevCategories, newCategory]);

    // Attempt to add the category to the server
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        console.log('Category added successfully');
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category', error);
    }
  };

  const handleTaskClick = (taskId: bigint) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
  };

  useEffect(() => {
    fetchTasks();
    fetchUserCategories();
  }, [fetchTasks, fetchUserCategories]);

  return (
    <div className='border rounded-lg bg-white p-4'>
      <CardLayout title="오늘의 할일">
        <ul>
          {tasks.map((task) => (
            <li
              key={task.taskId.toString()}
              className={`flex justify-between items-center mb-2 p-2 border rounded-lg cursor-pointer ${
                selectedTask === task.taskId ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleTaskClick(task.taskId)}
            >
              <span>{task.title}</span>
              <span className={`ml-2 w-3 h-3 rounded-full`} style={{ backgroundColor: task.color }}></span>
            </li>
          ))}
        </ul>
      </CardLayout>
      <div className="flex justify-center mt-2">
        <button
          className="text-gray-500 p-2"
          onClick={() => setIsTodoModalOpen(true)}
        >
          + 할 일 추가
        </button>
      </div>
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onAddTask={handleAddTask}
        userCategories={userCategories}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />
    </div>
  );
};

export default TodayTasks;
