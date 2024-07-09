// components/TodoModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../mypage/profile/button';

// 카테고리 데이터
const categories = [
  { categoryId: 3, categoryName: '독서', color: '#8A2BE2' },
  { categoryId: 4, categoryName: '운동', color: '#FFD700' },
  { categoryId: 5, categoryName: '코딩', color: '#FF69B4' },
  { categoryId: 6, categoryName: '핀토스', color: '#FF4500' },
  { categoryId: 7, categoryName: '알고리즘', color: '#808080' },
  { categoryId: 8, categoryName: 'Spring', color: '#228B22' },
  { categoryId: 9, categoryName: 'MySQL', color: '#1E90FF' },
  { categoryId: 10, categoryName: '독서', color: '#8A2BE2' },
  { categoryId: 11, categoryName: '운동', color: '#FFD700' },
  { categoryId: 12, categoryName: '코딩', color: '#FF69B4' },
  { categoryId: 13, categoryName: '핀토스', color: '#FF4500' },
  { categoryId: 14, categoryName: '알고리즘', color: '#808080' },
];

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { text: string; color: string }) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [taskColor, setTaskColor] = useState(categories[0].color);

  const handleAddTask = async () => {
    if (taskText.trim()) {
      const selectedCategory = categories.find(category => category.color === taskColor);
      const categoryId = selectedCategory ? selectedCategory.categoryId : null;
      // const newTask = { text: taskText, color: taskColor, categoryId };

      // Making the API call to register the task
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/todo/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: taskText,
            userCategoryId: categoryId,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }


      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      // If successful, add the task to the local state
      setTaskText('');
      setTaskColor(categories[0].color);
    }
  }, [isOpen]);


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  할 일 추가
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    placeholder="할 일을 입력하세요"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                  />
                  <select
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={taskColor}
                    onChange={(e) => setTaskColor(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.color}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    label="취소"
                    onClick={onClose}
                    isActive={false}
                    width="w-auto"
                    height="h-10"
                  />
                  <Button
                    label="추가"
                    onClick={handleAddTask}
                    isActive={true}
                    width="w-auto"
                    height="h-10"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TodoModal;
