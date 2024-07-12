'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDrag } from 'react-dnd';
import CardLayout from '../cardLayout';
import TodoModal from './todoModal';
import CategoryModal from '../mypage/profile/categoryModal';
import { Task, UserCategory } from '@/type/types';
import { useHourglassStore } from '../../../store/hourglassStore';
import Cookies from 'js-cookie';

interface TodayTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskComplete: (taskId: number) => void;
}

const TodayTasks: React.FC<TodayTasksProps> = ({ tasks, setTasks, onTaskComplete }) => {
  const timerState = Cookies.get('timerState');
  const parsedState = timerState ? JSON.parse(timerState) : {};
  const initialTaskId = parsedState.tId || null;
  const initialTaskName = parsedState.taskName || '';
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState(initialTaskName);
  const [selectedTask, setSelectedTask] = useState<number | null>(initialTaskId);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const setTid = useHourglassStore((state) => state.setTid);
  const setTaskName = useHourglassStore((state) => state.setTaskName);

  useEffect(() => {
    if (selectedTask != null) {
      setTid(selectedTask);
      setTaskName(selectedTaskName);
    } else {
      setTid(null);
      setTaskName('');
    }
    console.log(selectedTask);
  }, [selectedTask, setTid, setTaskName, selectedTaskName]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/todo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(
          data.data.schedules.map((task: any) => ({
            color: task.color,
            taskId: task.taskId,
            title: task.title,
            userCategoryName: task.userCategoryName,
          }))
        );
      } else {
        console.error('Failed to fetch schedules');
      }
    } catch (error) {
      console.error('Error fetching schedules', error);
    }
  }, [setTasks]);

  const fetchUserCategories = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserCategories(
          data.data.userCategoriesWithName.map((category: any) => ({
            userCategoryId: category.userCategoryId,
            categoryName: category.categoryName,
            color: category.color,
          }))
        );
      } else {
        console.error('Failed to fetch user categories');
      }
    } catch (error) {
      console.error('Error fetching user categories', error);
    }
  }, []);

  const handleAddTask = (task: { text: string; color: string; categoryName: string }) => {
    const maxId = tasks.reduce((max, task) => Math.max(max, task.taskId), 0);
    const newTaskId = maxId + 1;
    const newTask: Task = {
      color: task.color,
      taskId: newTaskId,
      title: task.text,
      userCategoryName: task.categoryName,
    };
    setTasks([...tasks, newTask]);
  };

  const handleAddCategory = async (category: { categoryName: string; color: string }) => {
    const maxId = userCategories.reduce((max, category) => Math.max(max, category.userCategoryId), 0);
    const newCategoryId = maxId + 1;

    const newCategory: UserCategory = {
      userCategoryId: newCategoryId,
      categoryName: category.categoryName,
      color: category.color,
    };

    setUserCategories((prevCategories) => [...prevCategories, newCategory]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
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

  const handleTaskClick = (taskId: number, taskName: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
    setSelectedTaskName(taskId === selectedTask ? '' : taskName);
  };

  useEffect(() => {
    fetchTasks();
    fetchUserCategories();
  }, [fetchTasks, fetchUserCategories]);

  return (
    <div className="border rounded-lg bg-white p-4">
      <CardLayout title="오늘의 할일">
        <ul>
          {tasks.map((task) => (
            <DraggableTask
              key={task.taskId}
              task={task}
              selectedTask={selectedTask}
              onTaskClick={handleTaskClick}
            />
          ))}
        </ul>
      </CardLayout>
      <div className="flex justify-center mt-2">
        <button className="text-gray-500 p-2" onClick={() => setIsTodoModalOpen(true)}>
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
        fetchTasks={fetchTasks}
        userCategories={userCategories}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />
    </div>
  );
};

const DraggableTask: React.FC<{
  task: Task;
  selectedTask: number | null;
  onTaskClick: (taskId: number, taskName: string) => void;
}> = ({ task, selectedTask, onTaskClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { taskId: task.taskId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLLIElement>(null);
  drag(ref);

  return (
    <li
      ref={ref}
      className={`flex justify-between items-center mb-2 p-2 border rounded-lg cursor-pointer ${
        selectedTask === task.taskId ? 'bg-gray-300' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onTaskClick(task.taskId, task.title)}
    >
      <span>{task.title}</span>
      <span className={`ml-2 w-3 h-3 rounded-full`} style={{ backgroundColor: task.color }}></span>
    </li>
  );
};

export default TodayTasks;
