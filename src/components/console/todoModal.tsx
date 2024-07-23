'use client';

import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from '../mypage/profile/button';
import { UserCategory } from '@/type/types';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { text: string; color: string; categoryName: string }) => void;
  fetchTasks: () => void;
  userCategories: UserCategory[];
  onOpenCategoryModal: () => void;
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onAddTask, fetchTasks, userCategories, onOpenCategoryModal }) => {
  const [taskText, setTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<UserCategory | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTaskText('');
      setSelectedCategory(userCategories[0] || null);
    }
  }, [isOpen, userCategories]);

  const handleAddTask = async () => {
    if (taskText.trim() && selectedCategory) {
      onAddTask({ text: taskText, color: selectedCategory.color, categoryName: selectedCategory.categoryName });
      onClose();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/todo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: taskText,
            userCategoryId: selectedCategory.userCategoryId,
          }),
        });
        if (response.ok) {
          fetchTasks();
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-70" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  할 일 추가
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="할 일을 입력하세요"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                  />
                  <div className="relative mt-2">
                    <select
                      className="w-full p-2 border border-gray-700 rounded appearance-none"
                      value={selectedCategory ? selectedCategory.userCategoryId : ''}
                      onChange={(e) => {
                        const selected = userCategories.find(category => category.userCategoryId === Number(e.target.value));
                        setSelectedCategory(selected || null);
                      }}
                      style={{ backgroundColor: selectedCategory ? selectedCategory.color : 'white' }}
                    >
                      {userCategories.map((category) => (
                        <option key={category.userCategoryId} value={category.userCategoryId} style={{ backgroundColor: category.color }}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
                        <path d="M7 10l5 5 5-5H7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    className="text-gray-500 mt-2"
                    onClick={onOpenCategoryModal}
                  >
                    + 카테고리 추가
                  </button>
                  <div className="flex">
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
