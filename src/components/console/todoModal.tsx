// components/TodoModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../general/Button';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { text: string; color: string }) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [taskColor, setTaskColor] = useState('gray');

  const handleAddTask = () => {
    if (taskText.trim()) {
      onAddTask({ text: taskText, color: taskColor });
      setTaskText('');
      setTaskColor('gray');
      onClose();
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
                    <option value="gray">Spring</option>
                    <option value="lightgray">MySQL</option>
                    <option value="green">독서</option>
                    <option value="blue">운동</option>
                    <option value="red">코딩</option>
                    <option value="purple">핀토스</option>
                    <option value="orange">기타</option>
                    <option value="brown">추가1</option>
                    <option value="pink">추가2</option>
                    <option value="yellow">추가3</option>
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
