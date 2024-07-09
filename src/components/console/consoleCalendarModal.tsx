'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../mypage/profile/button';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (schedules: string[]) => void;
  selectedDate: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onRegister, selectedDate }) => {
  const [scheduleText, setScheduleText] = useState('');
  const [schedules, setSchedules] = useState<string[]>([]);

  const handleAddSchedule = () => {
    if (scheduleText.trim()) {
      setSchedules([...schedules, scheduleText]);
      setScheduleText('');
    }
  };

  const handleRegister = () => {
    onRegister(schedules);
    setSchedules([]);
    onClose();
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
                  일정 등록
                </Dialog.Title>
                <div className="mt-2">
                  <div className="mb-4">{selectedDate}</div>
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="일정을 입력하세요"
                      value={scheduleText}
                      onChange={(e) => setScheduleText(e.target.value)}
                    />
                    <Button
                      label="추가"
                      onClick={handleAddSchedule}
                      isActive={true}
                      width="w-20"
                      height="h-10"
                    />
                  </div>
                  <div className="text-left mb-2">추가 목록</div>
                  <div className="overflow-y-auto h-32 border border-gray-300 p-2 rounded">
                    {schedules.map((schedule, index) => (
                      <div key={index} className="bg-yellow-200 p-2 rounded mb-2">
                        {schedule}
                      </div>
                    ))}
                  </div>
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
                    label="등록"
                    onClick={handleRegister}
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

export default ScheduleModal;
